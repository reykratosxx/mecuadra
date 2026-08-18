"use client";

import { use, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useStore } from "@/lib/store";
import { Avatar, RequireAuth } from "@/components/ui";
import { IconChevron, IconSend } from "@/components/icons";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

export default function ChatPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return (
    <RequireAuth>
      <Thread id={id} />
    </RequireAuth>
  );
}

function Thread({ id }: { id: string }) {
  const {
    currentUser,
    trades,
    users,
    offers,
    items,
    messages,
    sendMessage,
    acceptTrade,
    rejectTrade,
    markDelivered,
    rateTrade,
    loadMessages,
    ready,
  } = useStore();
  const trade = trades.find((t) => t.id === id);
  const [text, setText] = useState("");
  const [stars, setStars] = useState(5);
  const [comment, setComment] = useState("");
  const end = useRef<HTMLDivElement>(null);
  useEffect(() => {
    void loadMessages(id);
  }, [id, loadMessages]);
  useEffect(() => {
    end.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);
  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    let cancelled = false;
    const supabase = createClient();
    const channel = supabase
      .channel(`trade-chat-${id}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages", filter: `trade_id=eq.${id}` },
        () => {
          if (!cancelled) void loadMessages(id);
        },
      )
      .subscribe();
    return () => {
      cancelled = true;
      void supabase.removeChannel(channel);
    };
  }, [id, loadMessages]);

  if (!ready) return <div className="py-16 text-center text-mute">Cargando chat…</div>;
  if (!trade) notFound();
  const uid = currentUser!.id;
  if (trade.ownerId !== uid && trade.applicantId !== uid) notFound();

  const other = users.find((u) => u.id === (trade.ownerId === uid ? trade.applicantId : trade.ownerId));
  const offer = offers.find((o) => o.id === trade.offerId);
  const offered = items.filter((i) => offer?.itemIds.includes(i.id));
  const proposed = items.filter((i) => trade.proposedItemIds.includes(i.id));
  const thread = messages.filter((m) => m.tradeId === trade.id);
  const iRated = trade.ownerId === uid ? trade.ownerRated : trade.applicantRated;
  const iDelivered = trade.ownerId === uid ? trade.ownerDelivered : trade.applicantDelivered;

  return (
    <div className="mx-auto flex max-w-2xl flex-col">
      <div className="mb-3 flex items-center gap-3">
        <Link href="/trueques" className="grid h-9 w-9 place-items-center rounded-full hover:bg-stone-100">
          <IconChevron dir="left" className="h-5 w-5" />
        </Link>
        <Avatar src={other?.avatar} name={other?.name ?? "?"} />
        <div>
          <p className="font-semibold">{other?.name}</p>
          <p className="text-xs text-mute">
            {offered[0]?.title ?? "Trueque"} ⇄ {proposed[0]?.title ?? "propuesta"}
          </p>
        </div>
      </div>

      <div className="card mb-3 p-3 text-sm">
        <p className="text-mute">{trade.proposalNote}</p>
        {trade.status === "pendiente" && trade.ownerId === uid ? (
          <div className="mt-3 flex gap-2">
            <button type="button" className="btn-primary flex-1" onClick={() => void acceptTrade(trade.id)}>
              Aceptar
            </button>
            <button type="button" className="btn-ghost flex-1" onClick={() => void rejectTrade(trade.id)}>
              Rechazar
            </button>
          </div>
        ) : null}
        {["aceptado", "entregado"].includes(trade.status) ? (
          <button
            type="button"
            className="btn-primary mt-3 w-full"
            disabled={iDelivered}
            onClick={() => void markDelivered(trade.id)}
          >
            {iDelivered ? "Esperando confirmación de la otra parte" : "Confirmar que entregué / recibí"}
          </button>
        ) : null}
      </div>

      <div className="card flex min-h-[420px] flex-col p-3">
        <div className="flex-1 space-y-2 overflow-y-auto">
          {thread.map((m) => {
            const mine = m.senderId === uid;
            return (
              <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                <p
                  className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
                    mine ? "bg-[image:var(--grad)] text-white" : "bg-stone-100"
                  }`}
                >
                  {m.text}
                </p>
              </div>
            );
          })}
          <div ref={end} />
        </div>
        {["pendiente", "aceptado", "entregado"].includes(trade.status) ? (
          <form
            className="mt-3 flex gap-2"
            onSubmit={async (e) => {
              e.preventDefault();
              const value = text;
              setText("");
              await sendMessage(trade.id, value);
            }}
          >
            <input
              className="input"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Escribe… puedes ofrecer otro artículo no publicado"
            />
            <button type="submit" className="btn-primary !px-3" aria-label="Enviar">
              <IconSend className="h-5 w-5" />
            </button>
          </form>
        ) : (
          <p className="mt-3 text-center text-xs text-mute">Este trueque está {trade.status}.</p>
        )}
      </div>

      {trade.status === "completado" && !iRated ? (
        <form
          className="card mt-3 p-4"
          onSubmit={(e) => {
            e.preventDefault();
            void rateTrade(trade.id, stars, comment, []);
          }}
        >
          <p className="font-display text-lg">Valorar a {other?.name}</p>
          <div className="my-2 flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button key={n} type="button" onClick={() => setStars(n)} className="text-2xl text-amber-500">
                {n <= stars ? "★" : "☆"}
              </button>
            ))}
          </div>
          <input
            className="input mb-2"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="¿Puntual? ¿Tal como lo describió?"
          />
          <button type="submit" className="btn-primary w-full">
            Enviar valoración
          </button>
        </form>
      ) : null}
    </div>
  );
}
