"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { Avatar, Badge, RequireAuth, Stars } from "@/components/ui";
import { PROVINCES, TRANSPORT_LABEL, municipalitiesOf } from "@/lib/cuba";
import { IconCamera, IconPin, IconShield, IconTruck } from "@/components/icons";
import { OfferCard } from "@/components/OfferCard";
import { LogoutModal } from "@/components/LogoutModal";
import { uploadDataUrl } from "@/lib/upload";
import type { Transport } from "@/lib/types";

export default function PerfilPage() {
  return (
    <RequireAuth>
      <Me />
    </RequireAuth>
  );
}

function Me() {
  const { currentUser, updateProfile, logout, offers, items } = useStore();
  const u = currentUser!;
  const mine = offers.filter((o) => o.userId === u.id);
  const myItems = items.filter((i) => i.userId === u.id && i.status === "activo");
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState("");
  const [error, setError] = useState("");

  const [name, setName] = useState(u.name);
  const [bio, setBio] = useState(u.bio);
  const [province, setProvince] = useState(u.province);
  const [municipality, setMunicipality] = useState(u.municipality);
  const [neighborhood, setNeighborhood] = useState(u.neighborhood);
  const [transport, setTransport] = useState<Transport>(u.transport);

  const munis = useMemo(() => municipalitiesOf(province), [province]);

  useEffect(() => {
    if (editing) return;
    setName(u.name);
    setBio(u.bio);
    setProvince(u.province);
    setMunicipality(u.municipality);
    setNeighborhood(u.neighborhood);
    setTransport(u.transport);
  }, [u, editing]);

  function startEdit() {
    setName(u.name);
    setBio(u.bio);
    setProvince(u.province);
    setMunicipality(u.municipality);
    setNeighborhood(u.neighborhood);
    setTransport(u.transport);
    setError("");
    setSavedMsg("");
    setEditing(true);
  }

  function cancelEdit() {
    setEditing(false);
    setError("");
  }

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError("El nombre no puede estar vacío.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await updateProfile({
        name: name.trim(),
        bio: bio.trim(),
        province,
        municipality,
        neighborhood: neighborhood.trim(),
        transport,
      });
      setEditing(false);
      setSavedMsg("Perfil actualizado.");
      window.setTimeout(() => setSavedMsg(""), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar.");
    } finally {
      setSaving(false);
    }
  }

  const place = [u.neighborhood, u.municipality, u.province].filter(Boolean).join(", ");

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="card p-6">
        <div className="flex items-center gap-4">
          {editing ? (
            <label className="relative cursor-pointer">
              <Avatar src={u.avatar} name={u.name} size={72} />
              <span className="absolute bottom-0 right-0 grid h-7 w-7 place-items-center rounded-full bg-brand text-white">
                <IconCamera className="h-4 w-4" />
              </span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = () => {
                    if (typeof reader.result === "string") {
                      void uploadDataUrl("avatars", reader.result).then((url) =>
                        updateProfile({ avatar: url }),
                      );
                    }
                  };
                  reader.readAsDataURL(file);
                }}
              />
            </label>
          ) : (
            <Avatar src={u.avatar} name={u.name} size={72} />
          )}
          <div className="min-w-0">
            <p className="flex items-center gap-1 font-display text-2xl">
              <span className="truncate">{u.name}</span>
              {u.verified ? <IconShield className="h-5 w-5 shrink-0 text-brand" /> : null}
            </p>
            <p className="text-sm text-mute">@{u.username}</p>
            <Stars value={u.ratingAvg} count={u.ratingCount} size="md" />
          </div>
        </div>
        <p className="mt-3 text-sm text-mute">{u.tradesCompleted} trueques completados</p>
      </div>

      <section className="card p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-display text-lg">Datos del perfil</h2>
          {!editing ? (
            <button type="button" className="btn-ghost h-9 px-3 text-sm" onClick={startEdit}>
              Editar perfil
            </button>
          ) : null}
        </div>

        {savedMsg ? (
          <p className="mb-3 rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-700" role="status">
            {savedMsg}
          </p>
        ) : null}

        {!editing ? (
          <dl className="space-y-3 text-sm">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-mute">Nombre</dt>
              <dd className="mt-0.5 font-medium text-ink">{u.name}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-mute">Bio</dt>
              <dd className="mt-0.5 whitespace-pre-wrap text-ink">
                {u.bio?.trim() ? u.bio : <span className="text-mute">Sin bio todavía.</span>}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-mute">Ubicación</dt>
              <dd className="mt-0.5 flex items-start gap-1.5 text-ink">
                <IconPin className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                {place || "Sin ubicación"}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-mute">Transporte</dt>
              <dd className="mt-0.5 flex items-center gap-1.5 text-ink">
                <IconTruck className="h-4 w-4 shrink-0 text-brand" />
                {TRANSPORT_LABEL[u.transport] ?? u.transport}
              </dd>
            </div>
          </dl>
        ) : (
          <form className="space-y-3" onSubmit={(e) => void saveProfile(e)}>
            <div>
              <label className="label">Nombre</label>
              <input
                className="input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="label">Bio</label>
              <textarea
                className="input min-h-20"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Qué truequeas, en qué zona te mueves…"
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="label">Provincia</label>
                <select
                  className="input"
                  value={province}
                  onChange={(e) => {
                    setProvince(e.target.value);
                    setMunicipality(municipalitiesOf(e.target.value)[0] ?? "");
                  }}
                >
                  {Object.keys(PROVINCES).map((p) => (
                    <option key={p}>{p}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Municipio</label>
                <select
                  className="input"
                  value={municipality}
                  onChange={(e) => setMunicipality(e.target.value)}
                >
                  {munis.map((m) => (
                    <option key={m}>{m}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="label">Barrio</label>
              <input
                className="input"
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
                placeholder="Vedado, La Víbora…"
              />
            </div>
            <div>
              <label className="label">Transporte</label>
              <select
                className="input"
                value={transport}
                onChange={(e) => setTransport(e.target.value as Transport)}
              >
                {Object.entries(TRANSPORT_LABEL).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v}
                  </option>
                ))}
              </select>
            </div>

            {error ? (
              <p className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700" role="alert">
                {error}
              </p>
            ) : null}

            <div className="flex flex-wrap gap-2 pt-1">
              <button type="submit" className="btn-primary" disabled={saving}>
                {saving ? "Guardando…" : "Guardar"}
              </button>
              <button
                type="button"
                className="btn-ghost"
                disabled={saving}
                onClick={cancelEdit}
              >
                Cancelar
              </button>
            </div>
          </form>
        )}
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-xl">Mis ofertas</h2>
          <Badge tone="mute">{myItems.length} artículos activos</Badge>
        </div>
        {mine.length === 0 ? (
          <Link href="/publicar" className="btn-ghost">
            Crear oferta
          </Link>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {mine.map((o) => (
              <OfferCard key={o.id} offer={o} />
            ))}
          </div>
        )}
      </section>

      <button type="button" className="text-sm text-rose-600" onClick={() => setLogoutOpen(true)}>
        Cerrar sesión
      </button>
      {logoutOpen ? (
        <LogoutModal
          email={u.email}
          phone={u.phone}
          onClose={() => setLogoutOpen(false)}
          onDone={async () => {
            await logout();
            window.location.href = "/";
          }}
        />
      ) : null}
    </div>
  );
}
