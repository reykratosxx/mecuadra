"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Avatar, Stars } from "./ui";
import { IconPin, IconShield, IconTruck, IconX } from "./icons";
import { TRANSPORT_LABEL } from "@/lib/cuba";
import type { User } from "@/lib/types";

/** Ficha rápida de una persona, sin salir del chat. */
export function ProfilePeek({ user, onClose }: { user: User; onClose: () => void }) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const place = [user.neighborhood, user.municipality, user.province].filter(Boolean).join(", ");

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/45 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`Perfil de ${user.name}`}
      onClick={onClose}
    >
      <div
        className="card w-full max-w-md rounded-b-none p-5 sm:rounded-b-[1.35rem]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-3">
          <Avatar src={user.avatar} name={user.name} size={64} />
          <div className="min-w-0 flex-1">
            <p className="flex items-center gap-1 font-display text-xl leading-tight">
              <span className="truncate">{user.name}</span>
              {user.verified ? <IconShield className="h-4 w-4 shrink-0 text-brand" /> : null}
            </p>
            <p className="truncate text-sm text-mute">@{user.username}</p>
            <Stars value={user.ratingAvg} count={user.ratingCount} />
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-mute hover:bg-hover"
            aria-label="Cerrar"
          >
            <IconX className="h-4 w-4" />
          </button>
        </div>

        <dl className="mt-4 space-y-2 rounded-2xl bg-surface-2 px-3 py-3 text-sm">
          <div className="flex items-start gap-2">
            <IconPin className="mt-0.5 h-4 w-4 shrink-0 text-mute" />
            <dd>{place || "Sin ubicación declarada"}</dd>
          </div>
          <div className="flex items-start gap-2">
            <IconTruck className="mt-0.5 h-4 w-4 shrink-0 text-mute" />
            <dd>{TRANSPORT_LABEL[user.transport] ?? "Transporte sin declarar"}</dd>
          </div>
          <div className="flex items-start gap-2">
            <span className="mt-0.5 w-4 shrink-0 text-center text-xs text-mute">✓</span>
            <dd>
              {user.tradesCompleted} {user.tradesCompleted === 1 ? "trueque" : "trueques"} completados
            </dd>
          </div>
        </dl>

        {user.bio?.trim() ? (
          <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-mute">{user.bio}</p>
        ) : null}

        <Link href={`/perfil/${user.id}`} className="btn-primary mt-4 w-full" onClick={onClose}>
          Ver perfil y sus ofertas
        </Link>
      </div>
    </div>
  );
}
