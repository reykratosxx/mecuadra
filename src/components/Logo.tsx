import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({
  size = 36,
  withWord = false,
  className,
  wordClassName,
}: {
  size?: number;
  withWord?: boolean;
  className?: string;
  wordClassName?: string;
}) {
  return (
    <Link href="/" className={cn("flex items-center gap-2", className)}>
      <Image
        src="/logo.png"
        alt="MeCuadra"
        width={size}
        height={size}
        className="shrink-0 drop-shadow-sm"
        priority
      />
      {withWord ? (
        <span
          className={cn(
            "font-[family-name:var(--font-display)] text-[1.2rem] font-semibold tracking-tight text-ink sm:text-[1.35rem]",
            wordClassName,
          )}
        >
          Me<span className="text-brand">Cuadra</span>
        </span>
      ) : null}
    </Link>
  );
}
