import { Callout, DocHero } from "@/components/docs/widgets";

export const metadata = { title: "Artículos y ofertas" };

export default function Page() {
  return (
    <article className="docs-prose max-w-3xl">
      <DocHero
        kicker="Mercado"
        title="El mismo formato del grupo, con fotos."
        lead="#cambio, #necesito y #municipio. Barrio de verdad — Vedado, La Víbora, Cerro — no un código que nadie entiende."
      />
      <h2>Primero el artículo</h2>
      <p>
        Título, descripción, categoría, condición (nuevo, usado o sellado) y varias fotos.
        Las recorres con flechas, Escape o deslizando. Puedes pausar o dar de baja cuando
        quieras.
      </p>
      <h2>Luego la oferta</h2>
      <ul>
        <li>Qué ofreces (uno o varios artículos).</li>
        <li>Qué necesitas, o “escucho propuestas”.</li>
        <li>Provincia, municipio, barrio.</li>
        <li>Transporte: tengo, sin (debe venir) o voy al lugar.</li>
      </ul>
      <Callout title="Filtros">
        Categoría, condición, provincia, municipio, transporte y si acepta propuestas.
        El buscador mira títulos, barrios y nombres. Ver lejos de tu casa siempre está
        permitido.
      </Callout>
      <Callout title="Compartir en grupos">
        En cada oferta puedes mandarla a un grupo de Telegram, WhatsApp o Facebook. Se
        abre la app y tú eliges el grupo; el texto ya va en formato #cambio / #necesito /
        #municipio.
      </Callout>
    </article>
  );
}
