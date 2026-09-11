import type { Metadata, Viewport } from "next";
import { cookies } from "next/headers";
import { Outfit, Source_Sans_3, Source_Serif_4 } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { AppShell } from "@/components/AppShell";
import { themeInitScript } from "@/lib/theme-script";
import { localeInitScript } from "@/lib/i18n/script";
import { DEFAULT_LOCALE, LOCALE_COOKIE, type Locale } from "@/lib/i18n/types";

const sans = Source_Sans_3({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const display = Outfit({
  variable: "--font-head",
  subsets: ["latin"],
  display: "swap",
});

const serif = Source_Serif_4({
  variable: "--font-accent",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "MeCuadra · Private P2P barter",
    template: "%s · MeCuadra",
  },
  description:
    "Global barter marketplace. Bitcoin/Nostr keys, NIP-44 chat, ZK reputation. No prices, no payment trail.",
  applicationName: "MeCuadra",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#7c3aed" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1228" },
  ],
  width: "device-width",
  initialScale: 1,
};

function localeFromCookie(value: string | undefined): Locale {
  return value === "es" || value === "en" ? value : DEFAULT_LOCALE;
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const cookieStore = await cookies();
  const locale = localeFromCookie(cookieStore.get(LOCALE_COOKIE)?.value);

  return (
    <html
      lang={locale}
      className={`${sans.variable} ${display.variable} ${serif.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <script dangerouslySetInnerHTML={{ __html: localeInitScript }} />
      </head>
      <body className="flex min-h-full flex-col font-sans text-ink">
        <Providers initialLocale={locale}>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
