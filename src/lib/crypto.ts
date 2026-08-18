import { createCipheriv, createDecipheriv, randomBytes } from "crypto";

const PREFIX = "v1";

function key() {
  const raw = process.env.MESSAGE_ENCRYPTION_KEY;
  if (!raw || raw.length < 64) {
    throw new Error("MESSAGE_ENCRYPTION_KEY debe ser 32 bytes en hex (64 caracteres).");
  }
  return Buffer.from(raw.slice(0, 64), "hex");
}

export function encryptMessage(plain: string) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key(), iv);
  const enc = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return [PREFIX, iv.toString("base64url"), tag.toString("base64url"), enc.toString("base64url")].join(".");
}

export function decryptMessage(payload: string) {
  const [version, ivB64, tagB64, dataB64] = payload.split(".");
  if (version !== PREFIX || !ivB64 || !tagB64 || !dataB64) {
    throw new Error("Formato de mensaje inválido");
  }
  const decipher = createDecipheriv("aes-256-gcm", key(), Buffer.from(ivB64, "base64url"));
  decipher.setAuthTag(Buffer.from(tagB64, "base64url"));
  const dec = Buffer.concat([
    decipher.update(Buffer.from(dataB64, "base64url")),
    decipher.final(),
  ]);
  return dec.toString("utf8");
}
