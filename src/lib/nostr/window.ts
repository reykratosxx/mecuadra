import type { EventTemplate, VerifiedEvent } from "nostr-tools/pure";

export type WindowNostr = {
  getPublicKey(): Promise<string>;
  signEvent(event: EventTemplate): Promise<VerifiedEvent>;
  nip44?: {
    encrypt(pubkey: string, plaintext: string): Promise<string>;
    decrypt(pubkey: string, ciphertext: string): Promise<string>;
  };
};

declare global {
  interface Window {
    nostr?: WindowNostr;
  }
}

export {};
