import { Callout, CodeBlock, DocHero } from "@/components/docs/widgets";

export const metadata = { title: "API" };

export default function Page() {
  return (
    <article className="docs-prose max-w-3xl">
      <DocHero
        kicker="Construir"
        title="Pocas rutas. Bien cerradas."
        lead="La app habla con Postgres vía el cliente autenticado. El servidor interviene en el login de Telegram y en el chat: ahí se verifica la firma y se cifra el texto."
      />
      <h2>Sesión</h2>
      <p>
        El Login Widget autentica con un <code>POST</code> al endpoint de login de Telegram
        (HMAC del bot). Si el widget falla en el móvil, hay un flujo alternativo por el bot
        oficial: la web espera confirmación y luego abre la misma sesión en cookies SSR.
      </p>
      <CodeBlock
        label="auth"
        code={`POST /api/auth/telegram/login
GET  /auth/signout`}
      />
      <p>
        El proxy de Next refresca la sesión con <code>getUser()</code>. No expongas la
        service role al navegador.
      </p>
      <h2>Mensajes</h2>
      <CodeBlock
        label="json"
        code={`POST /api/trades/:id/messages
Authorization: cookie de sesión
{ "text": "string, 1–600" }

201 { "message": { "id", "tradeId", "senderId", "text", "createdAt" } }`}
      />
      <p>Errores habituales: 401 sin sesión, 403 si no eres parte, 409 si el trueque ya cerró.</p>
      <h2>Datos públicos (lectura)</h2>
      <p>
        Perfiles visibles, artículos y ofertas abiertas se leen con RLS. Trueques,
        notificaciones y el ciphertext del chat solo existen para los pares del trato.
      </p>
      <Callout title="No hay un dump de chats">
        Cada hilo nace de un trueque. Si no eres parte, la base responde vacío.
      </Callout>
    </article>
  );
}
