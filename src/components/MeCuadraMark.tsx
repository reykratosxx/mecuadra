"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

/** Marca del botón MeCuadra: mismo icono de manos que el logo de la app. */
export function MeCuadraMark({ size = 22, className }: { size?: number; className?: string }) {
  return (
    <Image
      src="/logo.png"
      alt=""
      width={size}
      height={size}
      className={cn("shrink-0 drop-shadow-sm", className)}
      aria-hidden
    />
  );
}

export function MeCuadraLabel({
  size = 22,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <MeCuadraMark size={size} />
      MeCuadra
    </span>
  );
}
