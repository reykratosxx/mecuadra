"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconArrows, IconPlus, IconSearch, IconTag, IconUser } from "./icons";
import { cn } from "@/lib/utils";
import { useStore } from "@/lib/store";

const items = [
  { href: "/explorar", label: "Explorar", icon: IconSearch },
  { href: "/trueques", label: "Trueques", icon: IconArrows, badgeKey: "trades" as const },
  { href: "/publicar", label: "Publicar", icon: IconPlus, center: true },
  { href: "/articulos", label: "Artículos", icon: IconTag },
  { href: "/perfil", label: "Perfil", icon: IconUser },
];

export function BottomNav() {
  const path = usePathname();
  const { currentUser, trades, ready } = useStore();
  const pending =
    ready && currentUser
      ? trades.filter((t) => t.ownerId === currentUser.id && t.status === "pendiente").length
      : 0;

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
      <ul className="mx-auto grid max-w-lg grid-cols-5 items-center px-1 pt-1.5">
        {items.map((item) => {
          const active = path.startsWith(item.href);
          const Icon = item.icon;
          return (
            <li key={item.href} className="relative flex justify-center">
              <Link
                href={item.href}
                className={cn(
                  "relative flex w-full flex-col items-center gap-0.5 py-1.5 text-[10px] font-medium",
                  active ? "text-brand" : "text-mute",
                )}
              >
                {item.center ? (
                  <span className="relative z-20 -mt-5 grid h-12 w-12 place-items-center rounded-2xl bg-[image:var(--grad)] text-white shadow-lg shadow-brand/30 ring-4 ring-surface">
                    <Icon className="h-5 w-5" />
                  </span>
                ) : (
                  <span className="relative z-0 grid h-6 w-6 place-items-center">
                    <Icon className="h-5 w-5" />
                    {item.badgeKey === "trades" && pending > 0 ? (
                      <span className="absolute -right-2 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-rose-500 px-1 text-[9px] text-white">
                        {pending}
                      </span>
                    ) : null}
                  </span>
                )}
                <span className={cn(item.center ? "mt-0.5" : "", "leading-none")}>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
