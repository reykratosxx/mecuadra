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

const steps = [
  {
    n: "01",
    title: "Publica lo que tienes",
    text: "Fotos, municipio y barrio. Sin GPS obligatorio. Pausas, editas o das de baja cuando quieras.",
  },
  {
    n: "02",
    title: "Alguien toca MeCuadra",
    text: "Como aplicar a una oferta P2P: propone artículos o escribe lo que puede dar, aunque no esté publicado.",
  },
  {
    n: "03",
    title: "Chat, encuentro, confirmar",
    text: "Coordinan el punto. Cada parte marca entregado. Luego se valoran. La reputación es la custodia.",
  },
];

function formatCount(n: number) {
  return new Intl.NumberFormat("es-CU").format(n);
}

export default function HomePage() {
  const { offers, users, ready } = useStore();
  const featured = offers.filter((o) => o.status === "abierta").slice(0, 6);
  const openOffers = offers.filter((o) => o.status === "abierta").length;
  const registered = users.length;
  const withTransport = users.filter((u) => u.transport === "tengo").length;
  const whoCome = users.filter((u) => u.transport === "voy").length;

  const community = [
    {
      icon: IconUser,
      value: ready ? formatCount(registered) : "—",
      label: registered === 1 ? "persona registrada" : "personas registradas",
      hint: "Cuentas en MeCuadra",
    },
    {
      icon: IconTruck,
      value: ready ? formatCount(withTransport) : "—",
      label: "con transporte",
      hint: "Marcaron “tengo transporte” en su perfil",
    },
    {
      icon: IconArrows,
      value: ready ? formatCount(openOffers) : "—",
      label: openOffers === 1 ? "oferta abierta" : "ofertas abiertas",
      hint: "Trueques publicados ahora mismo",
    },
  ];

  return (
    <div className="-mx-4">
      <section className="relative overflow-hidden px-4 pb-12 pt-8 md:pb-16 md:pt-16">
        <div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-2">
          <div>
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 text-xs font-semibold text-brand">
              Mercado P2P de bienes · Cuba
            </p>
            <h1 className="font-display text-3xl font-semibold leading-[1.1] tracking-tight text-ink sm:text-4xl md:text-6xl">
              Si te cuadra,
              <span className="block bg-[image:var(--grad)] bg-clip-text text-transparent">
                se cierra el trueque.
              </span>
            </h1>
            <p className="mt-4 max-w-lg text-base leading-7 text-mute sm:mt-5 sm:text-lg">
              El trueque que ya se hace en grupos, con fotos, municipio y reputación.
              Publicas lo que tienes, aplicas a lo que necesitas y cierras el trato
              en el chat. Sin ventas y sin pedir efectivo en el listado.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 sm:mt-7">
              <Link href="/explorar" className="btn-primary">
                Explorar ofertas
              </Link>
              <Link href="/publicar" className="btn-ghost">
                Publicar un trueque
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-6 rounded-[2.5rem] bg-[image:var(--grad)] opacity-20 blur-2xl" />
            <div className="card relative p-5 shadow-xl shadow-brand/10">
              <div className="mb-4 flex items-center justify-between">
                <Logo withWord size={40} />
                <span className="text-xs text-mute">Oferta abierta</span>
              </div>
              <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 rounded-2xl bg-surface-2 p-4">
                <div>
                  <p className="text-[10px] font-semibold uppercase text-mute">Ofrece</p>
                  <p className="font-medium">Ibuprofeno 200 mg</p>
                  <p className="text-xs text-mute">Plaza · Vedado</p>
                </div>
                <span className="grid h-10 w-10 place-items-center rounded-full bg-[image:var(--grad)] text-white">
                  <IconArrows className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-[10px] font-semibold uppercase text-mute">Necesita</p>
                  <p className="font-medium">Alimentos o aseo</p>
                  <p className="text-xs text-mute">Voy al lugar</p>
                </div>
              </div>
              <button className="btn-primary mt-4 w-full pointer-events-none">
                <MeCuadraLabel />
              </button>
              <p className="mt-3 text-center text-xs text-mute">
                Un toque. Propones. Se abre el chat.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-surface px-4 py-10">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6 max-w-2xl">
            <h2 className="font-display text-2xl sm:text-3xl">La comunidad, en números</h2>
            <p className="mt-2 text-sm text-mute sm:text-base">
              Datos públicos para que sepas con quién truequeas: cuántas personas hay y cuántas
              pueden moverse.
              {whoCome > 0
                ? ` Además, ${formatCount(whoCome)} ${whoCome === 1 ? "persona marcó" : "personas marcaron"} “voy al lugar”.`
                : ""}
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
                <p className="mt-1 text-xs text-mute">{s.hint}</p>
              </div>
            ))}
          </dl>
          <p className="mt-4 text-xs text-mute">
            Configura tu transporte en{" "}
            <Link href="/perfil" className="font-semibold text-brand">
              tu perfil
            </Link>{" "}
            para que la comunidad sepa si puedes ir o si hay que venir a ti.
          </p>
        </div>
      </section>

      <section className="px-4 py-14">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-display text-3xl">Tres pasos para cerrar el trueque</h2>
          <p className="mt-2 max-w-2xl text-mute">
            Publicas. Alguien toca MeCuadra y propone qué da a cambio. Coordinan en el
            chat, confirman la entrega y se valoran. La reputación queda en el perfil.
          </p>
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
              <h2 className="font-display text-2xl sm:text-3xl">Mercado P2P</h2>
              <p className="text-sm text-mute sm:text-base">
                Ofertas abiertas · #cambio / #necesito / municipio
              </p>
            </div>
            <Link href="/explorar" className="text-sm font-semibold text-brand">
              Ver todas
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
          {[
            {
              icon: IconShield,
              t: "Confianza, no escrow de dinero",
              d: "Perfiles verificables, historial de trueques y valoración 1–5. La reputación es lo que custodia el trato.",
            },
            {
              icon: IconChat,
              t: "Chat del trueque",
              d: "Puedes aclarar, ofrecer otro artículo no publicado o coordinar el punto. Solo las dos partes ven el hilo.",
            },
            {
              icon: IconStar,
              t: "Regla de oro",
              d: "Si pides efectivo, no es MeCuadra. Revolico y Facebook cubren la venta. Aquí el trueque se defiende.",
            },
          ].map((b) => (
            <article key={b.t} className="card p-5">
              <b.icon className="h-6 w-6 text-brand" />
              <h3 className="mt-3 font-display text-lg">{b.t}</h3>
              <p className="mt-2 text-sm leading-6 text-mute">{b.d}</p>
            </article>
          ))}
        </div>
        <div
          className="mx-auto mt-8 flex max-w-6xl flex-col items-start gap-4 rounded-[1.35rem] p-8 text-white shadow-lg shadow-brand/20 md:flex-row md:items-center md:justify-between"
          style={{ background: "var(--grad)" }}
        >
          <div>
            <p className="font-display text-2xl">¿Tienes algo que ya no usas?</p>
            <p className="mt-1 text-white/85">Alguien en tu municipio lo está buscando hoy.</p>
          </div>
          <Link
            href="/publicar"
            className="rounded-full bg-surface px-5 py-3 text-sm font-semibold text-brand shadow-sm"
          >
            Publicar oferta
          </Link>
        </div>
        <p className="mx-auto mt-6 flex max-w-6xl items-center gap-2 text-xs text-mute">
          <IconCheck className="h-4 w-4 text-brand" />
          Explorar no pide ubicación. El municipio es un filtro, nunca un muro.
        </p>
      </section>
    </div>
  );
}
