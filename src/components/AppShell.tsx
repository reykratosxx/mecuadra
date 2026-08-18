"use client";

import Link from "next/link";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { BottomNav } from "./BottomNav";
import { useStore } from "@/lib/store";

export function AppShell({
  children,
  bare,
}: {
  children: React.ReactNode;
  bare?: boolean;
}) {
  const { needsPhone, currentUser } = useStore();
  if (bare) return <>{children}</>;
  return (
    <>
      <Header />
      {currentUser && needsPhone ? (
        <div className="bg-brand text-center text-sm text-white">
          <Link href="/login?paso=telefono" className="block px-4 py-2 font-medium">
            Verifica tu teléfono para publicar y aplicar a ofertas
          </Link>
        </div>
      ) : null}
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">{children}</main>
      <Footer />
      <BottomNav />
    </>
  );
}
