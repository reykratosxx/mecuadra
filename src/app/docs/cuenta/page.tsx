import { Callout, DocHero, Steps } from "@/components/docs/widgets";

export const metadata = { title: "Cuenta y códigos" };

export default function Page() {
  return (
    <article className="docs-prose max-w-3xl">
      <DocHero
        kicker="Cuenta"
        title="Un toque. Tu Telegram. Listo."
        lead="MeCuadra entra abriendo el bot de Telegram (sin pedir teléfono en el navegador). Sin Google, sin correo OTP y sin SMS. El mercado se ve libre; publicar y aplicar piden la sesión."
      />
      <h2>Cómo funciona</h2>
      <ul>
        <li>
          <strong>Explorar</strong> — sin cuenta. Ves ofertas y detalles.
        </li>
        <li>
          <strong>Entrar</strong> — Continuar con Telegram abre el bot. Confirmas con Start
          y vuelves a la web.
        </li>
        <li>
          <strong>Publicar / MeCuadra</strong> — con la sesión abierta.
        </li>
      </ul>
      <Steps
        items={[
          { title: "Abres /login", text: "Tocas Continuar con Telegram." },
          { title: "Confirmas en el bot", text: "Start en @mecuadrabot. Sin número ni SMS." },
          { title: "Ya estás dentro", text: "La web detecta la confirmación y abre la sesión." },
        ]}
      />
      <Callout title="BotFather + webhook" tone="warn">
        El bot necesita webhook apuntando a{" "}
        <code>/api/auth/telegram</code>. Variables: <code>TELEGRAM_BOT_TOKEN</code> y{" "}
        <code>NEXT_PUBLIC_TELEGRAM_BOT_USERNAME</code>. En Supabase ejecuta el SQL de{" "}
        <code>telegram_auth_sessions</code>.
      </Callout>
    </article>
  );
}
