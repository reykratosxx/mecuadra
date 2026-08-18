"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Logo } from "@/components/Logo";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { useStore } from "@/lib/store";
import Link from "next/link";

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
  const { currentUser, needsPhone } = useStore();
  const stepPhone = params.get("paso") === "telefono" || needsPhone;
  const [phone, setPhone] = useState("+53");
  const [otp, setOtp] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
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
    const e164 = normalizePhone(phone);
    const supabase = createClient();
    const { error: err } = currentUser
      ? await supabase.auth.updateUser({ phone: e164 })
      : await supabase.auth.signInWithOtp({ phone: e164 });
    setBusy(false);
    if (err) {
      setError(err.message);
      return;
    }
    setPhone(e164);
    setSent(true);
  }

  async function verify() {
    setBusy(true);
    setError("");
    const { error: err } = await createClient().auth.verifyOtp({
      phone: normalizePhone(phone),
      token: otp.trim(),
      type: currentUser ? "phone_change" : "sms",
    });
    setBusy(false);
    if (err) {
      setError(err.message);
      return;
    }
    router.replace("/explorar");
  }

  return (
    <div className="card p-6">
      <h1 className="font-display text-2xl">
        {stepPhone ? "Verifica tu teléfono" : "Entrar a MeCuadra"}
      </h1>
      <p className="mt-1 text-sm text-mute">
        {stepPhone
          ? "Un número, una cuenta. Publicar y aplicar requieren teléfono verificado."
          : "Google o teléfono. El teléfono es lo que impide granjas de cuentas."}
      </p>

      {!stepPhone ? (
        <button type="button" className="btn-ghost mt-5 w-full" onClick={google} disabled={busy}>
          Continuar con Google
        </button>
      ) : null}

      {!stepPhone ? (
        <p className="my-4 text-center text-xs uppercase tracking-wider text-mute">o con tu número</p>
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
          <button type="submit" className="btn-primary w-full" disabled={busy}>
            Enviar código
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
          <div>
            <label className="label">Código SMS</label>
            <input
              className="input tracking-[0.4em]"
              inputMode="numeric"
              maxLength={8}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn-primary w-full" disabled={busy}>
            Verificar
          </button>
          <button type="button" className="btn-ghost w-full" onClick={() => setSent(false)}>
            Cambiar número
          </button>
        </form>
      )}

      {error ? <p className="mt-3 text-sm text-rose-600">{error}</p> : null}

      <p className="mt-4 text-center text-xs text-mute">
        Al entrar aceptas usar MeCuadra solo para trueque, no para venta.
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
