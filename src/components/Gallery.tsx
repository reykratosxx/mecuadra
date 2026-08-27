"use client";

import { useCallback, useEffect, useState } from "react";
import { IconChevron, IconX } from "./icons";

export function Gallery({ photos, alt }: { photos: string[]; alt: string }) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [touchX, setTouchX] = useState<number | null>(null);
  const n = photos.length || 1;
  const srcs = photos.length ? photos : ["/logo.png"];

  const go = useCallback(
    (dir: number) => setIndex((i) => (i + dir + n) % n),
    [n],
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, go]);

  return (
    <>
      <div className="relative overflow-hidden rounded-3xl bg-surface-2">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="block w-full"
          onTouchStart={(e) => setTouchX(e.changedTouches[0].clientX)}
          onTouchEnd={(e) => {
            if (touchX == null) return;
            const dx = e.changedTouches[0].clientX - touchX;
            if (dx > 40) go(-1);
            if (dx < -40) go(1);
            setTouchX(null);
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={srcs[index]} alt={alt} className="aspect-[4/3] w-full object-cover" />
        </button>
        {n > 1 ? (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              className="absolute left-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-surface/90 text-ink shadow"
              aria-label="Foto anterior"
            >
              <IconChevron dir="left" className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              className="absolute right-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-surface/90 text-ink shadow"
              aria-label="Foto siguiente"
            >
              <IconChevron dir="right" className="h-5 w-5" />
            </button>
            <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
              {srcs.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIndex(i)}
                  className={`h-1.5 rounded-full ${i === index ? "w-5 bg-white" : "w-1.5 bg-white/60"}`}
                  aria-label={`Foto ${i + 1}`}
                />
              ))}
            </div>
          </>
        ) : null}
      </div>
      {n > 1 ? (
        <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
          {srcs.map((src, i) => (
            <button
              key={src + i}
              type="button"
              onClick={() => setIndex(i)}
              className={`h-16 w-16 shrink-0 overflow-hidden rounded-xl ring-2 ${
                i === index ? "ring-brand" : "ring-transparent"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      ) : null}

      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setOpen(false)}
        >
          <button
            type="button"
            className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white"
            onClick={() => setOpen(false)}
            aria-label="Cerrar"
          >
            <IconX className="h-5 w-5" />
          </button>
          <button
            type="button"
            className="absolute left-4 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white"
            onClick={(e) => {
              e.stopPropagation();
              go(-1);
            }}
            aria-label="Anterior"
          >
            <IconChevron dir="left" className="h-6 w-6" />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={srcs[index]}
            alt={alt}
            className="max-h-[85vh] max-w-full rounded-2xl object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            type="button"
            className="absolute right-4 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white"
            onClick={(e) => {
              e.stopPropagation();
              go(1);
            }}
            aria-label="Siguiente"
          >
            <IconChevron dir="right" className="h-6 w-6" />
          </button>
          <p className="absolute bottom-5 text-sm text-white/80">
            {index + 1} / {n} · desliza o usa las flechas
          </p>
        </div>
      ) : null}
    </>
  );
}
