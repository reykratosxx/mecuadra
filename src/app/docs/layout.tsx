import { DocsShell } from "@/components/docs/DocsShell";

export const metadata = {
  title: { default: "Documentación", template: "%s · Docs MeCuadra" },
};

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return <DocsShell>{children}</DocsShell>;
}
