"use client";

import { parseReputationProof, verifyReputationProof } from "@/lib/zk/reputation";
import type { User } from "@/lib/types";
import { useT } from "@/lib/i18n/provider";
import { IconLock, IconShield } from "./icons";

export function userZkProofOk(user: User | null | undefined) {
  const proof = parseReputationProof(user?.zkProof);
  return Boolean(proof && verifyReputationProof(proof));
}

export function ZkBadge({
  user,
  size = "sm",
}: {
  user: User | null | undefined;
  size?: "sm" | "md";
}) {
  const t = useT();
  const ok = userZkProofOk(user);
  const compact = size === "sm";

  if (ok) {
    return (
      <span
        className={`inline-flex items-center gap-1 rounded-full bg-emerald-50 font-semibold text-emerald-800 ring-1 ring-emerald-200 ${
          compact ? "px-1.5 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs"
        }`}
        title={t.zk.badgeOkHint}
      >
        <IconShield className={compact ? "h-3 w-3" : "h-3.5 w-3.5"} />
        {t.zk.badgeOk}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full bg-surface-2 font-medium text-mute ${
        compact ? "px-1.5 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs"
      }`}
      title={t.zk.badgeNoneHint}
    >
      <IconLock className={compact ? "h-3 w-3" : "h-3.5 w-3.5"} />
      {t.zk.badgeNone}
    </span>
  );
}
