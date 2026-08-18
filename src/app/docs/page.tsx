import Link from "next/link";
import { Callout, DocHero } from "@/components/docs/widgets";

export const metadata = { title: "Documentación" };

export default function DocsHome() {
  return (
    <article className="docs-prose max-w-3xl">
      <DocHero
        kicker="MeCuadra · Docs"
        title="El cuaderno del trueque."
        lead="Aquí está escrito, con calma, cómo se publica, se aplica, se habla y se cierra un intercambio en Cuba. Sin jerga inútil. Con dibujos, ejemplos y el mismo morado del apretón de manos."
      />

      <div className="docs-flow">
        {[
          ["01", "Publicas", "Lo que tienes, con foto y barrio."],
          ["02", "Alguien aplica", "Toca MeCuadra y propone."],
          ["03", "Hablan", "Chat cerrado, solo ustedes."],
          ["04", "Se ven", "Confirman la entrega."],
          ["05", "Se valoran", "La reputación queda."],
        ].map(([n, t, d]) => (
          <article key={n}>
            <span className="docs-hex !h-8 !w-8 !text-[10px]">{n}</span>
            <strong className="mt-2">{t}</strong>
            <span>{d}</span>
          </article>
        ))}
      </div>

      <h2>Para quién es este cuaderno</h2>
      <p>
        Para quien viene del grupo de Telegram y quiere un lugar con fotos, filtros y
        memoria. Y para quien construye MeCuadra: auth, API, cifrado y despliegue.
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <Link href="/docs/trueque" className="card block p-5 hover:border-brand/30">
          <p className="text-xs font-semibold uppercase tracking-wider text-brand">Empieza</p>
          <p className="mt-1 font-display text-xl">El trueque en 5 toques</p>
          <p className="mt-1 text-sm text-mute">El ciclo completo, dibujado.</p>
        </Link>
        <Link href="/docs/api" className="card block p-5 hover:border-brand/30">
          <p className="text-xs font-semibold uppercase tracking-wider text-brand">Construir</p>
          <p className="mt-1 font-display text-xl">API</p>
          <p className="mt-1 text-sm text-mute">Mensajes, sesión y tiempo real.</p>
        </Link>
      </div>

      <Callout title="Regla de oro">
        Si pides efectivo en el listado, no es MeCuadra. Revolico y Facebook cubren la
        venta. Aquí el trato es intercambio.
      </Callout>

      <p>
        Pulsa <kbd className="rounded border border-line px-1.5 text-xs">⌘K</kbd> o el
        buscador de arriba. El índice de la izquierda no se esconde en escritorio.
      </p>
    </article>
  );
}
