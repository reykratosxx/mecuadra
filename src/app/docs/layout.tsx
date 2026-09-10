import { DocsShell } from "@/components/docs/DocsShell";

export const metadata = {
  title: { default: "Docs", template: "%s · MeCuadra Docs" },
};

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return <DocsShell>{children}</DocsShell>;
}
