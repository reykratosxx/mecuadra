"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
} from "react";
import { DEFAULT_LOCALE, LOCALE_COOKIE, type Locale } from "./types";
import { getMessages, type Messages } from "./dictionaries";

const listeners = new Set<() => void>();

function notify() {
  for (const listener of listeners) listener();
}

function readCookie(): Locale | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${LOCALE_COOKIE}=(en|es)`));
  return match ? (match[1] as Locale) : null;
}

function readStored(): Locale {
  const fromCookie = readCookie();
  if (fromCookie) return fromCookie;
  try {
    const fromLs = localStorage.getItem(LOCALE_COOKIE);
    if (fromLs === "en" || fromLs === "es") return fromLs;
  } catch {
    /* private mode */
  }
  return DEFAULT_LOCALE;
}

function applyLocale(locale: Locale) {
  document.documentElement.lang = locale;
  try {
    localStorage.setItem(LOCALE_COOKIE, locale);
  } catch {
    /* ignore */
  }
  document.cookie = `${LOCALE_COOKIE}=${locale};path=/;max-age=31536000;samesite=lax`;
  notify();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (event: StorageEvent) => {
    if (event.key === LOCALE_COOKIE) notify();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function getSnapshot(): Locale {
  return readStored();
}

type I18nValue = {
  locale: Locale;
  t: Messages;
  setLocale: (locale: Locale) => void;
  toggle: () => void;
};

const Ctx = createContext<I18nValue | null>(null);

export function I18nProvider({
  children,
  initialLocale = DEFAULT_LOCALE,
}: {
  children: React.ReactNode;
  initialLocale?: Locale;
}) {
  const getServerSnapshot = useCallback(() => initialLocale, [initialLocale]);
  const locale = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const t = useMemo(() => getMessages(locale), [locale]);

  const setLocale = useCallback((next: Locale) => {
    applyLocale(next);
  }, []);

  const value = useMemo(
    () => ({
      locale,
      t,
      setLocale,
      toggle: () => setLocale(locale === "en" ? "es" : "en"),
    }),
    [locale, t, setLocale],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useI18n() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}

export function useT() {
  return useI18n().t;
}
