"use client";

import Link from "next/link";
import { OfferCard } from "@/components/OfferCard";
import { HomeHero } from "@/components/HomeHero";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
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
    <div>
      <HomeHero />
      <Header />

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
      <Footer />
    </div>
  );
}
