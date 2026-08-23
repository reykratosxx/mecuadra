"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./Logo";
import { IconBell, IconPlus, IconSearch } from "./icons";
import { Avatar } from "./ui";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const links = [
  { href: "/explorar", label: "Explorar" },
  { href: "/trueques", label: "Trueques" },
  { href: "/docs", label: "Docs" },
];

export function Header() {
  const path = usePathname();
  const { currentUser, notifications } = useStore();
  const unread = notifications.filter(
    (n) => n.userId === currentUser?.id && !n.read,
  ).length;

  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4">
        <Logo withWord size={34} />
        <nav className="ml-4 hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "rounded-full px-3 py-1.5 text-sm font-medium transition",
                path.startsWith(l.href)
                  ? "bg-brand-50 text-brand"
                  : "text-mute hover:bg-stone-50 hover:text-ink",
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <Link
            href="/explorar"
            className="hidden h-10 w-10 items-center justify-center rounded-full text-mute hover:bg-stone-50 md:flex"
            aria-label="Buscar"
          >
            <IconSearch className="h-5 w-5" />
          </Link>
          <Link
            href="/notificaciones"
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-mute hover:bg-stone-50"
            aria-label="Notificaciones"
          >
            <IconBell className="h-5 w-5" />
            {unread > 0 ? (
              <span className="absolute right-1.5 top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
                {unread}
              </span>
            ) : null}
          </Link>
          <Link href="/publicar" className="btn-primary hidden sm:inline-flex">
            <IconPlus className="h-4 w-4" />
            Publicar
          </Link>
          {currentUser ? (
            <Link href="/perfil" className="flex items-center gap-2 rounded-full p-0.5 hover:bg-stone-50">
              <Avatar src={currentUser.avatar} name={currentUser.name} size={36} />
            </Link>
          ) : (
            <Link href="/login" className="btn-ghost">
              Telegram
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
