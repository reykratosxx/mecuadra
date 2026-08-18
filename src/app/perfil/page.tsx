"use client";

import Link from "next/link";
import { useStore } from "@/lib/store";
import { Avatar, Badge, RequireAuth, Stars } from "@/components/ui";
import { PROVINCES, TRANSPORT_LABEL, municipalitiesOf } from "@/lib/cuba";
import { IconCamera, IconShield } from "@/components/icons";
import { OfferCard } from "@/components/OfferCard";
import { uploadDataUrl } from "@/lib/upload";

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

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="card p-6">
        <div className="flex items-center gap-4">
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
          <div>
            <p className="flex items-center gap-1 font-display text-2xl">
              {u.name}
              {u.verified ? <IconShield className="h-5 w-5 text-brand" /> : null}
            </p>
            <p className="text-sm text-mute">@{u.username}</p>
            <Stars value={u.ratingAvg} count={u.ratingCount} size="md" />
          </div>
        </div>
        <p className="mt-3 text-sm text-mute">{u.tradesCompleted} trueques completados</p>
      </div>

      <form
        className="card space-y-3 p-5"
        onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          void updateProfile({
            name: String(fd.get("name")),
            bio: String(fd.get("bio")),
            province: String(fd.get("province")),
            municipality: String(fd.get("municipality")),
            neighborhood: String(fd.get("neighborhood")),
            transport: String(fd.get("transport")) as typeof u.transport,
          });
        }}
      >
        <h2 className="font-display text-lg">Datos del perfil</h2>
        <div>
          <label className="label">Nombre</label>
          <input name="name" className="input" defaultValue={u.name} />
        </div>
        <div>
          <label className="label">Bio</label>
          <textarea name="bio" className="input min-h-20" defaultValue={u.bio} />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="label">Provincia</label>
            <select name="province" className="input" defaultValue={u.province}>
              {Object.keys(PROVINCES).map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Municipio</label>
            <select name="municipality" className="input" defaultValue={u.municipality}>
              {municipalitiesOf(u.province).map((m) => (
                <option key={m}>{m}</option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="label">Barrio</label>
          <input name="neighborhood" className="input" defaultValue={u.neighborhood} />
        </div>
        <div>
          <label className="label">Transporte</label>
          <select name="transport" className="input" defaultValue={u.transport}>
            {Object.entries(TRANSPORT_LABEL).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn-primary">
          Guardar
        </button>
      </form>

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

      <button type="button" className="text-sm text-rose-600" onClick={() => void logout()}>
        Cerrar sesión
      </button>
    </div>
  );
}
