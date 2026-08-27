export function buildOfferShare(input: {
  origin: string;
  offerId: string;
  offered: string[];
  wants: string[];
  place: string;
  transport?: string;
}) {
  const url = `${input.origin}/oferta/${input.offerId}`;
  const bodyLines = [
    "MeCuadra · trueque",
    `#cambio ${input.offered.join(" · ") || "ver oferta"}`,
    `#necesito ${input.wants.join(" · ") || "escucho propuestas"}`,
    `#municipio ${input.place}`,
    input.transport ? input.transport : "",
  ].filter(Boolean);

  /** Texto sin URL (WhatsApp/Telegram body). */
  const body = bodyLines.join("\n");
  /** Texto completo con el enlace al final. */
  const text = `${body}\n${url}`;

  return {
    url,
    text,
    title: "Trueque en MeCuadra",
    whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`,
    // Solo `text` con el enlace al final: si también pasas `url`, Telegram lo repite arriba.
    telegram: `https://t.me/share/url?text=${encodeURIComponent(text)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  };
}
