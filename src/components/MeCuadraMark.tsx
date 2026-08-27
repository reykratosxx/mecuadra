"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

/** Hexágono completo: para fondos claros u oscuros planos. */
export function MeCuadraMark({ size = 22, className }: { size?: number; className?: string }) {
  return (
    <Image
      src="/logo.png"
      alt=""
      width={size}
      height={size}
      className={cn(
        "shrink-0 drop-shadow-[0_1px_3px_rgba(15,6,32,0.35)]",
        className,
      )}
      aria-hidden
    />
  );
}

/** Solo el apretón en blanco: sobre el degradado el hexágono se pierde. */
export function MeCuadraGlyph({ size = 20, className }: { size?: number; className?: string }) {
  return (
    <Image
      src="/mark-handshake.png"
      alt=""
      width={size}
      height={size}
      className={cn("shrink-0 drop-shadow-[0_1px_2px_rgba(15,6,32,0.45)]", className)}
      aria-hidden
    />
  );
}

export function MeCuadraLabel({
  size = 26,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <MeCuadraGlyph size={size} />
      MeCuadra
    </span>
  );
}
