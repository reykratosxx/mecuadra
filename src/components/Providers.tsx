"use client";

import { StoreProvider } from "@/lib/store";
import { ThemeProvider } from "@/lib/theme";
import { I18nProvider } from "@/lib/i18n/provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <I18nProvider>
        <StoreProvider>{children}</StoreProvider>
      </I18nProvider>
    </ThemeProvider>
  );
}
