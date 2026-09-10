"use client";

import Link from "next/link";
import { OfferCard } from "@/components/OfferCard";
import {
  IconArrows,
  IconCheck,
  IconChat,
  IconShield,
  IconStar,
  IconTruck,
  IconUser,
} from "@/components/icons";
import { useStore } from "@/lib/store";
import { Logo } from "@/components/Logo";
import { MeCuadraLabel } from "@/components/MeCuadraMark";
import { useI18n } from "@/lib/i18n/provider";

function formatCount(n: number, locale: string) {
  return new Intl.NumberFormat(locale === "es" ? "es" : "en").format(n);
}

export default function HomePage() {
  const { offers, users, ready } = useStore();
  const { t, locale } = useI18n();
  const featured = offers.filter((o) => o.status === "abierta").slice(0, 6);
  const openOffers = offers.filter((o) => o.status === "abierta").length;
  const registered = users.length;
  const withTransport = users.filter((u) => u.transport === "tengo").length;
  const whoCome = users.filter((u) => u.transport === "voy").length;

  const steps = [
    { n: "01", title: t.home.step1t, text: t.home.step1d },
    { n: "02", title: t.home.step2t, text: t.home.step2d },
    { n: "03", title: t.home.step3t, text: t.home.step3d },
  ];

  const community = [
    {
      icon: IconUser,
      value: ready ? formatCount(registered, locale) : "—",
      label: t.home.users,
    },
    {
      icon: IconTruck,
      value: ready ? formatCount(withTransport, locale) : "—",
      label: t.home.withTransport,
    },
    {
      icon: IconArrows,
      value: ready ? formatCount(openOffers, locale) : "—",
      label: t.home.open,
    },
  ];

  const pillars = [
    { icon: IconShield, title: t.home.trustTitle, body: t.home.trustBody },
    { icon: IconChat, title: t.home.chatTitle, body: t.home.chatBody },
    { icon: IconStar, title: t.home.ruleTitle, body: t.home.ruleBody },
  ];

  return (
    <div className="-mx-4">
      <section className="relative overflow-hidden px-4 pb-12 pt-8 md:pb-16 md:pt-16">
        <div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-2">
          <div>
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 text-xs font-semibold text-brand">
              {t.home.kicker}
            </p>
            <h1 className="font-display text-3xl font-semibold leading-[1.1] tracking-tight text-ink sm:text-4xl md:text-6xl">
              {t.home.title}
            </h1>
            <p className="mt-4 max-w-lg text-base leading-7 text-mute sm:mt-5 sm:text-lg">{t.home.lead}</p>
            <div className="mt-6 flex flex-wrap gap-3 sm:mt-7">
              <Link href="/explorar" className="btn-primary">
                {t.home.ctaExplore}
              </Link>
              <Link href="/login" className="btn-ghost">
                {t.home.ctaLogin}
              </Link>
            </div>
            <p className="mt-4 max-w-lg text-sm leading-6 text-mute">{t.home.privacyBody}</p>
          </div>
          <div className="relative">
            <div className="absolute -inset-6 rounded-[2.5rem] bg-[image:var(--grad)] opacity-20 blur-2xl" />
            <div className="card relative min-w-0 p-5 shadow-xl shadow-brand/10">
              <div className="mb-4 flex items-center justify-between gap-2">
                <Logo withWord size={48} />
                <span className="shrink-0 text-xs text-mute">{t.home.demoOpen}</span>
              </div>
              <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 rounded-2xl bg-surface-2 p-4">
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase text-mute">{t.home.demoOffers}</p>
                  <p className="font-medium">{t.home.demoItem}</p>
                  <p className="text-xs text-mute">{t.home.demoPlace}</p>
                </div>
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[image:var(--grad)] text-white">
                  <IconArrows className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase text-mute">{t.home.demoNeeds}</p>
                  <p className="font-medium">{t.home.demoWant}</p>
                  <p className="text-xs text-mute">{t.home.demoTravel}</p>
                </div>
              </div>
              <div className="mt-4 flex w-full flex-col items-center">
                <button type="button" className="btn-primary pointer-events-none">
                  <MeCuadraLabel />
                </button>
                <p className="mt-3 text-center text-xs text-mute">{t.home.demoTap}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-surface px-4 py-10">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6 max-w-2xl">
            <h2 className="font-display text-2xl sm:text-3xl">{t.home.communityTitle}</h2>
            <p className="mt-2 text-sm text-mute sm:text-base">
              {t.home.communityLead}
              {whoCome > 0 ? ` ${formatCount(whoCome, locale)} ${t.home.willTravel}.` : ""}
            </p>
          </div>
          <dl className="grid gap-3 sm:grid-cols-3">
            {community.map((s) => (
              <div
                key={s.label}
                className="rounded-[1.35rem] border border-line bg-[radial-gradient(120%_80%_at_0%_0%,rgba(124,58,237,0.08),transparent_55%)] p-5"
              >
                <s.icon className="h-5 w-5 text-brand" aria-hidden />
                <dt className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink tabular-nums sm:text-4xl">
                  {s.value}
                </dt>
                <dd className="mt-1 text-sm font-semibold text-ink">{s.label}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 text-xs text-mute">
            {t.home.communityHintBefore}{" "}
            <Link href="/perfil" className="font-semibold text-brand">
              {t.home.communityHintLink}
            </Link>{" "}
            {t.home.communityHintAfter}
          </p>
        </div>
      </section>

      <section className="px-4 py-14">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-display text-3xl">{t.home.stepsTitle}</h2>
          <p className="mt-2 max-w-2xl text-mute">{t.home.stepsLead}</p>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {steps.map((s) => (
              <article key={s.n} className="card p-5">
                <p className="font-display text-sm text-brand">{s.n}</p>
                <h3 className="mt-2 font-display text-xl">{s.title}</h3>
                <p className="mt-2 text-sm leading-6 text-mute">{s.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-14">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <h2 className="font-display text-2xl sm:text-3xl">{t.home.marketTitle}</h2>
              <p className="text-sm text-mute sm:text-base">{t.home.marketLead}</p>
            </div>
            <Link href="/explorar" className="text-sm font-semibold text-brand">
              {t.home.seeAll}
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
            {featured.map((o) => (
              <OfferCard key={o.id} offer={o} />
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-16">
        <div className="mx-auto grid max-w-6xl gap-4 md:grid-cols-3">
          {pillars.map((b) => (
            <article key={b.title} className="card p-5">
              <b.icon className="h-6 w-6 text-brand" />
              <h3 className="mt-3 font-display text-lg">{b.title}</h3>
              <p className="mt-2 text-sm leading-6 text-mute">{b.body}</p>
            </article>
          ))}
        </div>
        <div
          className="mx-auto mt-8 flex max-w-6xl flex-col items-start gap-4 rounded-[1.35rem] p-8 text-white shadow-lg shadow-brand/20 md:flex-row md:items-center md:justify-between"
          style={{ background: "var(--grad)" }}
        >
          <div>
            <p className="font-display text-2xl">{t.home.ctaTitle}</p>
            <p className="mt-1 text-white/85">{t.home.ctaBody}</p>
          </div>
          <Link
            href="/publicar"
            className="rounded-full bg-surface px-5 py-3 text-sm font-semibold text-brand shadow-sm"
          >
            {t.home.ctaPublish}
          </Link>
        </div>
        <p className="mx-auto mt-6 flex max-w-6xl items-center gap-2 text-xs text-mute">
          <IconCheck className="h-4 w-4 text-brand" />
          {t.home.geoHint}
        </p>
      </section>
    </div>
  );
}
