import { Callout, CodeBlock, DocHero } from "@/components/docs/widgets";

export const metadata = { title: "Desplegar" };

export default function Page() {
  return (
    <article className="docs-prose max-w-3xl">
      <DocHero
        kicker="Producción"
        title="Vercel adelante. Postgres detrás."
        lead="El repo ya está en GitHub. El mercado sale cuando el esquema corre en Supabase y las tres variables están en Vercel."
      />
      <h2>Variables</h2>
      <CodeBlock
        label=".env"
        code={`NEXT_PUBLIC_SUPABASE_URL=https://wcrgbcxewqqbnjvelwrp.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=
MESSAGE_ENCRYPTION_KEY=
BUDGETSMS_USERNAME=
BUDGETSMS_USERID=
BUDGETSMS_HANDLE=
BUDGETSMS_FROM=MeCuadra
SEND_SMS_HOOK_SECRET=`}
      />
      <p>
        La llave de mensajes son 32 bytes en hex (64 caracteres). No la subas al repo.
      </p>
      <CodeBlock
        label="bash"
        code={`node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`}
      />
      <h2>SQL</h2>
      <p>
        En el SQL Editor de Supabase pega <code>supabase/schema.sql</code>. Crea tipos,
        tablas, triggers de perfil, notificaciones, RLS, buckets y Realtime.
      </p>
      <h2>Auth en el dashboard</h2>
      <ul>
        <li>Email activo, confirmación por OTP. Plantilla con <code>{"{{ .Token }}"}</code>.</li>
        <li>
          Phone activo. En Hooks → Send SMS (HTTPS):{" "}
          <code>https://mecuadra.vercel.app/api/auth/send-sms</code>. No uses Twilio
          (bloquea +53).
        </li>
        <li>
          Telegram (gratis, Cubacel): crea un bot con @BotFather, pon{" "}
          <code>TELEGRAM_BOT_TOKEN</code> y <code>TELEGRAM_BOT_USERNAME</code>, y el
          service role. Webhook:{" "}
          <code>https://mecuadra.vercel.app/api/auth/telegram</code>
        </li>
        <li>Google, con callback de Supabase (opcional en la isla si está bloqueado).</li>
        <li>
          Redirects: <code>http://localhost:3000/auth/callback</code> y el dominio de
          Vercel.
        </li>
      </ul>
      <Callout title="Importar en Vercel">
        Framework Next.js, el repo reykratosxx/mecuadra, las tres env, deploy. Luego
        pega ese dominio en los redirects de Auth.
      </Callout>
    </article>
  );
}
