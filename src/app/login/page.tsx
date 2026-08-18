"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Logo } from "@/components/Logo";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { useStore } from "@/lib/store";
import Link from "next/link";

type Channel = "sms" | "email";

function normalizePhone(raw: string) {
  const digits = raw.replace(/\D/g, "");
  if (digits.startsWith("53") && digits.length >= 10) return `+${digits}`;
  if (digits.length === 8) return `+53${digits}`;
  if (raw.trim().startsWith("+")) return `+${digits}`;
  return `+53${digits}`;
}

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-md py-10">
      <div className="mb-6 flex justify-center">
        <Logo withWord size={48} />
      </div>
      <Suspense fallback={<div className="card p-6 text-sm text-mute">Cargando…</div>}>
        <AuthCard />
      </Suspense>
    </div>
  );
}

function AuthCard() {
  const router = useRouter();
  const params = useSearchParams();
  const { currentUser, needsPhone, refresh } = useStore();
  const stepPhone = params.get("paso") === "telefono" || needsPhone;
  const [channel, setChannel] = useState<Channel>(stepPhone ? "sms" : "sms");
  const [phone, setPhone] = useState("+53");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(params.get("error") ? "No se pudo completar el acceso." : "");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (currentUser && !needsPhone && !stepPhone) router.replace("/explorar");
  }, [currentUser, needsPhone, router, stepPhone]);

  if (!isSupabaseConfigured()) {
    return (
      <div className="card p-6">
        <h1 className="font-display text-2xl">Falta configurar Supabase</h1>
        <p className="mt-2 text-sm text-mute">
          Añade las claves en Vercel y en <code>.env.local</code> para activar el acceso.
        </p>
      </div>
    );
  }

  async function google() {
    setBusy(true);
    setError("");
    const origin = window.location.origin;
    const { error: err } = await createClient().auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${origin}/auth/callback` },
    });
    if (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  async function sendOtp() {
    setBusy(true);
    setError("");
    const supabase = createClient();
    if (channel === "sms") {
      const e164 = normalizePhone(phone);
      const { error: err } = currentUser
        ? await supabase.auth.updateUser({ phone: e164 })
        : await supabase.auth.signInWithOtp({ phone: e164 });
      setBusy(false);
      if (err) {
        setError(err.message);
        return;
      }
      setPhone(e164);
    } else {
      const { error: err } = currentUser
        ? await supabase.auth.updateUser({ email: email.trim() })
        : await supabase.auth.signInWithOtp({
            email: email.trim(),
            options: { shouldCreateUser: true },
          });
      setBusy(false);
      if (err) {
        setError(err.message);
        return;
      }
    }
    setOtp("");
    setSent(true);
  }

  async function verify() {
    setBusy(true);
    setError("");
    const token = otp.trim();
    const supabase = createClient();
    const { error: err } =
      channel === "sms"
        ? await supabase.auth.verifyOtp({
            phone: normalizePhone(phone),
            token,
            type: currentUser ? "phone_change" : "sms",
          })
        : await supabase.auth.verifyOtp({
            email: email.trim(),
            token,
            type: currentUser ? "email_change" : "email",
          });
    setBusy(false);
    if (err) {
      setError(err.message);
      return;
    }
    await refresh();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user && !user.phone) router.replace("/login?paso=telefono");
    else router.replace("/explorar");
  }

  return (
    <div className="card p-6">
      <h1 className="font-display text-2xl">
        {stepPhone ? "Verifica tu teléfono" : "Entrar a MeCuadra"}
      </h1>
      <p className="mt-1 text-sm text-mute">
        {stepPhone
          ? "Te enviamos un código SMS. Publicar y aplicar piden teléfono verificado."
          : "Código de 6 dígitos por SMS o por correo. Google es opcional; el teléfono evita cuentas falsas."}
      </p>

      {!stepPhone ? (
        <button type="button" className="btn-ghost mt-5 w-full" onClick={() => void google()} disabled={busy}>
          Continuar con Google
        </button>
      ) : null}

      {!stepPhone ? (
        <div className="my-4 grid grid-cols-2 gap-2">
          <button
            type="button"
            className={`pill ${channel === "sms" ? "pill-on" : ""}`}
            onClick={() => {
              setChannel("sms");
              setSent(false);
              setOtp("");
            }}
          >
            Código SMS
          </button>
          <button
            type="button"
            className={`pill ${channel === "email" ? "pill-on" : ""}`}
            onClick={() => {
              setChannel("email");
              setSent(false);
              setOtp("");
            }}
          >
            Código al correo
          </button>
        </div>
      ) : (
        <div className="h-4" />
      )}

      {!sent ? (
        <form
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            void sendOtp();
          }}
        >
          {channel === "sms" || stepPhone ? (
            <div>
              <label className="label">Teléfono cubano</label>
              <input
                className="input"
                inputMode="tel"
                placeholder="+53 5xxxxxxx"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
          ) : (
            <div>
              <label className="label">Correo</label>
              <input
                className="input"
                type="email"
                placeholder="tu@correo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          )}
          <button type="submit" className="btn-primary w-full" disabled={busy}>
            Enviar código de confirmación
          </button>
        </form>
      ) : (
        <form
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            void verify();
          }}
        >
          <label className="label">
            {channel === "sms" || stepPhone ? "Código SMS" : "Código del correo"}
          </label>
          <input
            className="input tracking-[0.4em]"
            inputMode="numeric"
            maxLength={8}
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            autoFocus
            required
          />
          <button type="submit" className="btn-primary w-full" disabled={busy || otp.trim().length < 6}>
            Verificar código
          </button>
          <button type="button" className="btn-ghost w-full" onClick={() => setSent(false)}>
            {channel === "sms" || stepPhone ? "Cambiar número" : "Cambiar correo"}
          </button>
        </form>
      )}

      {error ? <p className="mt-3 text-sm text-rose-600">{error}</p> : null}

      <p className="mt-4 text-center text-xs text-mute">
        El código caduca en minutos. No lo compartas. MeCuadra es solo trueque.
      </p>
      {stepPhone ? (
        <p className="mt-2 text-center text-sm">
          <Link href="/explorar" className="text-brand">
            Explorar sin publicar
          </Link>
        </p>
      ) : null}
    </div>
  );
}
