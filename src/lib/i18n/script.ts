"use client";

import { useEffect } from "react";
import { DEFAULT_LOCALE, LOCALE_COOKIE } from "@/lib/i18n/types";

/** Sets <html lang> before paint when a cookie/localStorage value exists. */
export const localeInitScript = `(function(){try{var k=${JSON.stringify(LOCALE_COOKIE)};var v=localStorage.getItem(k);if(v!=='en'&&v!=='es'){var m=document.cookie.match(/(?:^|; )${LOCALE_COOKIE}=(en|es)/);v=m?m[1]:${JSON.stringify(DEFAULT_LOCALE)};}document.documentElement.lang=v;}catch(e){document.documentElement.lang=${JSON.stringify(DEFAULT_LOCALE)};}})();`;

export function LocaleHtmlSync() {
  useEffect(() => {
    const stored = (() => {
      try {
        const v = localStorage.getItem(LOCALE_COOKIE);
        if (v === "en" || v === "es") return v;
      } catch {
        /* ignore */
      }
      return DEFAULT_LOCALE;
    })();
    if (document.documentElement.lang !== stored) {
      document.documentElement.lang = stored;
    }
  }, []);
  return null;
}
