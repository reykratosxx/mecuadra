"use client";

import { useT } from "@/lib/i18n/provider";

export function ZkFigures() {
  const t = useT();
  return (
    <div className="not-prose my-8 space-y-6">
      <figure className="overflow-hidden rounded-3xl border border-line bg-surface">
        <figcaption className="border-b border-line px-5 py-3 text-sm font-semibold text-ink">
          {t.zk.figLedger}
        </figcaption>
        <div className="grid md:grid-cols-2">
          <div className="border-b border-line p-5 md:border-b-0 md:border-r">
            <p className="text-[11px] font-bold uppercase tracking-wider text-rose-600">{t.zk.figPay}</p>
            <svg viewBox="0 0 320 140" className="mt-3 h-32 w-full" aria-hidden>
              <rect x="8" y="16" width="304" height="108" rx="16" fill="#fdf2f8" stroke="#fb7185" />
              <text x="24" y="48" fontSize="12" fill="#9f1239">
                Bitcoin ledger
              </text>
              <text x="24" y="72" fontSize="11" fill="#be123c">
                Ana → Bruno  0.012 BTC
              </text>
              <text x="24" y="94" fontSize="11" fill="#be123c">
                Bruno → Carla  0.004 BTC
              </text>
              <text x="24" y="112" fontSize="10" fill="#fb7185">
                {t.zk.figForever}
              </text>
            </svg>
          </div>
          <div className="p-5">
            <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">{t.zk.figSwap}</p>
            <svg viewBox="0 0 320 140" className="mt-3 h-32 w-full" aria-hidden>
              <rect x="8" y="16" width="304" height="108" rx="16" fill="#ecfdf5" stroke="#34d399" />
              <text x="24" y="48" fontSize="12" fill="#065f46">
                MeCuadra
              </text>
              <text x="24" y="74" fontSize="11" fill="#047857">
                bike  ↔  camera
              </text>
              <text x="24" y="98" fontSize="11" fill="#047857">
                {t.zk.figNoTx}
              </text>
              <text x="24" y="116" fontSize="10" fill="#059669">
                {t.zk.figNoPay}
              </text>
            </svg>
          </div>
        </div>
      </figure>

      <figure className="overflow-hidden rounded-3xl border border-line bg-surface">
        <figcaption className="border-b border-line px-5 py-3 text-sm font-semibold text-ink">
          {t.zk.figBulletin}
        </figcaption>
        <div className="grid md:grid-cols-2">
          <div className="border-b border-line p-5 md:border-b-0 md:border-r">
            <p className="text-[11px] font-bold uppercase tracking-wider text-amber-700">{t.zk.figStars}</p>
            <div className="mt-3 space-y-2 rounded-2xl bg-amber-50 p-4 text-sm text-amber-950">
              <p>Ana ★★★★★ ← Bruno</p>
              <p>Bruno ★★★★☆ ← Carla</p>
              <p className="text-xs text-amber-700">{t.zk.figGraph}</p>
            </div>
          </div>
          <div className="p-5">
            <p className="text-[11px] font-bold uppercase tracking-wider text-brand">{t.zk.figZk}</p>
            <div className="mt-3 flex h-[7.5rem] flex-col items-center justify-center rounded-2xl bg-brand-50 p-4">
              <span className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-brand ring-1 ring-brand/20">
                ★ {t.zk.badgeOk}
              </span>
              <p className="mt-3 text-center text-xs text-mute">{t.zk.figStar}</p>
            </div>
          </div>
        </div>
      </figure>

      <figure className="overflow-hidden rounded-3xl border border-line bg-surface p-5">
        <figcaption className="text-sm font-semibold text-ink">{t.zk.figBitvm}</figcaption>
        <ol className="mt-4 grid gap-2 sm:grid-cols-4">
          {[t.zk.bitvm1, t.zk.bitvm2, t.zk.bitvm3, t.zk.bitvm4].map((label, i) => (
            <li key={label} className="rounded-2xl bg-surface-2 px-3 py-3 text-center text-xs leading-5 text-mute">
              <span className="mb-1 inline-grid h-7 w-7 place-items-center rounded-full bg-brand text-[11px] font-bold text-white">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="mt-1">{label}</p>
            </li>
          ))}
        </ol>
        <p className="mt-3 text-xs leading-5 text-mute">{t.zk.figBitvmNote}</p>
      </figure>
    </div>
  );
}
