export function buildOfferShare(input: {
  origin: string;
  offerId: string;
  offered: string[];
  wants: string[];
  place: string;
  transport?: string;
}) {
  const url = `${input.origin}/oferta/${input.offerId}`;
  const lines = [
    "MeCuadra · trueque",
    `#cambio ${input.offered.join(" · ") || "ver oferta"}`,
    `#necesito ${input.wants.join(" · ") || "escucho propuestas"}`,
    `#municipio ${input.place}`,
    input.transport ? input.transport : "",
    url,
  ].filter(Boolean);
  const text = lines.join("\n");
  return {
    url,
    text,
    title: "Trueque en MeCuadra",
    whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`,
    telegram: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  };
}
