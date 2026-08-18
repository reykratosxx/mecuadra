"use client";

import { Header } from "./Header";
import { Footer } from "./Footer";
import { BottomNav } from "./BottomNav";

export function AppShell({
  children,
  bare,
}: {
  children: React.ReactNode;
  bare?: boolean;
}) {
  if (bare) return <>{children}</>;
  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">{children}</main>
      <Footer />
      <BottomNav />
    </>
  );
}
