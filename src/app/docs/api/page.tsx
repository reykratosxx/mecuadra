import { Callout, CodeBlock, DocHero } from "@/components/docs/widgets";

export const metadata = { title: "API" };

export default function Page() {
  return (
    <article className="docs-prose max-w-3xl">
      <DocHero
        kicker="Construir"
        title="Pocas rutas. Bien cerradas."
        lead="La app habla con Postgres vía el cliente autenticado. El único sitio donde el servidor toca el texto del chat es la API de mensajes: ahí se cifra y se descifra."
      />
      <h2>Sesión</h2>
      <p>
        El Login Widget de Telegram autentica en <code>POST /api/auth/telegram/login</code>{" "}
        (HMAC del bot). La sesión queda en cookies SSR. El proxy de Next refresca con{" "}
        <code>getUser()</code>.
      </p>
      <CodeBlock
        label="auth"
        code={`POST /api/auth/telegram/login
GET  /auth/signout`}
      />
      <h2>Mensajes</h2>
      <CodeBlock
        label="json"
        code={`POST /api/trades/:id/messages
Authorization: cookie de sesión
{ "text": "string, 1–600" }

201 { "message": { "id", "tradeId", "senderId", "text", "createdAt" } }`}
      />
      <p>Errores habituales: 401 sin sesión, 403 si no eres parte, 409 si el trueque ya cerró.</p>
      <h2>Tablas públicas (lectura)</h2>
      <p>
        Perfiles, artículos y ofertas abiertas se leen con RLS. Trueques, notificaciones
        y ciphertext del chat solo existen para los pares del trato.
      </p>
      <Callout title="No hay un dump de chats">
        Cada hilo nace de un trueque. Si no eres parte, la base responde vacío.
      </Callout>
    </article>
  );
}
