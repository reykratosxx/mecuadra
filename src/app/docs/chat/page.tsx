import { Callout, CodeBlock, DocHero } from "@/components/docs/widgets";

export const metadata = { title: "Chat" };

export default function Page() {
  return (
    <article className="docs-prose max-w-3xl">
      <DocHero
        kicker="Conversación"
        title="El hilo es de ustedes dos."
        lead="Puedes aclarar, ofrecer otra cosa o citar un parque. El texto se cifra antes de guardarse. En la base no queda el mensaje en claro."
      />
      <h2>Quién ve qué</h2>
      <p>
        Solo el dueño de la oferta y quien aplicó. La regla vive en Postgres (RLS), no
        en un if del navegador.
      </p>
      <h2>Cómo viaja un mensaje</h2>
      <CodeBlock
        label="http"
        code={`POST /api/trades/{id}/messages
{ "text": "¿Te cuadra aceite sellado mañana en 21 y 8?" }

GET  /api/trades/{id}/messages`}
      />
      <p>
        El servidor envuelve el texto en AES-256-GCM y guarda solo el ciphertext. Al
        leer, descifra para quien ya pasó la regla de “eres parte de este trueque”.
      </p>
      <Callout title="Tiempo real">
        Un alta en el hilo dispara una recarga cifrada. No mandamos el plaintext por el
        websocket.
      </Callout>
    </article>
  );
}
