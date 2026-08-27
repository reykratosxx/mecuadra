export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function uid(prefix = "id") {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

export function nowIso() {
  return new Date().toISOString();
}

export function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return "Ahora";
  if (min < 60) return `Hace ${min} min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `Hace ${h} h`;
  const d = Math.floor(h / 24);
  if (d === 1) return "Ayer";
  if (d < 7) return `Hace ${d} días`;
  return new Date(iso).toLocaleDateString("es-CU", {
    day: "numeric",
    month: "short",
  });
}

/** Fecha y hora legibles (es-CU). */
export function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("es-CU", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** true si hubo edición real (más de ~1 min tras crear). */
export function wasEdited(createdAt: string, updatedAt?: string | null) {
  if (!updatedAt) return false;
  return new Date(updatedAt).getTime() - new Date(createdAt).getTime() > 60_000;
}

export function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();
}

/**
 * Títulos en MAYÚSCULAS se ven en minúsculas con inicial mayúscula
 * (más legible y no estiran tanto el layout en móvil).
 */
export function displayTitle(raw: string) {
  const t = raw.trim().replace(/\s+/g, " ");
  if (!t) return t;
  const letters = t.replace(/[^a-zA-ZáéíóúüñÁÉÍÓÚÜÑ]/g, "");
  if (letters.length < 4) return t;
  const upper = (letters.match(/[A-ZÁÉÍÓÚÜÑ]/g) || []).length;
  if (upper / letters.length < 0.65) return t;
  const lower = t.toLocaleLowerCase("es");
  return lower.charAt(0).toLocaleUpperCase("es") + lower.slice(1);
}
