"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { mapItem, mapNotif, mapOffer, mapRating, mapTrade, mapUser } from "@/lib/mappers";
import type {
  AppState,
  CategoryId,
  ChatMessage,
  Condition,
  Item,
  Offer,
  Trade,
  Transport,
  User,
  Want,
} from "./types";

const empty: AppState = {
  users: [],
  items: [],
  offers: [],
  trades: [],
  messages: [],
  notifications: [],
  ratings: [],
  currentUserId: null,
};

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
  configured: boolean;
  needsPhone: boolean;
  filters: Filters;
  setFilters: (patch: Partial<Filters>) => void;
  resetFilters: () => void;
  currentUser: User | null;
  refresh: () => Promise<void>;
  loadMessages: (tradeId: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (patch: Partial<User>) => Promise<void>;
  createItem: (input: CreateItemInput) => Promise<Item>;
  updateItem: (id: string, patch: Partial<Item>) => Promise<void>;
  createOffer: (input: CreateOfferInput) => Promise<Offer>;
  updateOffer: (id: string, patch: Partial<Offer>) => Promise<void>;
  applyToOffer: (
    offerId: string,
    proposedItemIds: string[],
    proposalNote: string,
  ) => Promise<Trade | { error: string }>;
  acceptTrade: (tradeId: string) => Promise<void>;
  rejectTrade: (tradeId: string) => Promise<void>;
  markDelivered: (tradeId: string) => Promise<void>;
  sendMessage: (tradeId: string, text: string) => Promise<void>;
  markNotificationsRead: () => Promise<void>;
  rateTrade: (tradeId: string, stars: number, comment: string, tags: string[]) => Promise<void>;
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

function requirePhone(user: User | null): string | null {
  if (!user?.phoneVerified || !user.phone) {
    return "Verifica tu teléfono para publicar o aplicar. Así evitamos cuentas falsas.";
  }
  return null;
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(empty);
  const [ready, setReady] = useState(false);
  const [filters, setFiltersState] = useState<Filters>(defaultFilters);
  const configured = isSupabaseConfigured();

  const refresh = useCallback(async () => {
    if (!configured) {
      setReady(true);
      return;
    }
    const supabase = createClient();
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    const [{ data: profiles }, { data: items }, { data: offers }, { data: ratings }] =
      await Promise.all([
        supabase.from("profiles").select("*"),
        supabase.from("items").select("*"),
        supabase.from("offers").select("*").order("created_at", { ascending: false }),
        supabase.from("ratings").select("*"),
      ]);

    let trades: Trade[] = [];
    let notifications: AppState["notifications"] = [];
    if (authUser) {
      const [{ data: t }, { data: n }] = await Promise.all([
        supabase.from("trades").select("*").order("updated_at", { ascending: false }),
        supabase.from("notifications").select("*").order("created_at", { ascending: false }),
      ]);
      trades = (t ?? []).map(mapTrade);
      notifications = (n ?? []).map(mapNotif);
    }

    setState((prev) => ({
      ...prev,
      users: (profiles ?? []).map((p) =>
        mapUser(p, authUser && p.id === authUser.id ? authUser.email || "" : ""),
      ),
      items: (items ?? []).map(mapItem),
      offers: (offers ?? []).map(mapOffer),
      trades,
      notifications,
      ratings: (ratings ?? []).map(mapRating),
      currentUserId: authUser?.id ?? null,
    }));
    setReady(true);
  }, [configured]);

  useEffect(() => {
    void refresh();
    if (!configured) return;
    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      void refresh();
    });
    const channel = supabase
      .channel("mecuadra-live")
      .on("postgres_changes", { event: "*", schema: "public", table: "offers" }, () => void refresh())
      .on("postgres_changes", { event: "*", schema: "public", table: "items" }, () => void refresh())
      .on("postgres_changes", { event: "*", schema: "public", table: "trades" }, () => void refresh())
      .on("postgres_changes", { event: "*", schema: "public", table: "notifications" }, () => void refresh())
      .subscribe();
    return () => {
      subscription.unsubscribe();
      void supabase.removeChannel(channel);
    };
  }, [configured, refresh]);

  const currentUser = useMemo(
    () => state.users.find((u) => u.id === state.currentUserId) ?? null,
    [state.users, state.currentUserId],
  );

  const loadMessages = useCallback(async (tradeId: string) => {
    const res = await fetch(`/api/trades/${tradeId}/messages`);
    if (!res.ok) return;
    const json = (await res.json()) as { messages: ChatMessage[] };
    setState((s) => ({
      ...s,
      messages: [
        ...s.messages.filter((m) => m.tradeId !== tradeId),
        ...json.messages,
      ],
    }));
  }, []);

  const value: Store = {
    ...state,
    ready,
    configured,
    needsPhone: Boolean(state.currentUserId && (!currentUser?.phone || !currentUser.phoneVerified)),
    filters,
    currentUser,
    setFilters: (patch) => setFiltersState((f) => ({ ...f, ...patch })),
    resetFilters: () => setFiltersState(defaultFilters),
    refresh,
    loadMessages,
    logout: async () => {
      await createClient().auth.signOut();
      setState(empty);
    },
    updateProfile: async (patch) => {
      if (!state.currentUserId) return;
      const row: Record<string, unknown> = {};
      if (patch.name) row.name = patch.name;
      if (patch.bio !== undefined) row.bio = patch.bio;
      if (patch.avatar !== undefined) row.avatar_url = patch.avatar;
      if (patch.province) row.province = patch.province;
      if (patch.municipality) row.municipality = patch.municipality;
      if (patch.neighborhood !== undefined) row.neighborhood = patch.neighborhood;
      if (patch.transport) row.transport = patch.transport;
      const { error } = await createClient().from("profiles").update(row).eq("id", state.currentUserId);
      if (error) throw error;
      await refresh();
    },
    createItem: async (input) => {
      const gate = requirePhone(currentUser);
      if (gate) throw new Error(gate);
      if (!state.currentUserId) throw new Error("Inicia sesión");
      const { data, error } = await createClient()
        .from("items")
        .insert({
          user_id: state.currentUserId,
          title: input.title,
          description: input.description,
          category: input.category,
          condition: input.condition,
          photos: input.photos,
        })
        .select("*")
        .single();
      if (error) throw error;
      const item = mapItem(data);
      setState((s) => ({ ...s, items: [item, ...s.items] }));
      return item;
    },
    updateItem: async (id, patch) => {
      const row: Record<string, unknown> = {};
      if (patch.status) row.status = patch.status;
      if (patch.title) row.title = patch.title;
      if (patch.description) row.description = patch.description;
      const { error } = await createClient().from("items").update(row).eq("id", id);
      if (error) throw error;
      await refresh();
    },
    createOffer: async (input) => {
      const gate = requirePhone(currentUser);
      if (gate) throw new Error(gate);
      if (!state.currentUserId) throw new Error("Inicia sesión");
      const { data, error } = await createClient()
        .from("offers")
        .insert({
          user_id: state.currentUserId,
          item_ids: input.itemIds,
          wants: input.wants,
          open_to_proposals: input.openToProposals,
          message: input.message,
          province: input.province,
          municipality: input.municipality,
          neighborhood: input.neighborhood,
          transport: input.transport,
        })
        .select("*")
        .single();
      if (error) throw error;
      const offer = mapOffer(data);
      setState((s) => ({ ...s, offers: [offer, ...s.offers] }));
      return offer;
    },
    updateOffer: async (id, patch) => {
      const row: Record<string, unknown> = {};
      if (patch.status) row.status = patch.status;
      const { error } = await createClient().from("offers").update(row).eq("id", id);
      if (error) throw error;
      await refresh();
    },
    applyToOffer: async (offerId, proposedItemIds, proposalNote) => {
      const gate = requirePhone(currentUser);
      if (gate) return { error: gate };
      if (!state.currentUserId) return { error: "Inicia sesión para aplicar." };
      const offer = state.offers.find((o) => o.id === offerId);
      if (!offer) return { error: "La oferta ya no existe." };
      if (offer.userId === state.currentUserId) return { error: "No puedes aplicar a tu propia oferta." };
      const { data, error } = await createClient()
        .from("trades")
        .insert({
          offer_id: offerId,
          owner_id: offer.userId,
          applicant_id: state.currentUserId,
          proposed_item_ids: proposedItemIds,
          proposal_note: proposalNote,
        })
        .select("*")
        .single();
      if (error) return { error: error.message };
      const trade = mapTrade(data);
      if (proposalNote.trim()) {
        await fetch(`/api/trades/${trade.id}/messages`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: proposalNote }),
        });
      }
      await refresh();
      return trade;
    },
    acceptTrade: async (tradeId) => {
      const supabase = createClient();
      const trade = state.trades.find((t) => t.id === tradeId);
      if (!trade) return;
      await supabase.from("trades").update({ status: "aceptado" }).eq("id", tradeId);
      await supabase
        .from("trades")
        .update({ status: "rechazado" })
        .eq("offer_id", trade.offerId)
        .eq("status", "pendiente")
        .neq("id", tradeId);
      await supabase.from("offers").update({ status: "en_proceso" }).eq("id", trade.offerId);
      await refresh();
    },
    rejectTrade: async (tradeId) => {
      await createClient().from("trades").update({ status: "rechazado" }).eq("id", tradeId);
      await refresh();
    },
    markDelivered: async (tradeId) => {
      const supabase = createClient();
      const trade = state.trades.find((t) => t.id === tradeId);
      if (!trade || !state.currentUserId) return;
      const isOwner = trade.ownerId === state.currentUserId;
      const ownerDelivered = isOwner ? true : trade.ownerDelivered;
      const applicantDelivered = !isOwner ? true : trade.applicantDelivered;
      const done = ownerDelivered && applicantDelivered;
      await supabase
        .from("trades")
        .update({
          owner_delivered: ownerDelivered,
          applicant_delivered: applicantDelivered,
          status: done ? "completado" : "entregado",
        })
        .eq("id", tradeId);
      if (done) {
        await supabase.from("offers").update({ status: "completada" }).eq("id", trade.offerId);
        const offer = state.offers.find((o) => o.id === trade.offerId);
        const ids = [...trade.proposedItemIds, ...(offer?.itemIds ?? [])];
        if (ids.length) {
          await supabase.from("items").update({ status: "canjeado" }).in("id", ids);
        }
        const bump = async (id: string) => {
          const u = state.users.find((x) => x.id === id);
          if (!u) return;
          await supabase
            .from("profiles")
            .update({ trades_completed: u.tradesCompleted + 1 })
            .eq("id", id);
        };
        await bump(trade.ownerId);
        await bump(trade.applicantId);
      }
      await refresh();
    },
    sendMessage: async (tradeId, text) => {
      if (!text.trim()) return;
      const res = await fetch(`/api/trades/${tradeId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) return;
      const json = (await res.json()) as { message: ChatMessage };
      setState((s) => ({ ...s, messages: [...s.messages, json.message] }));
    },
    markNotificationsRead: async () => {
      if (!state.currentUserId) return;
      await createClient()
        .from("notifications")
        .update({ read: true })
        .eq("user_id", state.currentUserId)
        .eq("read", false);
      setState((s) => ({
        ...s,
        notifications: s.notifications.map((n) => ({ ...n, read: true })),
      }));
    },
    rateTrade: async (tradeId, stars, comment, tags) => {
      if (!state.currentUserId) return;
      const trade = state.trades.find((t) => t.id === tradeId);
      if (!trade) return;
      const toId = state.currentUserId === trade.ownerId ? trade.applicantId : trade.ownerId;
      const supabase = createClient();
      await supabase.from("ratings").insert({
        trade_id: tradeId,
        from_id: state.currentUserId,
        to_id: toId,
        stars,
        comment,
        tags,
      });
      const field = trade.ownerId === state.currentUserId ? "owner_rated" : "applicant_rated";
      await supabase.from("trades").update({ [field]: true }).eq("id", tradeId);
      const list = [...state.ratings.filter((r) => r.toId === toId), { stars, toId } as { stars: number; toId: string }];
      const avg = list.reduce((a, r) => a + r.stars, 0) / list.length;
      await supabase
        .from("profiles")
        .update({ rating_avg: Math.round(avg * 10) / 10, rating_count: list.length })
        .eq("id", toId);
      await refresh();
    },
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
