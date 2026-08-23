import { Callout, CodeBlock, DocHero } from "@/components/docs/widgets";

export const metadata = { title: "Desplegar" };

export default function Page() {
  return (
    <article className="docs-prose max-w-3xl">
      <DocHero
        kicker="Producción"
        title="Vercel delante. Telegram en la puerta."
        lead="El mercado es público. La sesión sale del Login Widget de Telegram; Supabase guarda el perfil."
      />
      <h2>Variables</h2>
      <CodeBlock
        label=".env"
        code={`NEXT_PUBLIC_SUPABASE_URL=https://wcrgbcxewqqbnjvelwrp.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=
MESSAGE_ENCRYPTION_KEY=
TELEGRAM_BOT_TOKEN=
TELEGRAM_BOT_USERNAME=
NEXT_PUBLIC_TELEGRAM_BOT_USERNAME=
SUPABASE_SERVICE_ROLE_KEY=`}
      />
      <h2>SQL</h2>
      <p>
        Ejecuta <code>supabase/schema.sql</code> (incluye <code>telegram_id</code> en
        profiles).
      </p>
      <h2>BotFather</h2>
      <ul>
        <li>
          <code>/setdomain</code> → <code>mecuadra.vercel.app</code>
        </li>
        <li>
          El widget vive en <code>/login</code> y autentica vía{" "}
          <code>/api/auth/telegram/login</code>
        </li>
      </ul>
      <Callout title="Sin Google ni SMS">
        No hace falta Providers → Google ni Phone. El correo interno{" "}
        <code>tg_*@telegram.mecuadra.app</code> solo existe para la sesión de Supabase.
      </Callout>
    </article>
  );
}
