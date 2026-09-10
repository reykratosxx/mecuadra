"use client";

import Link from "next/link";
import { useT } from "@/lib/i18n/provider";
import { Callout, Steps } from "@/components/docs/widgets";

export default function CypherpunkDocsPage() {
  const t = useT();
  const en = t.langName === "English";

  if (!en) {
    return (
      <article className="docs-prose max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand">BOSS Battle</p>
        <h1 className="font-display text-4xl">{t.docs.cypherpunk}</h1>
        <p className="text-lg leading-7 text-mute">{t.tagline}</p>

        <h2>La tesis (por qué esto gana el track)</h2>
        <p>
          El ledger de Bitcoin es un dossier permanente. Casi todas las herramientas de privacidad
          asumen que <strong>pagas</strong> y luego ocultan el pago (mixers, CoinJoin, higiene de
          wallet). MeCuadra hace otra cosa: el trueque cotidiano <strong>no crea el pago</strong>.
          No hay tx on-chain del intercambio. La frase del vídeo:{" "}
          <em>no payment trail because there is no payment</em>.
        </p>
        <Callout title="Cypherpunk">
          El camino fácil ya es el privado: clave en vez de SMS, chat que el operador no lee,
          reputación sin grafo vendible de “quién truequeó con quién”.
        </Callout>
        <Callout title="Freedom Stack">
          La misma clave secp256k1 es un npub. Ofertas en relays (kind 31112). Chat NIP-44. Cashu
          anti-spam. Sin un intermediario que revoque el acceso o lea el hilo.
        </Callout>

        <h2>Ejemplo práctico — Lisboa, un sábado</h2>
        <p>
          Ana tiene una bici plegable que ya no usa. Busca una cámara analógica 35 mm. No quiere
          poner un precio en euros ni en sats: quiere un trueque.
        </p>
        <Steps
          items={[
            {
              title: "Entra con una clave Bitcoin",
              text: "Toca “Create a new key”. El navegador deriva nsec/npub (secp256k1, la misma curva que Bitcoin). Guarda el nsec en un papel. MeCuadra no lo ve. Su cuenta es el npub.",
            },
            {
              title: "Publica sin KYC y sin precio",
              text: "Acuña un sello Cashu (anti-spam, no el precio de la bici). Publica: ofrece bici plegable, necesita cámara 35 mm, ciudad Lisboa. La oferta también puede salir a relays Nostr (kind 31112).",
            },
            {
              title: "Bruno aplica",
              text: "Bruno, en Oporto, ve la oferta. Toca MeCuadra y propone su Olympus. No hay Lightning para “completar la diferencia”.",
            },
            {
              title: "Hablan cifrado",
              text: "El chat es NIP-44. Quedan en un café cerca de Cais do Sodré. El servidor solo guarda ciphertext. Un operador de MeCuadra no puede leer el punto.",
            },
            {
              title: "Se ven, confirman, se valoran",
              text: "Cada uno marca entregado. Se valoran 5 estrellas. El perfil puede mostrar un badge ZK: “suficientes trueques buenos” sin publicar que Ana truequeó con Bruno.",
            },
          ]}
        />
        <p>
          Si Ana hubiera <em>vendido</em> la bici por sats, el ledger guardaría para siempre un
          pago clusterizable. Aquí no hay pago. El rastro que sí existía en apps (teléfono, chat
          legible, grafo de ratings) es lo que este fork apaga por defecto.
        </p>

        <h2>Qué usa Bitcoin de verdad — y qué no</h2>
        <ul>
          <li>
            <strong>Sí:</strong> identidad secp256k1, códigos estilo Silent Payment (BIP-352),
            anti-spam Cashu / Lightning de mint, eventos Nostr, pruebas ZK de reputación en el
            cliente.
          </li>
          <li>
            <strong>No:</strong> no hay on-chain ni Lightning como liquidación del bien. El trueque
            se cierra en persona.
          </li>
        </ul>

        <h2>¿ZK le da mejor impacto? Sí — si somos honestos</h2>
        <p>
          Sin ZK, un marketplace “privado” acaba publicando un grafo: Ana valoró a Bruno, Bruno a
          Carla. Eso se vende y se clusteriza igual que un historial de pagos. El badge ZK es lo
          que permite <strong>confianza sin dossier</strong>: demuestras que tienes suficientes
          notas buenas, no con quién te viste ni las estrellas exactas.
        </p>
        <p>Dos capas, dichas en voz alta:</p>
        <ul>
          <li>
            <strong>Lo que corre en la app:</strong> Pedersen + range proofs (OR) en el cliente (
            <code>src/lib/zk/reputation.ts</code>). El perfil verifica el badge en el navegador.
            Bitcoin Script <em>no</em> comprueba esto.
          </li>
          <li>
            <strong>El camino SNARK:</strong> <code>circuits/reputation.circom</code> sigue{" "}
            <a href="https://github.com/BitVM/bitvm-circom-example">BitVM/bitvm-circom-example</a>
            : Circom → witness → <strong>fflonk</strong> → dos salidas públicas (SHA256 partido).
            El verificador Script de BitVM es enorme y optimista; <strong>no lo ejecutamos</strong>{" "}
            en esta demo. Ver <code>circuits/README.md</code>.
          </li>
        </ul>
        <Callout title="Honestidad ante el jurado" tone="ok">
          No fingimos verificación Groth16 en L1. El impacto de ZK aquí es de producto: la
          reputación deja de ser un grafo público. El circuito existe y está recortado a la
          interfaz de BitVM para el día en que ese verificador sea usable — no para teatro.
        </Callout>
        <p>
          <Link href="/docs/zk" className="font-semibold text-brand">
            {t.docs.zkPage} — figuras, BitVM y verificación en vivo →
          </Link>
        </p>

        <h2>Lo que no es dinero</h2>
        <p>
          Tokens Cashu e invoices Lightning en este fork son anti-spam / señal. Nunca ponen
          precio a una bici ni igualan un trueque. Así el producto sigue siendo trueque, no un
          transmisor de dinero.
        </p>

        <p>
          <Link href="/docs" className="font-semibold text-brand">
            ← {t.docs.welcome}
          </Link>
        </p>
      </article>
    );
  }

  return (
    <article className="docs-prose max-w-3xl">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand">BOSS Battle</p>
      <h1 className="font-display text-4xl">{t.docs.cypherpunk}</h1>
      <p className="text-lg leading-7 text-mute">{t.tagline}</p>

      <h2>The thesis (why this wins the track)</h2>
      <p>
        Bitcoin’s ledger is a permanent dossier. Most privacy tools still assume you are{" "}
        <strong>paying</strong>, then hide the payment (mixers, CoinJoin, wallet hygiene).
        MeCuadra does something else: everyday barter <strong>does not create the payment</strong>.
        There is no on-chain tx for the swap. The line for the video:{" "}
        <em>no payment trail because there is no payment</em>.
      </p>
      <Callout title="Cypherpunk">
        The easy path is already the private path: a key instead of SMS, chat the operator cannot
        read, reputation without a sellable graph of who swapped with whom.
      </Callout>
      <Callout title="Freedom Stack">
        The same secp256k1 key is a Nostr npub. Offers go to relays (kind 31112). Chat is NIP-44.
        Cashu anti-spam. No intermediary who can revoke access or read the thread.
      </Callout>

      <h2>Worked example — Lisbon, a Saturday</h2>
      <p>
        Ana has a folding bike she no longer uses. She wants a 35mm film camera. She does not want
        a euro price or a sats price. She wants a swap.
      </p>
      <Steps
        items={[
          {
            title: "She signs in with a Bitcoin key",
            text: "She taps “Create a new key”. The browser derives nsec/npub (secp256k1, the same curve as Bitcoin). She writes the nsec on paper. MeCuadra never sees it. Her account is the npub.",
          },
          {
            title: "She publishes with no KYC and no price",
            text: "She mints a Cashu stamp (anti-spam, not the price of the bike). Offer: folding bike ↔ 35mm camera, city Lisbon. The offer can also hit Nostr relays (kind 31112).",
          },
          {
            title: "Bruno applies",
            text: "Bruno, in Porto, sees the offer. He taps MeCuadra and proposes his Olympus. There is no Lightning “to make up the difference”.",
          },
          {
            title: "They talk encrypted",
            text: "Chat is NIP-44. They pick a café near Cais do Sodré. The server only stores ciphertext. A MeCuadra operator cannot read the meeting point.",
          },
          {
            title: "They meet, confirm, rate",
            text: "Each marks delivered. They rate 5 stars. The profile can show a ZK badge: “enough good swaps” without publishing that Ana traded with Bruno.",
          },
        ]}
      />
      <p>
        If Ana had <em>sold</em> the bike for sats, the ledger would keep a clusterable payment
        forever. Here there is no payment. The trail that used to live in the app (phone, readable
        chat, rating graph) is what this fork turns off by default.
      </p>

      <h2>What actually uses Bitcoin — and what does not</h2>
      <ul>
        <li>
          <strong>Yes:</strong> secp256k1 identity, Silent Payment-style codes (BIP-352), Cashu /
          Lightning mint anti-spam, Nostr events, client-side ZK reputation proofs.
        </li>
        <li>
          <strong>No:</strong> no on-chain or Lightning settlement for the goods. The swap closes
          in person.
        </li>
      </ul>

      <h2>Does ZK make the product stronger? Yes — if we stay honest</h2>
      <p>
        Without ZK, a “private” marketplace still publishes a graph: Ana rated Bruno, Bruno rated
        Carla. That sells and clusters like a payment history. The ZK badge is{" "}
        <strong>trust without a dossier</strong>: you prove enough good ratings, not who you met
        or the exact stars.
      </p>
      <p>Two layers, said out loud:</p>
      <ul>
        <li>
          <strong>What the app runs:</strong> Pedersen + OR range proofs in the client (
          <code>src/lib/zk/reputation.ts</code>). The profile checks the badge in the browser.
          Bitcoin Script does <em>not</em> check this.
        </li>
        <li>
          <strong>The SNARK path:</strong> <code>circuits/reputation.circom</code> follows{" "}
          <a href="https://github.com/BitVM/bitvm-circom-example">BitVM/bitvm-circom-example</a>:
          Circom → witness → <strong>fflonk</strong> → two public outputs (SHA256 split). BitVM’s
          Script verifier is huge and optimistic; <strong>we do not run it</strong> in this demo.
          See <code>circuits/README.md</code>.
        </li>
      </ul>
      <Callout title="Honesty for judges" tone="ok">
        We do not fake L1 Groth16 verify. ZK’s impact here is product: reputation stops being a
        public graph. The circuit is real and cut to BitVM’s interface for the day that verifier
        is usable — not for theater.
      </Callout>
      <p>
        <Link href="/docs/zk" className="font-semibold text-brand">
          {t.docs.zkPage} — figures, BitVM, and live verification →
        </Link>
      </p>

      <h2>What is not money</h2>
      <p>
        Cashu tokens and Lightning invoices in this fork are anti-spam / signaling. They never
        price a bicycle or equalize a swap. That keeps the product a trueque, not a money
        transmitter.
      </p>

      <p>
        <Link href="/docs" className="font-semibold text-brand">
          ← {t.docs.welcome}
        </Link>
      </p>
    </article>
  );
}
