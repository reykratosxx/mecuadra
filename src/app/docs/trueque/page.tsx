import { Callout, DocHero, Steps } from "@/components/docs/widgets";

export const metadata = { title: "El trueque en 5 toques" };

export default function Page() {
  return (
    <article className="docs-prose max-w-3xl">
      <DocHero
        kicker="Flujo"
        title="Cinco toques y el trato está vivo."
        lead="No hay saldo que congelar. Lo que custodia el encuentro es la reputación, el chat cerrado y que las dos partes marquen entregado."
      />
      <Steps
        items={[
          {
            title: "Publicas lo que cambias",
            text: "Primero el artículo (fotos, condición, categoría). Luego la oferta: qué das, qué buscas, municipio, barrio y si tienes transporte.",
          },
          {
            title: "Alguien toca MeCuadra",
            text: "Elige de su inventario o escribe una propuesta libre — incluso algo que no tiene publicado.",
          },
          {
            title: "Se abre el chat",
            text: "Solo dueño y aplicante. Coordinan el punto. Nadie más lee el hilo.",
          },
          {
            title: "Aceptas una propuesta",
            text: "Las demás se rechazan. La oferta pasa a en proceso.",
          },
          {
            title: "Confirman y valoran",
            text: "Cada uno marca entregado. Cuando ambos lo hacen, el trueque se cierra y se califican.",
          },
        ]}
      />
      <Callout title="El municipio no es un muro">
        Puedes ver ofertas de toda Cuba. Filtrar por Plaza o Cerro es opcional. Nunca
        pedimos GPS para dejar entrar.
      </Callout>
    </article>
  );
}
