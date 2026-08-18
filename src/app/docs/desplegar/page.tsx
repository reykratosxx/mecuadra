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
MESSAGE_ENCRYPTION_KEY=`}
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
        <li>Email con plantilla <code>{"{{ .Token }}"}</code>.</li>
        <li>Phone / SMS para +53.</li>
        <li>Google, con callback de Supabase.</li>
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
