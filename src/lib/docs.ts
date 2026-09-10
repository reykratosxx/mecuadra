import type { Messages } from "@/lib/i18n/dictionaries";

export type DocLink = { href: string; title: string; hint: string };

export function getDocGroups(t: Messages): { title: string; items: DocLink[] }[] {
  return [
    {
      title: t.docs.start,
      items: [
        { href: "/docs", title: t.docs.welcome, hint: t.docs.welcomeHint },
        { href: "/docs/trueque", title: t.docs.cycle, hint: t.docs.cycleHint },
      ],
    },
    {
      title: t.docs.use,
      items: [
        { href: "/docs/cuenta", title: t.docs.account, hint: t.docs.accountHint },
        { href: "/docs/ofertas", title: t.docs.offers, hint: t.docs.offersHint },
        { href: "/docs/aplicar", title: t.docs.apply, hint: t.docs.applyHint },
        { href: "/docs/chat", title: t.docs.chat, hint: t.docs.chatHint },
        { href: "/docs/reputacion", title: t.docs.reputation, hint: t.docs.reputationHint },
      ],
    },
    {
      title: t.docs.build,
      items: [
        { href: "/docs/api", title: t.docs.api, hint: t.docs.apiHint },
        { href: "/docs/seguridad", title: t.docs.security, hint: t.docs.securityHint },
        { href: "/docs/cypherpunk", title: t.docs.cypherpunk, hint: t.docs.cypherpunkHint },
        { href: "/docs/zk", title: t.docs.zkPage, hint: t.docs.zkPageHint },
        { href: "/docs/desplegar", title: t.docs.deploy, hint: t.docs.deployHint },
      ],
    },
  ];
}

export function flattenDocs(t: Messages) {
  return getDocGroups(t).flatMap((g) => g.items.map((item) => ({ ...item, group: g.title })));
}
