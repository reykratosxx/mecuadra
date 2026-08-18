"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { DEMO_USER_ID, seedState } from "./seed";
import type {
  AppState,
  CategoryId,
  Condition,
  Item,
  Offer,
  Trade,
  Transport,
  User,
  Want,
} from "./types";
import { nowIso, uid } from "./utils";

const STORAGE_KEY = "mecuadra-db-v1";

type Filters = {
  q: string;
  category: CategoryId | "";
  condition: Condition | "";
  province: string;
  municipality: string;
  transport: Transport | "";
  openToProposals: boolean;
};

type CreateItemInput = {
  title: string;
  description: string;
  category: CategoryId;
  condition: Condition;
  photos: string[];
};

type CreateOfferInput = {
  itemIds: string[];
  wants: Want[];
  openToProposals: boolean;
  message: string;
  province: string;
  municipality: string;
  neighborhood: string;
  transport: Transport;
};

type Store = AppState & {
  ready: boolean;
  filters: Filters;
  setFilters: (patch: Partial<Filters>) => void;
  resetFilters: () => void;
  currentUser: User | null;
  login: (email: string, name?: string) => void;
  logout: () => void;
  updateProfile: (patch: Partial<User>) => void;
  createItem: (input: CreateItemInput) => Item;
  updateItem: (id: string, patch: Partial<Item>) => void;
  createOffer: (input: CreateOfferInput) => Offer;
  updateOffer: (id: string, patch: Partial<Offer>) => void;
  applyToOffer: (
    offerId: string,
    proposedItemIds: string[],
    proposalNote: string,
  ) => Trade | { error: string };
  acceptTrade: (tradeId: string) => void;
  rejectTrade: (tradeId: string) => void;
  markDelivered: (tradeId: string) => void;
  sendMessage: (tradeId: string, text: string) => void;
  markNotificationsRead: () => void;
  rateTrade: (tradeId: string, stars: number, comment: string, tags: string[]) => void;
};

const defaultFilters: Filters = {
  q: "",
  category: "",
  condition: "",
  province: "",
  municipality: "",
  transport: "",
  openToProposals: false,
};

const Ctx = createContext<Store | null>(null);

