"use client";

import { useCallback, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { finalizeEvent, type EventTemplate } from "nostr-tools/pure";
import { bytesToHex, randomBytes } from "@noble/hashes/utils.js";
import { useT } from "@/lib/i18n/provider";
import { useStore } from "@/lib/store";
import {
  createIdentity,
  identityFromSecret,
  parseNsec,
  saveIdentity,
  type LocalNostrIdentity,
} from "@/lib/nostr/keys";
import { silentPaymentCode } from "@/lib/silent-payments";
import "@/lib/nostr/window";

async function signedLoginEvent(id: LocalNostrIdentity | null) {
  const challenge = bytesToHex(randomBytes(16));
  const template: EventTemplate = {
    kind: 22242,
    created_at: Math.floor(Date.now() / 1000),
    tags: [
      ["challenge", challenge],
      ["origin", window.location.origin],
    ],
    content: "MeCuadra Cypherpunk login",
  };
  if (id) return finalizeEvent(template, id.secretKey);
  if (!window.nostr) throw new Error("NO_EXT");
  return window.nostr.signEvent(template);
}

export function NostrLogin({ next }: { next: string }) {
  const t = useT();
  const router = useRouter();
  const { refresh } = useStore();
  const [nsecInput, setNsecInput] = useState("");
  const [fresh, setFresh] = useState<LocalNostrIdentity | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const finish = useCallback(
    async (id: LocalNostrIdentity | null) => {
      setBusy(true);
      setError("");
      try {
        const event = await signedLoginEvent(id);
        if (id) saveIdentity(id);
        else if (window.nostr) {
          /* NIP-07: nsec stays in the extension */
        }
        const sp = id ? silentPaymentCode(id.secretKey) : undefined;
        const res = await fetch("/api/auth/nostr", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ event, silentPayment: sp }),
        });
        const json = (await res.json()) as { error?: string };
        if (!res.ok) {
          setError(json.error || t.auth.error);
          setBusy(false);
          return;
        }
        await refresh();
        router.replace(next);
      } catch (err) {
        const msg = err instanceof Error ? err.message : t.auth.error;
        setError(msg === "NO_EXT" ? t.auth.noExt : msg);
        setBusy(false);
      }
    },
    [next, refresh, router, t],
  );

  return (
    <div className="space-y-4">
      {busy ? (
        <div className="flex flex-col items-center gap-3 py-6" role="status">
          <span className="h-9 w-9 animate-spin rounded-full border-[3px] border-brand/25 border-t-brand" />
          <p className="text-center text-sm font-medium text-ink">{t.auth.signing}</p>
        </div>
      ) : (
        <>
          <button type="button" className="btn-primary w-full py-3 text-base" onClick={() => void finish(null)}>
            {t.auth.nip07}
          </button>
          <button
            type="button"
            className="btn-ghost w-full py-3"
            onClick={() => {
              const id = createIdentity();
              setFresh(id);
            }}
          >
            {t.auth.generate}
          </button>

          {fresh ? (
            <div className="rounded-2xl border border-brand/25 bg-brand-50 px-4 py-3 text-sm">
              <p className="font-semibold text-ink">{fresh.npub}</p>
              <p className="mt-2 text-xs leading-5 text-mute">{t.auth.backupWarn}</p>
              <code className="mt-2 block break-all rounded-xl bg-surface px-3 py-2 text-[11px]">{fresh.nsec}</code>
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  className="btn-ghost flex-1 text-xs"
                  onClick={() => {
                    void navigator.clipboard.writeText(fresh.nsec);
                    setCopied(true);
                  }}
                >
                  {copied ? t.auth.copied : t.auth.copyNsec}
                </button>
                <button type="button" className="btn-primary flex-1 text-xs" onClick={() => void finish(fresh)}>
                  {t.auth.continue}
                </button>
              </div>
            </div>
          ) : null}

          <label className="label">{t.auth.pasteNsec}</label>
          <input
            className="input"
            placeholder={t.auth.placeholder}
            value={nsecInput}
            onChange={(e) => setNsecInput(e.target.value)}
            autoComplete="off"
          />
          <button
            type="button"
            className="btn-ghost w-full"
            onClick={() => {
              try {
                void finish(identityFromSecret(parseNsec(nsecInput)));
              } catch {
                setError(t.auth.error);
              }
            }}
          >
            {t.auth.importKey}
          </button>
        </>
      )}
      {error ? <p className="text-sm text-rose-600">{error}</p> : null}
    </div>
  );
}

export function LoginNext() {
  const params = useSearchParams();
  const next = params.get("next");
  return next && next.startsWith("/") ? next : "/explorar";
}
