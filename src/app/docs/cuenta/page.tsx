import { Callout, DocHero, Steps } from "@/components/docs/widgets";

export const metadata = { title: "Cuenta y códigos" };

export default function Page() {
  return (
    <article className="docs-prose max-w-3xl">
      <DocHero
        kicker="Cuenta"
        title="Un código, y eres tú."
        lead="Entras con Google, con un código al correo o con un SMS al +53. Publicar y aplicar piden teléfono verificado: un número es más difícil de fabricar que mil Gmails."
      />
      <h2>Tres puertas</h2>
      <ul>
        <li>
          <strong>SMS</strong> — código de 6 dígitos al celular cubano.
        </li>
        <li>
          <strong>Correo</strong> — el mismo estilo de código, en la bandeja.
        </li>
        <li>
          <strong>Google</strong> — rápido, y después te pedimos el teléfono si aún no lo tienes.
        </li>
      </ul>
      <Steps
        items={[
          { title: "Pides el código", text: "En /login eliges SMS o correo y tocas enviar." },
          { title: "Lo escribes", text: "Caduca en minutos. No lo reenvíes a nadie." },
          { title: "Listo", text: "Si falta el teléfono, te llevamos a verificarlo antes de publicar." },
        ]}
      />
      <h2>Cerrar sesión</h2>
      <p>
        No basta con tocar el botón. Te enviamos un código al SMS o al correo — el canal
        que elijas entre los que ya tienes — y solo entonces se cierra la sesión.
      </p>
      <Callout title="En el panel de Auth" tone="warn">
        El correo debe usar la plantilla con el token numérico. El SMS necesita un
        proveedor (por ejemplo Twilio) habilitado para números +53.
      </Callout>
    </article>
  );
}
