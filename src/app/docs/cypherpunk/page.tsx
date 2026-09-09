"use client";

import { useT } from "@/lib/i18n/provider";
import Link from "next/link";

export default function CypherpunkDocsPage() {
  const t = useT();
  const en = t.langName === "English";
  return (
    <article className="prose-docs mx-auto max-w-3xl space-y-6">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand">BOSS Battle</p>
      <h1 className="font-display text-4xl">{t.docs.cypherpunk}</h1>
      <p className="text-lg leading-7 text-mute">{t.tagline}</p>

      {en ? (
        <>
          <h2 className="font-display text-2xl">Cypherpunk track</h2>
          <p>
            Bitcoin’s ledger is public. Everyday exchange does not need to be. MeCuadra is barter — no
            prices, no sats for goods — plus Bitcoin/Nostr keys, Silent Payment-style contact codes,
            NIP-44 chat the operator cannot read, Cashu anti-spam instead of phone KYC, and a ZK
            reputation badge that does not publish your trade graph.
          </p>
          <h2 className="font-display text-2xl">Freedom Stack</h2>
          <p>
            The same secp256k1 key is a Nostr npub. Offers are also parameterized replaceable events
            (kind 31112) on public relays. Chat ciphertext is NIP-44. Telegram is optional legacy, not
            the gate.
          </p>
          <h2 className="font-display text-2xl">What is not money</h2>
          <p>
            Cashu tokens and Lightning invoices in this fork are anti-spam / signaling only. They never
            price a bicycle or equalize a swap. That keeps the product a trueque, not a money
            transmitter.
          </p>
          <h2 className="font-display text-2xl">ZK honesty</h2>
          <p>
            Daily verification is <strong>client-side</strong> (Pedersen commitments + range proofs), the RGB / zkCoins
            model: Bitcoin Script does not check the badge. The Circom circuit in{" "}
            <code>circuits/reputation.circom</code> follows{" "}
            <a href="https://github.com/BitVM/bitvm-circom-example">BitVM/bitvm-circom-example</a>: prove with{" "}
            <strong>fflonk</strong>, expose <strong>two</strong> public outputs (SHA256 split), same as their{" "}
            <code>test_circuit.circom</code>. Their Script verifier is optimistic and enormous; we do not pretend it
            runs here. See <code>circuits/README.md</code>.
          </p>
        </>
      ) : (
        <>
          <h2 className="font-display text-2xl">Track Cypherpunk</h2>
          <p>
            El ledger de Bitcoin es público. El intercambio cotidiano no tiene por qué serlo. MeCuadra
            es trueque — sin precios, sin sats por el bien — más claves Bitcoin/Nostr, códigos Silent
            Payment, chat NIP-44 que el operador no lee, anti-spam Cashu en lugar de KYC telefónico y
            un badge ZK que no publica tu grafo de trueques.
          </p>
          <h2 className="font-display text-2xl">Freedom Stack</h2>
          <p>
            La misma clave secp256k1 es un npub. Las ofertas también salen como eventos reemplazables
            (kind 31112) en relays. El chat es NIP-44. Telegram es legado opcional, no la puerta.
          </p>
          <h2 className="font-display text-2xl">ZK con honestidad</h2>
          <p>
            El badge diario es <strong>validación en cliente</strong> (Pedersen + range proofs). El circuito Circom
            sigue{" "}
            <a href="https://github.com/BitVM/bitvm-circom-example">BitVM/bitvm-circom-example</a>:{" "}
            <strong>fflonk</strong>, dos salidas públicas (SHA256 partido). No ejecutamos el verificador Script de
            BitVM en la app. Ver <code>circuits/README.md</code>.
          </p>
        </>
      )}

      <p>
        <Link href="/docs" className="font-semibold text-brand">
          ← {t.docs.welcome}
        </Link>
      </p>
    </article>
  );
}
