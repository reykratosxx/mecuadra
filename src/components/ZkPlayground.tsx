"use client";

import { useState } from "react";
import { createIdentity, shortNpub } from "@/lib/nostr/keys";
import {
  buildAttestation,
  proveFromAttestations,
  verifyReputationProof,
} from "@/lib/zk/reputation";
import { bitvmLimbsFromProof } from "@/lib/zk/bitvm-outputs";
import { useT } from "@/lib/i18n/provider";

type DemoState = {
  publicCount: number;
  threshold: number;
  nullifier: string;
  out1: string;
  out2: string;
  brunoNpub: string;
  stars: number;
  verified: boolean;
};

export function ZkPlayground() {
  const t = useT();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [demo, setDemo] = useState<DemoState | null>(null);

  function run() {
    setBusy(true);
    setError("");
    try {
      const ana = createIdentity();
      const bruno = createIdentity();
      const att = buildAttestation({
        secretKey: bruno.secretKey,
        tradeId: "lisbon-bike-camera",
        stars: 5,
        fromPubkey: bruno.pubkey,
        toPubkey: ana.pubkey,
      });
      const proof = proveFromAttestations(ana.secretKey, ana.pubkey, [att], { persist: false });
      const ok = verifyReputationProof(proof);
      if (!ok) throw new Error("verify failed");
      const limbs = bitvmLimbsFromProof(proof);
      setDemo({
        publicCount: proof.publicSignals.count,
        threshold: proof.publicSignals.threshold,
        nullifier: proof.publicSignals.nullifier,
        out1: limbs.out1,
        out2: limbs.out2,
        brunoNpub: bruno.npub,
        stars: att.stars,
        verified: true,
      });
    } catch {
      setError(t.zk.fail);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="not-prose my-8 overflow-hidden rounded-3xl border border-brand/20 bg-surface shadow-sm">
      <div className="border-b border-line bg-brand-50/70 px-5 py-4">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand">{t.zk.playKicker}</p>
        <h3 className="font-display text-2xl text-ink">{t.zk.playTitle}</h3>
        <p className="mt-1 text-sm leading-6 text-mute">{t.zk.playLead}</p>
      </div>
      <div className="grid gap-0 md:grid-cols-2">
        <div className="border-b border-line p-5 md:border-b-0 md:border-r">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-rose-600">{t.zk.colPrivate}</p>
          <ul className="mt-3 space-y-2 text-sm text-mute">
            <li>{t.zk.priv1}</li>
            <li>{t.zk.priv2}</li>
            <li>
              {demo ? (
                <span className="break-all font-mono text-[11px] text-ink">
                  Bruno {shortNpub(demo.brunoNpub)} · {demo.stars}★
                </span>
              ) : (
                t.zk.priv3
              )}
            </li>
          </ul>
        </div>
        <div className="p-5">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-emerald-700">{t.zk.colPublic}</p>
          <ul className="mt-3 space-y-2 text-sm text-mute">
            <li>{t.zk.pub1}</li>
            <li>{t.zk.pub2}</li>
            {demo ? (
              <li className="space-y-1 font-mono text-[11px] text-ink">
                <p>
                  count {demo.publicCount} ≥ {demo.threshold}
                </p>
                <p className="break-all">nullifier {demo.nullifier.slice(0, 18)}…</p>
                <p className="break-all">out_1 {demo.out1}</p>
                <p className="break-all">out_2 {demo.out2}</p>
              </li>
            ) : (
              <li>{t.zk.pub3}</li>
            )}
          </ul>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3 border-t border-line px-5 py-4">
        <button type="button" className="btn-primary h-10 px-4 text-sm" onClick={run} disabled={busy}>
          {busy ? t.zk.proving : t.zk.playRun}
        </button>
        {demo?.verified ? (
          <p className="text-sm font-semibold text-emerald-700">{t.zk.playVerified}</p>
        ) : null}
        {error ? <p className="text-sm text-rose-600">{error}</p> : null}
      </div>
      <p className="px-5 pb-4 text-xs leading-5 text-mute">{t.zk.playBitvm}</p>
    </section>
  );
}
