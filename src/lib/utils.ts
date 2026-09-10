export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function uid(prefix = "id") {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

export function nowIso() {
  return new Date().toISOString();
}

const HAVANA = "America/Havana";
const MONTHS_ES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

function havanaParts(iso: string) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: HAVANA,
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date(iso));
  const num = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((p) => p.type === type)?.value ?? 0);
  return {
    year: num("year"),
    month: num("month"),
    day: num("day"),
    hour: num("hour"),
    minute: num("minute"),
  };
}

const MONTHS_EN = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function timeAgo(iso: string, locale: string = "en") {
  const es = locale === "es";
  const months = es ? MONTHS_ES : MONTHS_EN;
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return es ? "Ahora" : "Now";
  if (min < 60) return es ? `Hace ${min} min` : `${min} min ago`;
  const h = Math.floor(min / 60);
  if (h < 24) return es ? `Hace ${h} h` : `${h} h ago`;
  const d = Math.floor(h / 24);
  if (d === 1) return es ? "Ayer" : "Yesterday";
  if (d < 7) return es ? `Hace ${d} días` : `${d} days ago`;
  const { day, month } = havanaParts(iso);
  return `${day} ${months[month - 1]}`;
}

export function formatDateTime(iso: string, locale: string = "en") {
  const months = locale === "es" ? MONTHS_ES : MONTHS_EN;
  const { day, month, year, hour, minute } = havanaParts(iso);
  const hh = String(hour).padStart(2, "0");
  const mm = String(minute).padStart(2, "0");
  return `${day} ${months[month - 1]} ${year}, ${hh}:${mm}`;
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

const OPEN_TO_ALIASES = new Set([
  "escucho propuestas",
  "open to proposals",
  "abierto / escucho propuestas",
]);

export function localizeWantTitle(raw: string, openToLabel: string) {
  if (OPEN_TO_ALIASES.has(raw.trim().toLowerCase())) return openToLabel;
  return displayTitle(raw);
}
