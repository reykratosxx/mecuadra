"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { IconX } from "./icons";

type Channel = "email" | "sms";

export function LogoutModal({
  email,
  phone,
  onClose,
  onDone,
}: {
  email?: string | null;
  phone?: string | null;
  onClose: () => void;
  onDone: () => Promise<void>;
}) {
  const canEmail = Boolean(email);
  const canSms = Boolean(phone);
  const [channel, setChannel] = useState<Channel>(canSms ? "sms" : "email");
  const [sent, setSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function send() {
    setBusy(true);
    setError("");
    const supabase = createClient();
    const { error: err } =
      channel === "sms"
        ? await supabase.auth.signInWithOtp({ phone: phone! })
        : await supabase.auth.signInWithOtp({ email: email! });
    setBusy(false);
    if (err) {
      setError(err.message);
      return;
    }
    setSent(true);
  }

  async function confirm() {
    setBusy(true);
    setError("");
    const token = otp.trim();
    const supabase = createClient();
    const { error: err } =
      channel === "sms"
        ? await supabase.auth.verifyOtp({ phone: phone!, token, type: "sms" })
        : await supabase.auth.verifyOtp({ email: email!, token, type: "email" });
    if (err) {
      setBusy(false);
      setError(err.message);
      return;
    }
    await onDone();
    setBusy(false);
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-brand/25 p-4">
      <div className="card w-full max-w-md p-5">
        <div className="mb-3 flex items-start justify-between">
          <div>
            <h2 className="font-display text-xl">Cerrar sesión</h2>
            <p className="text-sm text-mute">
              Te enviamos un código para confirmar que eres tú. Elige correo o SMS.
            </p>
          </div>
          <button type="button" onClick={onClose} aria-label="Cerrar">
            <IconX className="h-5 w-5" />
          </button>
        </div>

        {!sent ? (
          <>
            <div className="mb-3 grid grid-cols-2 gap-2">
              <button
                type="button"
                disabled={!canSms}
                onClick={() => setChannel("sms")}
                className={`pill ${channel === "sms" ? "pill-on" : ""} ${!canSms ? "opacity-40" : ""}`}
              >
                SMS
              </button>
              <button
                type="button"
                disabled={!canEmail}
                onClick={() => setChannel("email")}
                className={`pill ${channel === "email" ? "pill-on" : ""} ${!canEmail ? "opacity-40" : ""}`}
              >
                Correo
              </button>
            </div>
            <p className="mb-4 text-sm text-mute">
              {channel === "sms"
                ? `Código al ${phone}`
                : `Código a ${email}`}
            </p>
            <button type="button" className="btn-primary w-full" disabled={busy || (!canEmail && !canSms)} onClick={() => void send()}>
              Enviar código
            </button>
          </>
        ) : (
          <form
            className="space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              void confirm();
            }}
          >
            <label className="label">Código de confirmación</label>
            <input
              className="input tracking-[0.35em]"
              inputMode="numeric"
              maxLength={8}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              autoFocus
              required
            />
            <button type="submit" className="btn-primary w-full" disabled={busy || otp.trim().length < 6}>
              Confirmar y salir
            </button>
            <button type="button" className="btn-ghost w-full" onClick={() => setSent(false)}>
              Reenviar / cambiar canal
            </button>
          </form>
        )}
        {error ? <p className="mt-3 text-sm text-rose-600">{error}</p> : null}
      </div>
    </div>
  );
}
