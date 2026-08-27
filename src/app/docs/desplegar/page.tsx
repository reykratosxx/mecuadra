import { Callout, CodeBlock, DocHero } from "@/components/docs/widgets";

export const metadata = { title: "Desplegar" };

export default function Page() {
  return (
    <article className="docs-prose max-w-3xl">
      <DocHero
        kicker="Producción"
        title="Vercel delante. Telegram en la puerta."
        lead="El mercado es público. La sesión sale de Telegram (widget oficial y, si hace falta, el bot). Supabase guarda el perfil, las ofertas y el chat cifrado."
      />
      <h2>Variables</h2>
      <p>
        Usa tu propio proyecto. No copies URLs ni claves de producción ajenas a un repo
        público.
      </p>
      <CodeBlock
        label=".env.local"
        code={`NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
MESSAGE_ENCRYPTION_KEY=
TELEGRAM_BOT_TOKEN=
TELEGRAM_BOT_USERNAME=
NEXT_PUBLIC_TELEGRAM_BOT_USERNAME=
NEXT_PUBLIC_SITE_URL=https://tu-dominio.ejemplo`}
      />
      <p>
        <code>MESSAGE_ENCRYPTION_KEY</code> son 32 bytes en hex (64 caracteres). Genera una
        propia; no la reutilices entre entornos.
      </p>
      <CodeBlock
        label="shell"
        code={`node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`}
      />
      <h2>Base de datos</h2>
      <p>
        En el SQL Editor de Supabase ejecuta <code>supabase/schema.sql</code> y, si
        existen, las migraciones adicionales en <code>supabase/*.sql</code> (categorías,
        <code>updated_at</code> de ofertas, sesiones de login por bot, etc.).
      </p>
      <h2>Telegram</h2>
      <ul>
        <li>
          Crea el bot en BotFather. Guarda el token solo en variables de entorno del
          servidor.
        </li>
        <li>
          <code>/setdomain</code> → el dominio público de tu despliegue (sin{" "}
          <code>https://</code>). <code>localhost</code> no sirve en producción.
        </li>
        <li>
          El widget vive en <code>/login</code>. Verifica la firma HMAC del payload antes de
          abrir sesión.
        </li>
        <li>
          Si el widget se atasca en algunos móviles, el acceso por bot usa un enlace de un
          solo uso y un webhook efímero. Configúralo una vez desde tu entorno (ruta de
          setup del proyecto), no desde el navegador de un usuario.
        </li>
      </ul>
      <Callout title="Sin Google ni SMS">
        No hace falta Phone Auth ni Google. La sesión de Supabase se abre tras validar
        Telegram en el servidor.
      </Callout>
    </article>
  );
}
