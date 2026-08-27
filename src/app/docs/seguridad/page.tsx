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
          <strong>Identidad</strong> — Telegram (widget oficial y, si hace falta, bot). El
          servidor valida la firma antes de crear la sesión. Explorar es público; publicar
          y aplicar piden sesión.
        </li>
        <li>
          <strong>Autorización</strong> — Row Level Security en todas las tablas.
        </li>
        <li>
          <strong>Chat en reposo</strong> — AES-256-GCM. La llave vive solo en el servidor,
          nunca en el navegador.
        </li>
        <li>
          <strong>Fotos</strong> — el path de storage empieza por tu usuario autenticado.
        </li>
      </ul>
      <h2>Qué no pedimos</h2>
      <ul>
        <li>SMS ni OTP de teléfono para entrar.</li>
        <li>GPS obligatorio. El barrio lo escribes tú.</li>
        <li>Dinero en custodia. MeCuadra no intermedia efectivo.</li>
      </ul>
      <Callout title="Cerrar sesión" tone="ok">
        Cerrar sesión es un sí/no en la web. Tu cuenta de Telegram sigue siendo tuya; solo
        se cierra la sesión de MeCuadra en este navegador.
      </Callout>
    </article>
  );
}
