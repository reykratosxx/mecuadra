import { DocHero, Steps } from "@/components/docs/widgets";

export const metadata = { title: "Trueques y reputación" };

export default function Page() {
  return (
    <article className="docs-prose max-w-3xl">
      <DocHero
        kicker="Confianza"
        title="La nota que dejas es la garantía."
        lead="Mis trueques se parten en Aceptados, Recibidos y Enviados. Cuando el trato cierra, se valoran. Esa media se ve en el perfil."
      />
      <Steps
        items={[
          { title: "Pendiente", text: "Alguien aplicó. El dueño acepta o rechaza." },
          { title: "Aceptado", text: "El chat sigue. Coordinan el encuentro." },
          { title: "Entregado", text: "Una parte ya confirmó. Falta la otra." },
          { title: "Completado", text: "Ambos confirmaron. Toca valorar de 1 a 5." },
        ]}
      />
      <h2>Qué sube al perfil</h2>
      <p>
        Promedio, cantidad de notas y trueques cerrados. Un sello de verificado aparece
        cuando el equipo lo marca. La reputación acompaña tu identidad de Telegram; no
        sustituye el sentido común al quedar.
      </p>
    </article>
  );
}
