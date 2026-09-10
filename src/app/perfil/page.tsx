"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { Avatar, Badge, RequireAuth, Stars } from "@/components/ui";
import { COUNTRIES, citiesOf } from "@/lib/geo";
import { IconCamera, IconLock, IconPin, IconShield, IconTruck } from "@/components/icons";
import { OfferCard } from "@/components/OfferCard";
import { LogoutModal } from "@/components/LogoutModal";
import { uploadDataUrl } from "@/lib/upload";
import type { Transport } from "@/lib/types";
import { useT } from "@/lib/i18n/provider";
import { loadIdentity } from "@/lib/nostr/keys";
import { silentPaymentCode } from "@/lib/silent-payments";
import { proveReputation, loadStoredProof, verifyReputationProof, issueAttestation, loadAttestations } from "@/lib/zk/reputation";

export default function PerfilPage() {
  return (
    <RequireAuth>
      <Me />
    </RequireAuth>
  );
}

function Me() {
  const t = useT();
  const router = useRouter();
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

  const munis = useMemo(() => citiesOf(province), [province]);

  /** El formulario solo existe en modo edición, así que se siembra al abrirlo. */
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
      setError(t.profile.nameRequired);
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
      setSavedMsg(t.profile.saved);
      window.setTimeout(() => setSavedMsg(""), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : t.profile.saveFail);
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
        <p className="mt-3 text-sm text-mute">{u.tradesCompleted} {t.nav.trades}</p>
      </div>

      <section className="card space-y-3 p-5">
        <h2 className="font-display text-lg">{t.profile.npub}</h2>
        <p className="break-all font-mono text-xs text-ink">
          {u.npub || loadIdentity()?.npub || "—"}
        </p>
        <p className="text-xs text-mute">{t.profile.hideNpub}</p>
        <p className="text-xs font-semibold uppercase tracking-wider text-mute">{t.profile.sp}</p>
        <p className="break-all font-mono text-[11px] text-ink">
          {u.silentPaymentCode ||
            (loadIdentity() ? silentPaymentCode(loadIdentity()!.secretKey) : "—")}
        </p>
        <p className="text-xs text-mute">{t.profile.spHint}</p>
        <div className="rounded-2xl border border-line bg-surface-2 p-3">
          <p className="flex items-center gap-2 text-sm font-semibold">
            <IconLock className="h-4 w-4 text-brand" />
            {t.profile.zkTitle}
          </p>
          <p className="mt-1 text-xs text-mute">{t.profile.zkHint}</p>
          <ZkProveButton />
        </div>
      </section>

      <section className="card p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-display text-lg">{t.profile.data}</h2>
          {!editing ? (
            <button type="button" className="btn-ghost h-9 px-3 text-sm" onClick={startEdit}>
              {t.profile.edit}
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
              <dt className="text-xs font-semibold uppercase tracking-wider text-mute">{t.profile.name}</dt>
              <dd className="mt-0.5 font-medium text-ink">{u.name}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-mute">{t.profile.bio}</dt>
              <dd className="mt-0.5 whitespace-pre-wrap text-ink">
                {u.bio?.trim() ? u.bio : <span className="text-mute">{t.profile.noBio}</span>}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-mute">{t.profile.location}</dt>
              <dd className="mt-0.5 flex items-start gap-1.5 text-ink">
                <IconPin className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                {place || t.profile.noLocation}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-mute">{t.explore.transport}</dt>
              <dd className="mt-0.5 flex items-center gap-1.5 text-ink">
                <IconTruck className="h-4 w-4 shrink-0 text-brand" />
                {t.transport[u.transport as keyof typeof t.transport] ?? u.transport}
              </dd>
            </div>
          </dl>
        ) : (
          <form className="space-y-3" onSubmit={(e) => void saveProfile(e)}>
            <div>
              <label className="label">{t.profile.name}</label>
              <input
                className="input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="label">{t.profile.bio}</label>
              <textarea
                className="input min-h-20"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder={t.profile.bioPlaceholder}
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="label">{t.profile.country}</label>
                <select
                  className="input"
                  value={province}
                  onChange={(e) => {
                    setProvince(e.target.value);
                    setMunicipality(citiesOf(e.target.value)[0] ?? "");
                  }}
                >
                  {Object.keys(COUNTRIES).map((p) => (
                    <option key={p}>{p}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">{t.profile.city}</label>
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
              <label className="label">{t.publish.neighborhood}</label>
              <input
                className="input"
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
              />
            </div>
            <div>
              <label className="label">{t.explore.transport}</label>
              <select
                className="input"
                value={transport}
                onChange={(e) => setTransport(e.target.value as Transport)}
              >
                {(["tengo", "sin", "voy"] as const).map((k) => (
                  <option key={k} value={k}>
                    {t.transport[k]}
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
                {saving ? t.common.saving : t.common.save}
              </button>
              <button
                type="button"
                className="btn-ghost"
                disabled={saving}
                onClick={cancelEdit}
              >
                {t.common.cancel}
              </button>
            </div>
          </form>
        )}
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-xl">{t.profile.myOffers}</h2>
          <Badge tone="mute">{myItems.length} {t.profile.activeItems}</Badge>
        </div>
        {mine.length === 0 ? (
          <Link href="/publicar" className="btn-ghost">
            {t.profile.createOffer}
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
        {t.profile.logout}
      </button>
      {logoutOpen ? (
        <LogoutModal
          email={u.email}
          phone={u.phone}
          onClose={() => setLogoutOpen(false)}
          onDone={async () => {
            await logout();
            router.replace("/");
            router.refresh();
          }}
        />
      ) : null}
    </div>
  );
}

function ZkProveButton() {
  const t = useT();
  const [msg, setMsg] = useState("");
  const [ok, setOk] = useState(() => {
    const p = loadStoredProof();
    return Boolean(p && verifyReputationProof(p));
  });
  return (
    <div className="mt-3">
      <button
        type="button"
        className="btn-primary h-9 px-3 text-sm"
        onClick={() => {
          try {
            const id = loadIdentity();
            if (!id) {
              setMsg(t.auth.error);
              return;
            }
            if (loadAttestations().filter((a) => a.toPubkey === id.pubkey).length < 1) {
              issueAttestation({
                secretKey: id.secretKey,
                tradeId: "demo-self",
                stars: 5,
                fromPubkey: id.pubkey,
                toPubkey: id.pubkey,
              });
            }
            const proof = proveReputation(id.secretKey, id.pubkey);
            void fetch("/api/zk/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(proof),
            });
            setOk(true);
            setMsg(t.zk.ok);
          } catch {
            setMsg(t.zk.fail);
          }
        }}
      >
        {ok ? t.profile.zkVerified : t.profile.zkProve}
      </button>
      {msg ? <p className="mt-2 text-xs text-mute">{msg}</p> : null}
    </div>
  );
}
