import { Callout, DocHero, Steps } from "@/components/docs/widgets";

export const metadata = { title: "El botón MeCuadra" };

export default function Page() {
  return (
    <article className="docs-prose max-w-3xl">
      <DocHero
        kicker="Aplicar"
        title="Un toque. Una propuesta. Un chat."
        lead="MeCuadra es el momento en que dejas de mirar y te postulas como contraparte. No hay dinero en custodia. Hay lo que ofreces a cambio."
      />
      <Steps
        items={[
          {
            title: "Abres la oferta",
            text: "Ves fotos, lo que da, lo que busca, barrio y transporte.",
          },
          {
            title: "Tocas MeCuadra",
            text: "Marcas tus artículos o escribes algo que no está publicado.",
          },
          {
            title: "El dueño decide",
            text: "Acepta o rechaza. Si acepta, las demás propuestas de esa oferta caen.",
          },
        ]}
      />
      <Callout title="No puedes aplicar a lo tuyo">
        Ni sin teléfono verificado. El servidor lo bloquea; no es solo la interfaz.
      </Callout>
    </article>
  );
}
