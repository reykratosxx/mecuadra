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
  const { currentUser, trades } = useStore();
  const pending = trades.filter(
    (t) =>
      currentUser &&
      t.ownerId === currentUser.id &&
      t.status === "pendiente",
  ).length;

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
      <ul className="mx-auto grid max-w-lg grid-cols-5 px-1 py-1">
        {items.map((item) => {
          const active = path.startsWith(item.href);
          const Icon = item.icon;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "relative flex flex-col items-center gap-0.5 py-2 text-[11px] font-medium",
                  active ? "text-brand" : "text-mute",
                )}
              >
                {item.center ? (
                  <span className="grid h-11 w-11 -mt-4 place-items-center rounded-2xl bg-[image:var(--grad)] text-white shadow-lg shadow-brand/30">
                    <Icon className="h-5 w-5" />
                  </span>
                ) : (
                  <span className="relative">
                    <Icon className="h-5 w-5" />
                    {item.badgeKey === "trades" && pending > 0 ? (
                      <span className="absolute -right-2 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-rose-500 px-1 text-[9px] text-white">
                        {pending}
                      </span>
                    ) : null}
                  </span>
                )}
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
