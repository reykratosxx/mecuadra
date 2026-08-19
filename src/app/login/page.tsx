"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Logo } from "@/components/Logo";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { useStore } from "@/lib/store";
import { friendlyAuthError, isCubanMobile, normalizeCubanPhone } from "@/lib/phone";
import Link from "next/link";

type Tab = "email" | "phone";

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
  const { currentUser, needsPhone, refresh, claimPhone } = useStore();
  const stepPhone = params.get("paso") === "telefono" || needsPhone;
  const [tab, setTab] = useState<Tab>("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [register, setRegister] = useState(false);
  const [phone, setPhone] = useState("+53");
  const [otp, setOtp] = useState("");
  const [sent, setSent] = useState(false);
  const [info, setInfo] = useState("");
  const [error, setError] = useState(params.get("error") ? "No se pudo completar el acceso." : "");
  const [busy, setBusy] = useState(false);

  const [waitingTelegram, setWaitingTelegram] = useState(false);

  useEffect(() => {
    if (currentUser && !needsPhone && !stepPhone) router.replace("/explorar");
  }, [currentUser, needsPhone, router, stepPhone]);

  useEffect(() => {
    if (!waitingTelegram) return;
    const t = window.setInterval(() => {
      void refresh();
    }, 2000);
    return () => window.clearInterval(t);
  }, [waitingTelegram, refresh]);

  useEffect(() => {
    if (waitingTelegram && currentUser?.phoneVerified) {
      router.replace("/explorar");
    }
  }, [waitingTelegram, currentUser, router]);

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

  async function afterAuth() {
    await refresh();
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      router.replace("/explorar");
      return;
    }
    const { data: profile } = await supabase
      .from("profiles")
      .select("phone")
      .eq("id", user.id)
      .maybeSingle();
    if (!profile?.phone && !user.phone) router.replace("/login?paso=telefono");
    else router.replace("/explorar");
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
      setError(friendlyAuthError(err.message));
      setBusy(false);
    }
  }

  async function emailPassword(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    setInfo("");
    const supabase = createClient();
    if (register) {
      const origin = window.location.origin;
      const { data, error: err } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: { emailRedirectTo: `${origin}/auth/callback` },
      });
      setBusy(false);
      if (err) {
        setError(friendlyAuthError(err.message));
        return;
      }
      if (!data.session) {
        setInfo("Revisa el correo y confirma la cuenta. Después entra con tu contraseña.");
        setRegister(false);
        return;
      }
      await afterAuth();
      return;
    }
    const { error: err } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setBusy(false);
    if (err) {
      setError(friendlyAuthError(err.message));
      return;
    }
    await afterAuth();
  }

  async function verifyTelegram() {
    setBusy(true);
    setError("");
    const res = await fetch("/api/auth/telegram/start", { method: "POST" });
    const json = (await res.json()) as { url?: string; error?: string };
    setBusy(false);
    if (!res.ok || !json.url) {
      setError(json.error || "No se pudo abrir Telegram. Crea el bot (es gratis) y pon TELEGRAM_BOT_TOKEN.");
      return;
    }
    setWaitingTelegram(true);
    window.open(json.url, "_blank", "noopener,noreferrer");
  }

  async function sendSms() {
    setBusy(true);
    setError("");
    const e164 = normalizeCubanPhone(phone);
    if (!isCubanMobile(e164)) {
      setBusy(false);
      setError("Usa un celular cubano de 8 dígitos, por ejemplo +53 5xxxxxxx.");
      return;
    }
    const supabase = createClient();
    const { error: err } = currentUser
      ? await supabase.auth.updateUser({ phone: e164 })
      : await supabase.auth.signInWithOtp({ phone: e164 });
    setBusy(false);
    if (err) {
      setError(friendlyAuthError(err.message));
      return;
    }
    setPhone(e164);
    setOtp("");
    setSent(true);
  }

  async function verifySms() {
    setBusy(true);
    setError("");
    const { error: err } = await createClient().auth.verifyOtp({
      phone: normalizeCubanPhone(phone),
      token: otp.trim(),
      type: currentUser ? "phone_change" : "sms",
    });
    setBusy(false);
    if (err) {
      setError(friendlyAuthError(err.message));
      return;
    }
    await afterAuth();
  }

  async function savePhoneWithoutSms() {
    setBusy(true);
    setError("");
    try {
      await claimPhone(normalizeCubanPhone(phone));
      router.replace("/explorar");
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo guardar el número.");
      setBusy(false);
    }
  }

  return (
    <div className="card p-6">
      <h1 className="font-display text-2xl">
        {stepPhone ? "Verifica tu celular cubano" : "Entrar a MeCuadra"}
      </h1>
      <p className="mt-1 text-sm text-mute">
        {stepPhone
          ? "En Cuba no hay SMS gratis a Cubacel. Verifica el celular con Telegram (gratis, por WiFi o Nauta)."
          : "Google sin contraseña, correo con clave, o celular. El SMS de pago es opcional."}
      </p>

      {!stepPhone ? (
        <button type="button" className="btn-primary mt-5 w-full" onClick={() => void google()} disabled={busy}>
          Continuar con Google
        </button>
      ) : null}

      {!stepPhone ? (
        <div className="my-4 grid grid-cols-2 gap-2">
          <button
            type="button"
            className={`pill ${tab === "email" ? "pill-on" : ""}`}
            onClick={() => {
              setTab("email");
              setSent(false);
              setError("");
            }}
          >
            Correo y clave
          </button>
          <button
            type="button"
            className={`pill ${tab === "phone" ? "pill-on" : ""}`}
            onClick={() => {
              setTab("phone");
              setSent(false);
              setError("");
            }}
          >
            Celular
          </button>
        </div>
      ) : (
        <div className="h-4" />
      )}

      {!stepPhone && tab === "email" ? (
        <form className="space-y-3" onSubmit={(e) => void emailPassword(e)}>
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
          <div>
            <label className="label">Contraseña</label>
            <input
              className="input"
              type="password"
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn-primary w-full" disabled={busy}>
            {register ? "Crear cuenta" : "Entrar"}
          </button>
          <button
            type="button"
            className="btn-ghost w-full"
            onClick={() => {
              setRegister((v) => !v);
              setError("");
              setInfo("");
            }}
          >
            {register ? "Ya tengo cuenta" : "Crear cuenta con correo"}
          </button>
        </form>
      ) : null}

      {(stepPhone || tab === "phone") && !sent ? (
        <div className="space-y-3">
          {stepPhone && currentUser ? (
            <>
              <button
                type="button"
                className="btn-primary w-full"
                disabled={busy}
                onClick={() => void verifyTelegram()}
              >
                Verificar con Telegram (gratis)
              </button>
              {waitingTelegram ? (
                <p className="text-center text-sm text-mute">
                  Esperando que compartas tu Cubacel en Telegram…
                </p>
              ) : null}
            </>
          ) : (
            <p className="text-sm text-mute">
              Entra con Google o correo. El celular Cubacel se verifica después con Telegram,
              sin pagar SMS.
            </p>
          )}
          <form
            className="space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              void sendSms();
            }}
          >
            <div>
              <label className="label">SMS de pago (BudgetSMS)</label>
              <input
                className="input"
                inputMode="tel"
                placeholder="+53 5xxxxxxx"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <button type="submit" className="btn-ghost w-full" disabled={busy}>
              Enviar código SMS
            </button>
            {stepPhone && currentUser ? (
              <button type="button" className="btn-ghost w-full" disabled={busy} onClick={() => void savePhoneWithoutSms()}>
                Guardar número sin verificar
              </button>
            ) : null}
          </form>
        </div>
      ) : null}

      {(stepPhone || tab === "phone") && sent ? (
        <form
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            void verifySms();
          }}
        >
          <label className="label">Código SMS</label>
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
            Cambiar número
          </button>
        </form>
      ) : null}

      {error ? <p className="mt-3 text-sm text-rose-600">{error}</p> : null}
      {info ? <p className="mt-3 text-sm text-brand">{info}</p> : null}

      <p className="mt-4 text-center text-xs text-mute">
        Si Google no abre desde Cuba, usa correo. El Cubacel se verifica con Telegram, gratis.
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
