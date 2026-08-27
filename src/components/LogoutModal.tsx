"use client";

import { useState } from "react";
import { IconX } from "./icons";

export function LogoutModal({
  onClose,
  onDone,
}: {
  email?: string | null;
  phone?: string | null;
  onClose: () => void;
  onDone: () => Promise<void>;
}) {
  const [busy, setBusy] = useState(false);

  async function salir() {
    setBusy(true);
    await onDone();
    setBusy(false);
  }

  return (
    <div className="fixed inset-0 z-[80] grid place-items-center bg-brand/25 p-4">
      <div className="card w-full max-w-md p-5">
        <div className="mb-3 flex items-start justify-between">
          <div>
            <h2 className="font-display text-xl">Cerrar sesión</h2>
            <p className="text-sm text-mute">
              Sales de esta cuenta en este teléfono. No hace falta otro código.
            </p>
          </div>
          <button type="button" onClick={onClose} aria-label="Cerrar">
            <IconX className="h-5 w-5" />
          </button>
        </div>
        <button type="button" className="btn-primary w-full" disabled={busy} onClick={() => void salir()}>
          Sí, salir
        </button>
        <button type="button" className="btn-ghost mt-2 w-full" disabled={busy} onClick={onClose}>
          Cancelar
        </button>
      </div>
    </div>
  );
}