function load(): AppState {
  if (typeof window === "undefined") return seedState;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return seedState;
    const parsed = JSON.parse(raw) as AppState;
    if (!parsed.users?.length) return seedState;
    return parsed;
  } catch {
    return seedState;
  }
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(seedState);
  const [ready, setReady] = useState(false);
  const [filters, setFiltersState] = useState<Filters>(defaultFilters);

  useEffect(() => {
    setState(load());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state, ready]);

  const persist = useCallback((updater: (s: AppState) => AppState) => {
    setState((s) => updater(s));
  }, []);

  const notify = (
    s: AppState,
    userId: string,
    title: string,
    body: string,
    href: string,
  ): AppState => ({
    ...s,
    notifications: [
      {
        id: uid("n"),
        userId,
        title,
        body,
        href,
        read: false,
        createdAt: nowIso(),
      },
      ...s.notifications,
    ],
  });

  const currentUser = useMemo(
    () => state.users.find((u) => u.id === state.currentUserId) ?? null,
    [state.users, state.currentUserId],
  );

  const value: Store = {
    ...state,
    ready,
    filters,
    currentUser,
    setFilters: (patch) => setFiltersState((f) => ({ ...f, ...patch })),
    resetFilters: () => setFiltersState(defaultFilters),
    login: (email, name) => {
      persist((s) => {
        const existing = s.users.find(
          (u) => u.email.toLowerCase() === email.toLowerCase(),
        );
        if (existing) return { ...s, currentUserId: existing.id };
        const id = uid("u");
        const user: User = {
          id,
          username: email.split("@")[0].replace(/[^a-z0-9]/gi, "").slice(0, 16) || "usuario",
          name: name || email.split("@")[0],
          email,
          avatar: `https://i.pravatar.cc/160?u=${encodeURIComponent(email)}`,
          bio: "",
          province: "La Habana",
          municipality: "Plaza de la Revolución",
          neighborhood: "",
          transport: "sin",
          ratingAvg: 0,
          ratingCount: 0,
          tradesCompleted: 0,
          verified: false,
          createdAt: nowIso(),
        };
        return { ...s, users: [...s.users, user], currentUserId: id };
      });
    },
    logout: () => persist((s) => ({ ...s, currentUserId: null })),
    updateProfile: (patch) => {
      persist((s) => ({
        ...s,
        users: s.users.map((u) =>
          u.id === s.currentUserId ? { ...u, ...patch } : u,
        ),
      }));
    },
    createItem: (input) => {
      const item: Item = {
        id: uid("i"),
        userId: state.currentUserId || DEMO_USER_ID,
        ...input,
        photos: input.photos.length ? input.photos : ["/logo.png"],
        status: "activo",
        createdAt: nowIso(),
      };
      persist((s) => ({ ...s, items: [item, ...s.items] }));
      return item;
    },
    updateItem: (id, patch) => {
      persist((s) => ({
        ...s,
        items: s.items.map((i) => (i.id === id ? { ...i, ...patch } : i)),
      }));
    },
    createOffer: (input) => {
      const offer: Offer = {
        id: uid("o"),
        userId: state.currentUserId || DEMO_USER_ID,
        ...input,
        status: "abierta",
        featured: false,
        views: 0,
        createdAt: nowIso(),
      };
      persist((s) => ({ ...s, offers: [offer, ...s.offers] }));
      return offer;
    },
    updateOffer: (id, patch) => {
      persist((s) => ({
        ...s,
        offers: s.offers.map((o) => (o.id === id ? { ...o, ...patch } : o)),
      }));
    },
    applyToOffer: (offerId, proposedItemIds, proposalNote) => {
      const me = state.currentUserId;
      if (!me) return { error: "Inicia sesión para aplicar." };
      const offer = state.offers.find((o) => o.id === offerId);
      if (!offer) return { error: "La oferta ya no existe." };
      if (offer.userId === me) return { error: "No puedes aplicar a tu propia oferta." };
      if (offer.status !== "abierta") return { error: "Esta oferta ya no está abierta." };
      if (
        state.trades.some(
          (t) =>
            t.offerId === offerId &&
            t.applicantId === me &&
            (t.status === "pendiente" || t.status === "aceptado" || t.status === "entregado"),
        )
      ) {
        return { error: "Ya aplicaste a esta oferta." };
      }
      const trade: Trade = {
        id: uid("t"),
        offerId,
        ownerId: offer.userId,
        applicantId: me,
        proposedItemIds,
        proposalNote,
        status: "pendiente",
        ownerDelivered: false,
        applicantDelivered: false,
        ownerRated: false,
        applicantRated: false,
        createdAt: nowIso(),
        updatedAt: nowIso(),
      };
      persist((s) => {
        let next = {
          ...s,
          trades: [trade, ...s.trades],
          messages: [
            {
              id: uid("m"),
              tradeId: trade.id,
              senderId: me,
              text: proposalNote || "Hola, me cuadra tu oferta.",
              createdAt: nowIso(),
            },
            ...s.messages,
          ],
        };
        next = notify(
          next,
          offer.userId,
          "Nueva aplicación MeCuadra",
          `${s.users.find((u) => u.id === me)?.name ?? "Alguien"} aplicó a tu oferta.`,
          `/chat/${trade.id}`,
        );
        return next;
      });
      return trade;
    },
    acceptTrade: (tradeId) => {
      persist((s) => {
        const trade = s.trades.find((t) => t.id === tradeId);
        if (!trade) return s;
        let next: AppState = {
          ...s,
          trades: s.trades.map((t) => {
            if (t.id === tradeId) return { ...t, status: "aceptado", updatedAt: nowIso() };
            if (t.offerId === trade.offerId && t.status === "pendiente") {
              return { ...t, status: "rechazado", updatedAt: nowIso() };
            }
            return t;
          }),
          offers: s.offers.map((o) =>
            o.id === trade.offerId ? { ...o, status: "en_proceso" } : o,
          ),
        };
        next = notify(
          next,
          trade.applicantId,
          "Aceptaron tu trueque",
          "Ya puedes coordinar el encuentro en el chat.",
          `/chat/${trade.id}`,
        );
        return next;
      });
    },
    rejectTrade: (tradeId) => {
      persist((s) => {
        const trade = s.trades.find((t) => t.id === tradeId);
        if (!trade) return s;
        let next: AppState = {
          ...s,
          trades: s.trades.map((t) =>
            t.id === tradeId ? { ...t, status: "rechazado", updatedAt: nowIso() } : t,
          ),
        };
        next = notify(
          next,
          trade.applicantId,
          "No se aceptó tu propuesta",
          "Puedes aplicar a otra oferta o ajustar lo que ofreces.",
          `/explorar`,
        );
        return next;
      });
    },
    markDelivered: (tradeId) => {
      persist((s) => {
        const trade = s.trades.find((t) => t.id === tradeId);
        if (!trade || !s.currentUserId) return s;
        const isOwner = trade.ownerId === s.currentUserId;
        const ownerDelivered = isOwner ? true : trade.ownerDelivered;
        const applicantDelivered = !isOwner ? true : trade.applicantDelivered;
        const done = ownerDelivered && applicantDelivered;
        let next: AppState = {
          ...s,
          trades: s.trades.map((t) =>
            t.id === tradeId
              ? {
                  ...t,
                  ownerDelivered,
                  applicantDelivered,
                  status: done ? "completado" : "entregado",
                  updatedAt: nowIso(),
                }
              : t,
          ),
        };
        if (done) {
          next = {
            ...next,
            offers: next.offers.map((o) =>
              o.id === trade.offerId ? { ...o, status: "completada" } : o,
            ),
            items: next.items.map((i) =>
              trade.proposedItemIds.includes(i.id) ||
              next.offers.find((o) => o.id === trade.offerId)?.itemIds.includes(i.id)
                ? { ...i, status: "canjeado" }
                : i,
            ),
            users: next.users.map((u) =>
              u.id === trade.ownerId || u.id === trade.applicantId
                ? { ...u, tradesCompleted: u.tradesCompleted + 1 }
                : u,
            ),
          };
        }
        return next;
      });
    },
    sendMessage: (tradeId, text) => {
      const me = state.currentUserId;
      if (!me || !text.trim()) return;
      persist((s) => ({
        ...s,
        messages: [
          ...s.messages,
          {
            id: uid("m"),
            tradeId,
            senderId: me,
            text: text.trim(),
            createdAt: nowIso(),
          },
        ],
      }));
    },
    markNotificationsRead: () => {
      persist((s) => ({
        ...s,
        notifications: s.notifications.map((n) =>
          n.userId === s.currentUserId ? { ...n, read: true } : n,
        ),
      }));
    },
    rateTrade: (tradeId, stars, comment, tags) => {
      persist((s) => {
        const trade = s.trades.find((t) => t.id === tradeId);
        if (!trade || !s.currentUserId) return s;
        const toId = s.currentUserId === trade.ownerId ? trade.applicantId : trade.ownerId;
        const rating = {
          id: uid("r"),
          tradeId,
          fromId: s.currentUserId,
          toId,
          stars,
          comment,
          tags,
          createdAt: nowIso(),
        };
        const targetRatings = [...s.ratings, rating].filter((r) => r.toId === toId);
        const avg =
          targetRatings.reduce((acc, r) => acc + r.stars, 0) / targetRatings.length;
        return {
          ...s,
          ratings: [...s.ratings, rating],
          trades: s.trades.map((t) =>
            t.id === tradeId
              ? {
                  ...t,
                  ownerRated: t.ownerId === s.currentUserId ? true : t.ownerRated,
                  applicantRated: t.applicantId === s.currentUserId ? true : t.applicantRated,
                }
              : t,
          ),
          users: s.users.map((u) =>
            u.id === toId
              ? { ...u, ratingAvg: Math.round(avg * 10) / 10, ratingCount: targetRatings.length }
              : u,
          ),
        };
      });
    },
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
