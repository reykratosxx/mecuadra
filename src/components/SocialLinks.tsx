import { SOCIAL_LINKS } from "@/lib/support";
import { IconBrandX, IconFacebook, IconTelegram } from "./icons";
import { cn } from "@/lib/utils";

const ICONS = {
  telegram: IconTelegram,
  x: IconBrandX,
  facebook: IconFacebook,
} as const;

export function SocialLinks({
  className,
  compact,
}: {
  className?: string;
  compact?: boolean;
}) {
  return (
    <nav aria-label="Social" className={cn("flex flex-wrap items-center gap-2", className)}>
      {SOCIAL_LINKS.map(({ id, href, label }) => {
        const Icon = ICONS[id];
        return (
          <a
            key={id}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-sm font-medium text-ink transition hover:border-brand/40 hover:text-brand",
              compact ? "px-2.5 py-1 text-xs" : "",
            )}
          >
            <Icon className={compact ? "h-3.5 w-3.5" : "h-4 w-4"} />
            {label}
          </a>
        );
      })}
    </nav>
  );
}
