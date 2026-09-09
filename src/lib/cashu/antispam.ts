const TOKEN_KEY = "mecuadra_cashu_stamp";

export const DEFAULT_MINT = process.env.NEXT_PUBLIC_CASHU_MINT_URL || "https://testnut.cashu.space";

export type CashuStamp = {
  mint: string;
  amount: number;
  purpose: "publish-antispam";
  proofsJson?: string;
  demo?: boolean;
  createdAt: string;
};

export function loadStamp(): CashuStamp | null {
  try {
    const raw = localStorage.getItem(TOKEN_KEY);
    return raw ? (JSON.parse(raw) as CashuStamp) : null;
  } catch {
    return null;
  }
}

export function saveStamp(stamp: CashuStamp) {
  localStorage.setItem(TOKEN_KEY, JSON.stringify(stamp));
}

export function hasPublishStamp() {
  const s = loadStamp();
  return Boolean(s && s.purpose === "publish-antispam");
}

/** Tries the public test mint info endpoint, then our HMAC demo stamp. Never a goods price. */
export async function mintPublishStamp(): Promise<CashuStamp> {
  try {
    const probe = await fetch(`${DEFAULT_MINT}/v1/info`, { signal: AbortSignal.timeout(4000) });
    if (probe.ok) {
      /* Mint is up. We still mint the unlinkable stamp via our API so we never pay Lightning as barter. */
    }
  } catch {
    /* mint down — demo stamp */
  }

  const res = await fetch("/api/privacy/cashu", { method: "POST" });
  const json = (await res.json()) as CashuStamp & { error?: string };
  if (!res.ok) throw new Error(json.error || "cashu stamp failed");
  saveStamp(json);
  return json;
}
