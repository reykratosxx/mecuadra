"use client";

import Link from "next/link";
import { Logo } from "./Logo";
import { COMMUNITY_TELEGRAM, SUPPORT_TELEGRAM } from "@/lib/support";
import { useT } from "@/lib/i18n/provider";

export function Footer() {
  const t = useT();
  return (
    <footer className="mt-16 border-t border-line bg-surface pb-24 md:pb-0">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-4">
        <div className="sm:col-span-2">
          <Logo withWord />
          <p className="mt-3 max-w-sm text-sm leading-6 text-mute">{t.footer.blurb}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-mute">{t.footer.product}</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link href="/explorar" className="hover:text-brand">
                {t.footer.explore}
              </Link>
            </li>
            <li>
              <Link href="/publicar" className="hover:text-brand">
                {t.footer.publish}
              </Link>
            </li>
            <li>
              <Link href="/docs" className="hover:text-brand">
                {t.footer.docs}
              </Link>
            </li>
            <li>
              <Link href="/docs/cypherpunk" className="hover:text-brand">
                Cypherpunk
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-mute">{t.footer.support}</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <a href={SUPPORT_TELEGRAM} target="_blank" rel="noopener noreferrer" className="hover:text-brand">
                {t.footer.contact}
              </a>
            </li>
            <li>
              <a href={COMMUNITY_TELEGRAM} target="_blank" rel="noopener noreferrer" className="hover:text-brand">
                {t.footer.community}
              </a>
            </li>
            <li className="text-mute">{t.footer.hints}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line py-4 text-center text-xs text-mute">{t.footer.copy}</div>
    </footer>
  );
}
