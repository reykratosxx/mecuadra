"use client";

import Link from "next/link";
import { useT } from "@/lib/i18n/provider";
import { Callout } from "@/components/docs/widgets";
import { ZkFigures } from "@/components/docs/ZkFigures";
import { ZkPlayground } from "@/components/ZkPlayground";

export default function ZkDocsPage() {
  const t = useT();
  const en = t.langName === "English";

  if (!en) {
    return (
      <article className="docs-prose max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand">Zero-knowledge</p>
        <h1 className="font-display text-4xl">{t.docs.zkPage}</h1>
        <p className="text-lg leading-7 text-mute">
          ZK en MeCuadra no sustituye la clave Bitcoin. Evita que esa clave se convierta en un
          boletín de “quién truequeó con quién”.
        </p>
        <h2>El trabajo concreto</h2>
        <p>
          En apps P2P de dinero las estrellas 1–5 públicas <strong>son</strong> la
          confianza. Aquí el trueque ya no deja pago en Bitcoin. Si además publicamos Ana★Bruno,
          reconstruimos el dossier con tinta de reputación. El badge ZK dice: “esta clave tiene
          suficientes trueques buenos” sin la lista de invitados.
        </p>
        <Callout title="Identidad">
          El npub es quién eres para chatear. El nullifier ZK es la misma persona demostrando
          confianza, sin colgar el grafo social en el perfil.
        </Callout>
        <ZkFigures />
        <ZkPlayground />
        <h2>Qué verifica este navegador</h2>
        <p>
          Compromisos Pedersen + pruebas de rango (OR) en <code>src/lib/zk/reputation.ts</code>.
          Cualquier visitante del perfil vuelve a correr esa cuenta. No ve a Bruno ni las
          estrellas exactas.
        </p>
        <h2>Qué es BitVM aquí</h2>
        <p>
          El ejemplo oficial{" "}
          <a href="https://github.com/BitVM/bitvm-circom-example">BitVM/bitvm-circom-example</a>{" "}
          compila Circom y prueba con <strong>fflonk</strong>, con <strong>dos</strong> salidas
          públicas SHA256. Nuestro <code>circuits/reputation.circom</code> copia esa interfaz. No
          ejecutamos el verificador Script (enorme, optimista). No fingimos Groth16 en L1.
        </p>
        <p>
          <Link href="/docs/cypherpunk" className="font-semibold text-brand">
            ← {t.docs.cypherpunk}
          </Link>
        </p>
      </article>
    );
  }

  return (
    <article className="docs-prose max-w-3xl">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand">Zero-knowledge</p>
      <h1 className="font-display text-4xl">{t.docs.zkPage}</h1>
      <p className="text-lg leading-7 text-mute">
        ZK in MeCuadra does not replace the Bitcoin key. It stops that key from becoming a
        bulletin of who swapped with whom.
      </p>
      <h2>The actual job</h2>
      <p>
        On P2P cash apps, public 1–5 stars <strong>are</strong> the trust. Here the
        swap already leaves no Bitcoin payment. If we also publish Ana★Bruno, we rebuild the
        dossier in reputation ink. The ZK badge says: “this key has enough good swaps” without
        the guest list.
      </p>
      <Callout title="Identity">
        The npub is who you are to chat. The ZK nullifier is the same person proving trust,
        without hanging the social graph on the profile.
      </Callout>
      <ZkFigures />
      <ZkPlayground />
      <h2>What this browser verifies</h2>
      <p>
        Pedersen commitments + OR range proofs in <code>src/lib/zk/reputation.ts</code>. Anyone
        who opens the profile re-runs that check. They do not see Bruno or the exact stars.
      </p>
      <h2>What BitVM is here</h2>
      <p>
        The official example{" "}
        <a href="https://github.com/BitVM/bitvm-circom-example">BitVM/bitvm-circom-example</a>{" "}
        compiles Circom and proves with <strong>fflonk</strong>, with <strong>two</strong> public
        SHA256 outputs. Our <code>circuits/reputation.circom</code> copies that interface. We do
        not run the Script verifier (huge, optimistic). We do not fake Groth16 on L1.
      </p>
      <p>
        <Link href="/docs/cypherpunk" className="font-semibold text-brand">
          ← {t.docs.cypherpunk}
        </Link>
      </p>
    </article>
  );
}
