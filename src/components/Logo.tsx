import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({
  size = 36,
  withWord = false,
  className,
}: {
  size?: number;
  withWord?: boolean;
  className?: string;
}) {
  return (
    <Link href="/" className={cn("flex items-center gap-2.5", className)}>
      <Image
        src="/logo.png"
        alt="MeCuadra"
        width={size}
        height={size}
        className="drop-shadow-sm"
        priority
      />
      {withWord ? (
        <span className="font-[family-name:var(--font-display)] text-[1.35rem] font-semibold tracking-tight text-ink">
          Me<span className="text-brand">Cuadra</span>
        </span>
      ) : null}
    </Link>
  );
}
