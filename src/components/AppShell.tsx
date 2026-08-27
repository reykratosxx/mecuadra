"use client";

import { usePathname } from "next/navigation";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { BottomNav } from "./BottomNav";
import { SupportMenu } from "./SupportMenu";

export function AppShell({
  children,
  bare,
}: {
  children: React.ReactNode;
  bare?: boolean;
}) {
  const path = usePathname();
  if (bare || path.startsWith("/docs")) return <>{children}</>;
  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">{children}</main>
      <Footer />
      <SupportMenu />
      <BottomNav />
    </>
  );
}
