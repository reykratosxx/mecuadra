import { Callout, DocHero } from "@/components/docs/widgets";

export const metadata = { title: "Seguridad" };

export default function Page() {
  return (
    <article className="docs-prose max-w-3xl">
      <DocHero
        kicker="Confianza técnica"
        title="La puerta está en la base, no en el botón."
        lead="Aunque alguien hable directo al API con la clave anónima, Postgres decide qué filas existen para ese usuario."
      />
      <h2>Capas</h2>
      <ul>
        <li>
          <strong>Tránsito</strong> — HTTPS en Vercel y en Supabase.
        </li>
        <li>
          <strong>Identidad</strong> — OTP de correo o SMS; Google; teléfono para
          publicar y aplicar.
        </li>
        <li>
          <strong>Autorización</strong> — Row Level Security en todas las tablas.
        </li>
        <li>
          <strong>Chat en reposo</strong> — AES-256-GCM. La llave vive en{" "}
          <code>MESSAGE_ENCRYPTION_KEY</code>, nunca en el navegador.
        </li>
        <li>
          <strong>Fotos</strong> — el path empieza por tu <code>auth.uid()</code>.
        </li>
      </ul>
      <Callout title="Cerrar sesión" tone="ok">
        Pedimos de nuevo un código al correo o al SMS. No es un adorno: confirma que
        quien sale eres tú.
      </Callout>
    </article>
  );
}
