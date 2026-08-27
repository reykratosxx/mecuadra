"use client";

import { useState } from "react";
import { buildOfferShare } from "@/lib/share";
import type { Offer } from "@/lib/types";
import { TRANSPORT_LABEL } from "@/lib/cuba";

export function ShareOffer({
  offer,
  offeredTitles,
}: {
  offer: Offer;
  offeredTitles: string[];
}) {
  const [copied, setCopied] = useState(false);

  function pack() {
    const place = [offer.neighborhood, offer.municipality, offer.province].filter(Boolean).join(", ");
    return buildOfferShare({
      origin: window.location.origin,
      offerId: offer.id,
      offered: offeredTitles,
      wants: offer.wants.map((w) => w.title),
      place,
      transport: TRANSPORT_LABEL[offer.transport],
    });
  }

  function open(kind: "telegram" | "whatsapp" | "facebook") {
    window.open(pack()[kind], "_blank", "noopener,noreferrer,width=640,height=720");
  }

  async function nativeShare() {
    const current = pack();
    if (navigator.share) {
      try {
        await navigator.share({ title: current.title, text: current.text, url: current.url });
      } catch {
        /* canceló */
      }
      return;
    }
    await copy();
  }

  async function copy() {
    await navigator.clipboard.writeText(pack().text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div className="card p-4">
      <p className="font-display text-base">Compartir en grupos</p>
      <p className="mt-1 text-xs leading-5 text-mute">
        Se abre Telegram, WhatsApp o Facebook y tú eliges el grupo — el de Intercambio y
        Trueque, el del barrio, o un chat.
      </p>
      <div className="mt-3 grid grid-cols-3 gap-2">
        <button type="button" className="share-btn" onClick={() => open("telegram")}>
          <TelegramIcon />
          Telegram
        </button>
        <button type="button" className="share-btn" onClick={() => open("whatsapp")}>
          <WhatsAppIcon />
          WhatsApp
        </button>
        <button type="button" className="share-btn" onClick={() => open("facebook")}>
          <FacebookIcon />
          Facebook
        </button>
      </div>
      <div className="mt-2 grid grid-cols-2 gap-2">
        <button type="button" className="btn-ghost !py-2 text-xs" onClick={() => void nativeShare()}>
          Más apps
        </button>
        <button type="button" className="btn-ghost !py-2 text-xs" onClick={() => void copy()}>
          {copied ? "Copiado" : "Copiar texto"}
        </button>
      </div>
    </div>
  );
}

function TelegramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="#229ED9">
      <path d="M21.5 4.4 3.7 11.2c-1.2.5-1.2 1.2-.2 1.5l4.6 1.4 10.6-6.7c.5-.3 1-.1.6.2l-8.6 7.8-.3 4.6c.5 0 .7-.2 1-.5l2.3-2.2 4.8 3.5c.9.5 1.5.2 1.7-.8l3.1-14.6c.3-1.2-.5-1.8-1.4-1.4Z" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="#25D366">
      <path d="M12.04 2C6.58 2 2.15 6.4 2.15 11.83c0 1.74.46 3.44 1.33 4.94L2 22l5.4-1.41a10 10 0 0 0 4.64 1.18h.01c5.46 0 9.89-4.4 9.89-9.83C21.94 6.4 17.5 2 12.04 2Zm5.76 14.13c-.24.67-1.4 1.24-1.94 1.32-.5.07-1.12.1-1.81-.11-.42-.13-.95-.31-1.64-.6-2.88-1.24-4.76-4.14-4.9-4.33-.14-.2-1.15-1.53-1.15-2.92 0-1.39.73-2.07.99-2.36.26-.28.57-.35.76-.35h.54c.17 0 .4-.06.63.48.24.56.8 1.94.87 2.08.07.14.12.3.02.49-.1.2-.14.32-.28.49-.14.17-.3.38-.42.51-.14.14-.29.3-.12.58.16.28.73 1.2 1.56 1.95 1.08.96 1.98 1.26 2.26 1.4.28.14.45.12.61-.07.17-.2.7-.81.89-1.09.19-.28.37-.23.63-.14.26.1 1.64.77 1.92.91.28.14.47.21.54.33.07.12.07.7-.17 1.37Z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="#1877F2">
      <path d="M14.5 8.5V6.7c0-.7.5-1.1 1.2-1.1h1.3V3h-2.3C12.2 3 11 4.5 11 6.6v1.9H9v2.7h2V21h3.2v-9.8h2.2l.3-2.7h-2.2Z" />
    </svg>
  );
}
