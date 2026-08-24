import { Callout, DocHero, Steps } from "@/components/docs/widgets";

export const metadata = { title: "Cuenta y códigos" };

export default function Page() {
  return (
    <article className="docs-prose max-w-3xl">
      <DocHero
        kicker="Cuenta"
        title="Un toque. Tu Telegram. Listo."
        lead="Priorizamos el Login Widget oficial de Telegram (la confirmación sale de Telegram, no de un chat raro). Si en el móvil se atasca pidiendo número, hay un acceso alternativo por el bot oficial de MeCuadra."
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
          y no avanza.
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
      <Callout title="BotFather + SQL" tone="warn">
        Widget: /setdomain → <code>mecuadra.vercel.app</code>. Alternativa por bot: webhook en{" "}
        <code>/api/auth/telegram</code> y tabla <code>telegram_auth_sessions</code>. Variables:{" "}
        <code>TELEGRAM_BOT_TOKEN</code>, <code>NEXT_PUBLIC_TELEGRAM_BOT_USERNAME</code>.
      </Callout>
    </article>
  );
}
