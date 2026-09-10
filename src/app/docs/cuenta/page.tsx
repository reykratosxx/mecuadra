"use client";

import { DocsPageView } from "@/components/docs/DocsPageView";
import { useI18n } from "@/lib/i18n/provider";
import { docsCopy } from "@/lib/i18n/docs-pages";

export default function Page() {
  const { locale } = useI18n();
  return <DocsPageView copy={docsCopy("cuenta", locale)} />;
}
