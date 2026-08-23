import { Callout, DocHero, Steps } from "@/components/docs/widgets";

export const metadata = { title: "Cuenta y códigos" };

export default function Page() {
  return (
    <article className="docs-prose max-w-3xl">
      <DocHero
        kicker="Cuenta"
        title="Un toque. Tu Telegram. Listo."
        lead="MeCuadra entra solo con el Login Widget de Telegram. Sin Google, sin correo OTP y sin SMS. El mercado se ve libre; publicar y aplicar piden la sesión de Telegram."
      />
      <h2>Cómo funciona</h2>
      <ul>
        <li>
          <strong>Explorar</strong> — sin cuenta. Ves ofertas y detalles.
        </li>
        <li>
          <strong>Entrar</strong> — el botón oficial de Telegram. Confirma tu identidad
          con la app que ya usas en Cuba.
        </li>
        <li>
          <strong>Publicar / MeCuadra</strong> — con la sesión abierta.
        </li>
      </ul>
      <Steps
        items={[
          { title: "Abres /login", text: "Ves el widget azul de Telegram." },
          { title: "Confirmas en la app", text: "Telegram te pregunta si confías en MeCuadra." },
          { title: "Ya estás dentro", text: "Publicas, aplicas y chateas." },
        ]}
      />
      <Callout title="BotFather" tone="warn">
        En @BotFather → /setdomain → <code>mecuadra.vercel.app</code>. Sin dominio el
        widget no monta. Variables: <code>TELEGRAM_BOT_TOKEN</code> y{" "}
        <code>NEXT_PUBLIC_TELEGRAM_BOT_USERNAME</code>.
      </Callout>
    </article>
  );
}
