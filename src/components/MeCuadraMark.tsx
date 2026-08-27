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
      className={cn(
        "block size-10 shrink-0 drop-shadow-[0_1px_2px_rgba(15,6,32,0.45)] sm:size-12",
        className,
      )}
      aria-hidden
    />
  );
}

export function MeCuadraLabel({
  size = 48,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <span
      data-mecuadra-label
      className={cn(
        "inline-flex h-10 w-full items-center justify-center gap-2 text-lg font-semibold leading-none sm:h-12 sm:w-auto sm:gap-2.5 sm:text-xl",
        className,
      )}
    >
      <MeCuadraGlyph size={size} />
      MeCuadra
    </span>
  );
}
