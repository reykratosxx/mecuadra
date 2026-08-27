"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./Logo";
import { IconBell, IconPlus } from "./icons";
import { Avatar } from "./ui";
import { ThemeToggle } from "./ThemeToggle";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const links = [
  { href: "/explorar", label: "Explorar" },
  { href: "/trueques", label: "Trueques" },
  { href: "/docs", label: "Docs" },
];

export function Header() {
  const path = usePathname();
  const { currentUser, notifications, ready } = useStore();
  const unread =
    ready && currentUser
      ? notifications.filter((n) => n.userId === currentUser.id && !n.read).length
      : 0;

  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-surface/90 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-2 px-3 sm:h-16 sm:gap-3 sm:px-4">
        <Logo withWord size={36} className="min-w-0" />

        <nav className="ml-1 hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "rounded-full px-3 py-1.5 text-sm font-medium transition",
                path.startsWith(l.href)
                  ? "bg-brand-50 text-brand"
                  : "text-mute hover:bg-hover hover:text-ink",
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-2">
          {currentUser ? (
            <Link
              href="/notificaciones"
              className="relative grid h-9 w-9 place-items-center rounded-full text-mute hover:bg-hover"
              aria-label="Notificaciones"
            >
              <IconBell className="h-5 w-5" />
              {unread > 0 ? (
                <span className="absolute right-0.5 top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
                  {unread > 9 ? "9+" : unread}
                </span>
              ) : null}
            </Link>
          ) : null}

          <ThemeToggle />

          <Link
            href="/publicar"
            className="btn-primary hidden h-9 gap-1 px-3 text-sm md:inline-flex"
          >
            <IconPlus className="h-4 w-4" />
            Publicar
          </Link>

          {currentUser ? (
            <Link href="/perfil" className="rounded-full p-0.5 hover:bg-hover" aria-label="Perfil">
              <Avatar src={currentUser.avatar} name={currentUser.name} size={32} />
            </Link>
          ) : (
            <Link
              href="/login"
              className="inline-flex h-9 items-center rounded-full border border-line bg-surface px-3 text-sm font-semibold text-ink hover:bg-brand-50"
            >
              Entrar
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
