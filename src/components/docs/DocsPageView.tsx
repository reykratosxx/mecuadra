"use client";

import Link from "next/link";
import { Callout, CodeBlock, DocHero, Steps } from "@/components/docs/widgets";

export type DocsBlock =
  | { type: "h2"; text: string }
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "steps"; items: { title: string; text: string }[] }
  | { type: "callout"; title: string; body: string; tone?: "brand" | "ok" | "warn" }
  | { type: "code"; label: string; code: string }
  | { type: "flow"; items: { n: string; title: string; text: string }[] }
  | { type: "cards"; items: { href: string; kicker: string; title: string; hint: string }[] }
  | { type: "hint"; text: string };

export type DocsCopy = {
  kicker: string;
  title: string;
  lead: string;
  blocks: DocsBlock[];
};

function Inline({ text }: { text: string }) {
  const chunks = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return (
    <>
      {chunks.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={i}>{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith("`") && part.endsWith("`")) {
          return <code key={i}>{part.slice(1, -1)}</code>;
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

export function DocsPageView({ copy }: { copy: DocsCopy }) {
  return (
    <article className="docs-prose max-w-3xl">
      <DocHero kicker={copy.kicker} title={copy.title} lead={copy.lead} />
      {copy.blocks.map((block, i) => {
        if (block.type === "h2") return <h2 key={i}>{block.text}</h2>;
        if (block.type === "p")
          return (
            <p key={i}>
              <Inline text={block.text} />
            </p>
          );
        if (block.type === "ul")
          return (
            <ul key={i}>
              {block.items.map((item) => (
                <li key={item}>
                  <Inline text={item} />
                </li>
              ))}
            </ul>
          );
        if (block.type === "steps") return <Steps key={i} items={block.items} />;
        if (block.type === "callout")
          return (
            <Callout key={i} title={block.title} tone={block.tone}>
              <Inline text={block.body} />
            </Callout>
          );
        if (block.type === "code") return <CodeBlock key={i} label={block.label} code={block.code} />;
        if (block.type === "flow")
          return (
            <div key={i} className="docs-flow">
              {block.items.map((item) => (
                <article key={item.n}>
                  <span className="docs-hex !h-8 !w-8 !text-[10px]">{item.n}</span>
                  <strong className="mt-2">{item.title}</strong>
                  <span>{item.text}</span>
                </article>
              ))}
            </div>
          );
        if (block.type === "cards")
          return (
            <div key={i} className="mt-6 grid gap-3 sm:grid-cols-2">
              {block.items.map((card) => (
                <Link key={card.href} href={card.href} className="card block p-5 hover:border-brand/30">
                  <p className="text-xs font-semibold uppercase tracking-wider text-brand">{card.kicker}</p>
                  <p className="mt-1 font-display text-xl">{card.title}</p>
                  <p className="mt-1 text-sm text-mute">{card.hint}</p>
                </Link>
              ))}
            </div>
          );
        return (
          <p key={i} className="text-sm text-mute">
            <Inline text={block.text} />
          </p>
        );
      })}
    </article>
  );
}
