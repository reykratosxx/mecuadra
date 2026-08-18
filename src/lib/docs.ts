export type DocLink = { href: string; title: string; hint: string };

export const DOC_GROUPS: { title: string; items: DocLink[] }[] = [
  {
    title: "Empieza aquí",
    items: [
      { href: "/docs", title: "Bienvenida", hint: "Qué es MeCuadra y para quién" },
      { href: "/docs/trueque", title: "El trueque en 5 toques", hint: "El ciclo completo, dibujado" },
    ],
  },
  {
    title: "Usar la app",
    items: [
      { href: "/docs/cuenta", title: "Cuenta y códigos", hint: "Google, correo, SMS y cerrar sesión" },
      { href: "/docs/ofertas", title: "Artículos y ofertas", hint: "#cambio #necesito #municipio" },
      { href: "/docs/aplicar", title: "El botón MeCuadra", hint: "Cómo aplicar a un trueque" },
      { href: "/docs/chat", title: "Chat", hint: "Solo ustedes dos, cifrado" },
      { href: "/docs/reputacion", title: "Trueques y reputación", hint: "Aceptar, entregar, valorar" },
    ],
  },
  {
    title: "Construir",
    items: [
      { href: "/docs/api", title: "API", hint: "Auth, mensajes, tiempo real" },
      { href: "/docs/seguridad", title: "Seguridad", hint: "RLS, cifrado, teléfono" },
      { href: "/docs/desplegar", title: "Desplegar", hint: "Supabase, Vercel, variables" },
    ],
  },
];

export const DOC_SEARCH = DOC_GROUPS.flatMap((g) =>
  g.items.map((item) => ({ ...item, group: g.title })),
);

export function flattenDocs() {
  return DOC_SEARCH;
}
