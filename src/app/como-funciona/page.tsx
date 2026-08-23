import Link from "next/link";

export const metadata = { title: "Cómo funciona" };

const flow = [
  {
    t: "Oferta abierta",
    d: "Publicas #cambio, #necesito y municipio. Queda en el libro público, filtrable por categoría, condición y zona.",
  },
  {
    t: "MeCuadra",
    d: "Te postulas como contraparte: eliges artículos o describes lo que puedes dar, aunque no esté publicado.",
  },
  {
    t: "Chat del trueque",
    d: "Solo ustedes dos ven el hilo. Puedes aclarar, ofrecer otra cosa o coordinar el punto de encuentro.",
  },
  {
    t: "Aceptar",
    d: "El dueño elige una propuesta. Las demás se rechazan. La oferta pasa a en proceso.",
  },
  {
    t: "Confirmar recepción",
    d: "Cada parte marca entregado. Cuando ambos confirman, el trueque se cierra. Luego se valoran.",
  },
];

export default function ComoFuncionaPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="font-display text-4xl">Cómo funciona MeCuadra</h1>
      <p className="mt-3 text-lg leading-7 text-mute">
        MeCuadra es el mercado de intercambio entre personas en Cuba. El mismo
        formato que ya usas en Telegram — lo que cambias, lo que necesitas, tu
        municipio — con fotos, búsqueda y un historial de trueques en el que se
        puede confiar.
      </p>

      <ol className="mt-8 space-y-4">
        {flow.map((s, i) => (
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

      <section className="mt-10">
        <h2 className="font-display text-2xl">Por qué no hay precios ni saldo</h2>
        <p className="mt-2 text-sm leading-6 text-mute">
          Un litro de aceite en Vedado no vale lo mismo que en un catálogo extranjero.
          El valor lo ponen las dos personas en el momento. Revolico y Facebook cubren
          la venta; aquí el listado es solo trueque.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-2xl">Hecho para que se pueda usar de verdad</h2>
        <ul className="mt-3 grid gap-2 text-sm text-mute">
          {[
            "El municipio es un filtro, nunca un muro de GPS.",
            "Barrios reales: Vedado, La Víbora, Cerro… no códigos raros.",
            "Las fotos se recorren con flechas, Escape o deslizando.",
            "Puedes pausar, editar o dar de baja un artículo.",
            "Entras con Telegram. El mercado se ve sin cuenta; publicar y aplicar piden sesión.",
            "Cero efectivo en los listados. Si es venta, no es MeCuadra.",
          ].map((x) => (
            <li key={x} className="card p-3">
              {x}
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/explorar" className="btn-primary">
          Ir al mercado
        </Link>
        <Link href="/docs" className="btn-ghost">
          Abrir las docs
        </Link>
      </div>
    </div>
  );
}
