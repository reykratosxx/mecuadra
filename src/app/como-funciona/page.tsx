"use client";

import Link from "next/link";
import { useT } from "@/lib/i18n/provider";

export default function ComoFuncionaPage() {
  const t = useT();
  const steps = [
    { t: t.home.step1t, d: t.home.step1d },
    { t: t.home.step2t, d: t.home.step2d },
    { t: t.home.step3t, d: t.home.step3d },
  ];
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="font-display text-4xl">{t.how.title}</h1>
      <p className="mt-3 text-lg leading-7 text-mute">{t.how.lead}</p>
      <ol className="mt-8 space-y-4">
        {steps.map((s, i) => (
          <li key={s.t} className="card flex gap-4 p-5">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-50 font-display text-sm text-brand">
              {i + 1}
            </span>
            <div>
              <h2 className="font-display text-xl">{s.t}</h2>
              <p className="mt-1 text-sm leading-6 text-mute">{s.d}</p>
            </div>
          </li>
        ))}
      </ol>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/explorar" className="btn-primary">
          {t.home.ctaExplore}
        </Link>
        <Link href="/login" className="btn-ghost">
          {t.home.ctaLogin}
        </Link>
      </div>
    </div>
  );
}
