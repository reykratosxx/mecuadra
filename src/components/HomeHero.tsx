"use client";

import { useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { LanguageToggle } from "@/components/LanguageToggle";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  IconArrowRight,
  IconArrows,
  IconBook,
  IconLock,
  IconMenu,
  IconPlus,
  IconSparkles,
  IconWand,
  IconX,
} from "@/components/icons";
import { useI18n } from "@/lib/i18n/provider";
import { useStore } from "@/lib/store";

const HERO_VIDEO =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260702_051048_5ef213b5-26db-4da8-b604-7ef823760b6b.mp4";

export function HomeHero() {
  const { t } = useI18n();
  const { currentUser } = useStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const h = t.home;

  const menuLinks = [
    { href: "/explorar", label: t.nav.explore },
    { href: "/trueques", label: t.nav.trades },
    { href: "/docs", label: t.nav.docs },
    { href: "/docs/zk", label: "ZK" },
    { href: "/publicar", label: t.nav.publish },
  ];

  return (
    <section className="relative min-h-dvh overflow-hidden">
      <div className="hero-sky absolute inset-0 z-0">
        <div className="hero-video-motion absolute inset-0">
          <video
            className="hero-globe h-full w-full object-cover"
            src={HERO_VIDEO}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            aria-hidden
          />
        </div>
        <div className="hero-tint pointer-events-none absolute inset-0" />
      </div>

      <div className="relative z-10 flex min-h-dvh flex-col lg:flex-row">
        <div className="relative flex min-h-dvh w-full flex-col p-3 sm:p-4 lg:w-[52%] lg:p-6">
          <div className="hero-frost pointer-events-none absolute inset-3 z-0 rounded-3xl sm:inset-4 lg:inset-6" />

          <div className="relative z-10 flex min-h-[calc(100dvh-1.5rem)] flex-col px-4 py-4 sm:min-h-[calc(100dvh-2rem)] sm:px-6 sm:py-5 lg:min-h-0 lg:flex-1">
            <div className="flex items-center justify-between gap-3">
              <Logo
                withWord
                size={32}
                className="[&_img]:h-8 [&_img]:w-8"
                wordClassName="text-2xl font-semibold tracking-tighter text-white [&_span]:text-white"
              />
              <button
                type="button"
                className="liquid-glass inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium text-white/90 transition-transform hover:scale-105 active:scale-95 lg:hidden"
                onClick={() => setMenuOpen(true)}
              >
                <IconMenu className="h-4 w-4" />
                {h.heroMenu}
              </button>
              <div className="hidden items-center gap-1 lg:flex [&_button]:text-white [&_button]:hover:bg-white/15 [&_button]:hover:text-white">
                <LanguageToggle />
                <ThemeToggle />
              </div>
            </div>

            <div className="hero-rise hero-copy flex flex-1 flex-col items-center justify-center py-10 text-center">
              <div className="hero-float">
                <Logo size={140} className="justify-center [&_img]:h-28 [&_img]:w-28 sm:[&_img]:h-32 sm:[&_img]:w-32 lg:[&_img]:h-36 lg:[&_img]:w-36 [&_img]:drop-shadow-[0_10px_32px_rgba(124,58,237,0.6)]" />
              </div>
              <h1 className="font-display mt-6 max-w-xl text-5xl font-medium tracking-[-0.05em] text-white sm:text-6xl lg:text-7xl">
                {h.heroLine}{" "}
                <em className="font-serif font-medium text-white">{h.heroEm}</em>
              </h1>
              <Link
                href="/explorar"
                className="liquid-glass-strong mt-8 inline-flex items-center gap-3 rounded-full px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-105 active:scale-95"
              >
                {h.heroCta}
                <span className="grid h-7 w-7 place-items-center rounded-full bg-white/20">
                  <IconArrowRight className="h-4 w-4" />
                </span>
              </Link>
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                {[h.heroPill1, h.heroPill2, h.heroPill3].map((pill) => (
                  <span
                    key={pill}
                    className="liquid-glass rounded-full px-3 py-1.5 text-xs font-semibold text-white"
                  >
                    {pill}
                  </span>
                ))}
              </div>
            </div>

            <div className="hero-rise hero-copy pb-2 text-center" style={{ animationDelay: "180ms" }}>
              <p className="text-xs font-semibold tracking-widest uppercase text-white">{h.heroVision}</p>
              <p className="mt-2 font-display text-lg text-white">
                {h.heroQuote}
              </p>
              <p className="mt-3 flex items-center justify-center gap-3 text-xs font-semibold tracking-[0.2em] uppercase text-white">
                <span className="h-px w-10 bg-white/50" />
                {h.heroAuthor}
                <span className="h-px w-10 bg-white/50" />
              </p>
            </div>
          </div>
        </div>

        <div className="hero-right relative hidden min-h-dvh w-[48%] flex-col p-6 text-ink lg:flex">
          <div className="flex items-center justify-end gap-2">
            <div className="liquid-glass flex items-center gap-1 rounded-full p-1">
              <Link
                href="/docs"
                className="grid h-8 w-8 place-items-center rounded-full bg-ink/5 text-ink transition-colors hover:bg-ink/10"
                aria-label={t.nav.docs}
              >
                <IconBook className="h-4 w-4" />
              </Link>
              <Link
                href="/docs/zk"
                className="grid h-8 w-8 place-items-center rounded-full bg-ink/5 text-ink transition-colors hover:bg-ink/10"
                aria-label="ZK"
              >
                <IconWand className="h-4 w-4" />
              </Link>
              <Link
                href="/explorar"
                className="grid h-8 w-8 place-items-center rounded-full bg-ink/5 text-ink transition-colors hover:bg-ink/10"
                aria-label={t.nav.explore}
              >
                <IconArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <Link
              href={currentUser ? "/perfil" : "/login"}
              className="liquid-glass inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium text-ink transition-transform hover:scale-105 active:scale-95"
            >
              <span className="grid h-8 w-8 place-items-center rounded-full bg-ink/5">
                <IconSparkles className="h-4 w-4" />
              </span>
              {currentUser ? t.nav.profile : h.heroAccount}
            </Link>
          </div>

          <article className="liquid-glass mt-8 w-56 rounded-3xl p-4">
            <p className="font-display text-sm font-medium text-ink">{h.heroEcosystem}</p>
            <p className="mt-2 text-xs font-medium leading-5 text-ink/80">{h.heroEcosystemBody}</p>
          </article>

          <div className="liquid-glass mt-auto rounded-[2.5rem] p-3">
            <div className="grid grid-cols-2 gap-3">
              <Link
                href="/docs/zk"
                className="liquid-glass rounded-3xl p-4 transition-transform hover:scale-105"
              >
                <span className="grid h-8 w-8 place-items-center rounded-full bg-ink/5">
                  <IconWand className="h-4 w-4" />
                </span>
                <p className="mt-3 font-display text-sm font-medium text-ink">{h.heroFeatZk}</p>
                <p className="mt-1 text-xs font-medium leading-5 text-ink/80">{h.heroFeatZkBody}</p>
              </Link>
              <Link
                href="/explorar"
                className="liquid-glass rounded-3xl p-4 transition-transform hover:scale-105"
              >
                <span className="grid h-8 w-8 place-items-center rounded-full bg-ink/5">
                  <IconBook className="h-4 w-4" />
                </span>
                <p className="mt-3 font-display text-sm font-medium text-ink">{h.heroFeatMarket}</p>
                <p className="mt-1 text-xs font-medium leading-5 text-ink/80">{h.heroFeatMarketBody}</p>
              </Link>
            </div>
            <Link
              href="/explorar"
              className="liquid-glass mt-3 flex items-center gap-3 rounded-3xl p-3 transition-transform hover:scale-[1.02]"
            >
              <span className="grid h-16 w-24 shrink-0 place-items-center rounded-2xl bg-ink/5">
                <IconArrows className="h-7 w-7" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-display text-sm font-medium text-ink">{h.heroSculpt}</span>
                <span className="mt-1 block text-xs font-medium leading-5 text-ink/80">{h.heroSculptBody}</span>
              </span>
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-ink/10">
                <IconPlus className="h-5 w-5" />
              </span>
            </Link>
          </div>
        </div>
      </div>

      {menuOpen ? (
        <div className="fixed inset-0 z-50 bg-black/40 lg:hidden" onClick={() => setMenuOpen(false)}>
          <div
            className="liquid-glass-strong absolute right-4 top-4 w-[min(20rem,calc(100%-2rem))] rounded-3xl p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between">
              <Logo withWord size={32} wordClassName="text-lg text-white [&_span]:text-white" />
              <button
                type="button"
                className="grid h-8 w-8 place-items-center rounded-full bg-white/10"
                onClick={() => setMenuOpen(false)}
                aria-label={t.explore.close}
              >
                <IconX className="h-4 w-4" />
              </button>
            </div>
            <div className="flex flex-col gap-1">
              {menuLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="rounded-2xl px-3 py-2.5 text-sm font-medium text-white/90 hover:bg-white/10"
                  onClick={() => setMenuOpen(false)}
                >
                  {l.label}
                </Link>
              ))}
            </div>
            <div className="mt-3 flex items-center justify-between [&_button]:text-white/80">
              <LanguageToggle />
              <ThemeToggle />
              <Link href="/login" className="liquid-glass rounded-full px-3 py-1.5 text-sm">
                <span className="inline-flex items-center gap-1">
                  <IconLock className="h-4 w-4" />
                  {h.heroAccount}
                </span>
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
