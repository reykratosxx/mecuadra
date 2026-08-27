import { Callout, DocHero, Steps } from "@/components/docs/widgets";

export const metadata = { title: "Cuenta y Telegram" };

export default function Page() {
  return (
    <article className="docs-prose max-w-3xl">
      <DocHero
        kicker="Cuenta"
        title="Un toque. Tu Telegram. Listo."
        lead="Priorizamos el Login Widget oficial de Telegram: la confirmación sale de Telegram, no de un chat raro. Si en el móvil se atasca (a veces pide número y no avanza), hay un acceso alternativo por el bot oficial de MeCuadra."
      />
      <h2>Cómo funciona</h2>
      <ul>
        <li>
          <strong>Explorar</strong> — sin cuenta. Ves ofertas y detalles.
        </li>
        <li>
          <strong>Entrar (recomendado)</strong> — botón oficial de Telegram. Confirmas en la app.
        </li>
        <li>
          <strong>Alternativa</strong> — bot oficial de MeCuadra solo si el widget pide teléfono
          y no avanza. En Telegram tocas <em>Iniciar</em> y vuelves a la web.
        </li>
      </ul>
      <Steps
        items={[
          { title: "Login oficial", text: "El botón azul de Telegram. Aceptas en la app." },
          {
            title: "Si se atasca",
            text: "“¿No llega la confirmación?” → abre el bot oficial y pulsa Iniciar.",
          },
          { title: "Listo", text: "La web abre la sesión. Publicas y aplicas." },
        ]}
      />
      <h2>Qué pedimos y qué no</h2>
      <ul>
        <li>No pedimos SMS ni correo para entrar.</li>
        <li>No pedimos GPS. Municipio y barrio los escribes tú en las ofertas.</li>
        <li>La identidad de la sesión viene de Telegram (nombre, foto y usuario si los tienes públicos).</li>
      </ul>
      <Callout title="Privacidad" tone="ok">
        No compartas el chat del bot ni enlaces de acceso con nadie. Si alguien te escribe
        pidiendo el código o el token “para ayudarte a entrar”, cierra y vuelve a{" "}
        <code>/login</code> desde MeCuadra.
      </Callout>
    </article>
  );
}
