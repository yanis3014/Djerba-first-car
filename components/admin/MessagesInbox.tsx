"use client";

import { Mail } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { markMessageAsRead } from "@/lib/admin/crm-actions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import type { Message } from "@/lib/types";

function formatMessageDate(iso: string) {
  try {
    return new Intl.DateTimeFormat("fr-FR", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function formatListDate(iso: string) {
  try {
    return new Intl.DateTimeFormat("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function previewText(text: string, maxLen = 90) {
  const one = text.replace(/\s+/g, " ").trim();
  if (one.length <= maxLen) return one;
  return `${one.slice(0, maxLen).trimEnd()}…`;
}

function buildReplyMailto(msg: Message): string | null {
  if (!msg.email?.trim()) return null;
  const subject = msg.subject?.trim()
    ? `Re: ${msg.subject.trim()}`
    : "Re: votre message";
  const body = `\n\n--- Message original ---\nLe ${formatMessageDate(msg.created_at)}, ${msg.name} a écrit :\n\n${msg.message}`;
  const params = new URLSearchParams({ subject, body });
  return `mailto:${msg.email.trim()}?${params.toString()}`;
}

export function MessagesInbox({ messages }: { messages: Message[] }) {
  const [selectedId, setSelectedId] = useState<string | null>(() => messages[0]?.id ?? null);

  useEffect(() => {
    if (messages.length === 0) {
      setSelectedId(null);
      return;
    }
    setSelectedId((current) => {
      if (current && messages.some((m) => m.id === current)) return current;
      return messages[0]!.id;
    });
  }, [messages]);

  const selected = useMemo(
    () => messages.find((m) => m.id === selectedId) ?? null,
    [messages, selectedId],
  );

  const replyHref = selected ? buildReplyMailto(selected) : null;

  if (messages.length === 0) {
    return (
      <p className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-10 text-center text-sm text-[var(--color-muted)]">
        Aucun message.
      </p>
    );
  }

  return (
    <div className="flex min-h-[min(70vh,720px)] flex-col overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] lg:flex-row">
      <aside
        className="flex max-h-[40vh] shrink-0 flex-col border-b border-[var(--color-border)] lg:max-h-none lg:w-[min(100%,380px)] lg:border-b-0 lg:border-r"
        aria-label="Liste des messages"
      >
        <div className="border-b border-[var(--color-border)] px-4 py-3">
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-muted)]">
            Boîte de réception
          </p>
          <p className="text-sm text-[var(--color-text)]">{messages.length} message{messages.length > 1 ? "s" : ""}</p>
        </div>
        <ul className="min-h-0 flex-1 overflow-y-auto">
          {messages.map((msg) => {
            const isActive = msg.id === selectedId;
            return (
              <li key={msg.id}>
                <button
                  type="button"
                  onClick={() => setSelectedId(msg.id)}
                  className={cn(
                    "flex w-full flex-col gap-1 border-b border-[var(--color-border)] px-4 py-3 text-left transition-colors hover:bg-[var(--color-bg-alt)]",
                    isActive && "bg-[var(--color-bg-alt)] ring-1 ring-inset ring-[var(--color-accent)]/25",
                    !msg.is_read && !isActive && "bg-[var(--color-accent)]/[0.04]",
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span
                      className={cn(
                        "truncate font-medium text-[var(--color-text)]",
                        !msg.is_read && "text-[var(--color-text)]",
                      )}
                    >
                      {msg.name}
                    </span>
                    <time
                      className="shrink-0 text-xs text-[var(--color-muted)]"
                      dateTime={msg.created_at}
                    >
                      {formatListDate(msg.created_at)}
                    </time>
                  </div>
                  <p className="line-clamp-2 text-sm text-[var(--color-muted)]">{previewText(msg.message)}</p>
                  {!msg.is_read ? (
                    <span className="w-fit rounded-full bg-[var(--color-accent)]/15 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-[var(--color-accent)]">
                      Non lu
                    </span>
                  ) : null}
                </button>
              </li>
            );
          })}
        </ul>
      </aside>

      <section
        className="flex min-h-0 min-w-0 flex-1 flex-col"
        aria-label="Détail du message"
      >
        {selected ? (
          <>
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[var(--color-border)] px-5 py-4">
              <div className="min-w-0">
                <h2 className="font-[var(--font-display)] text-xl text-[var(--color-text)]">{selected.name}</h2>
                <time className="mt-1 block text-xs text-[var(--color-muted)]" dateTime={selected.created_at}>
                  {formatMessageDate(selected.created_at)}
                </time>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {replyHref ? (
                  <a
                    href={replyHref}
                    className={cn(
                      "inline-flex items-center justify-center gap-1.5 rounded-[var(--radius-md)] px-3 py-2 text-sm font-medium transition-colors duration-150",
                      "bg-[var(--color-accent)] text-white shadow-sm hover:bg-[var(--color-accent-hover)]",
                    )}
                  >
                    <Mail className="size-4 shrink-0" aria-hidden />
                    Répondre par email
                  </a>
                ) : (
                  <p className="text-xs text-[var(--color-muted)]">Aucune adresse email</p>
                )}
                {!selected.is_read ? (
                  <form action={markMessageAsRead.bind(null, selected.id)}>
                    <Button type="submit" variant="secondary" className="px-3 py-2 text-sm">
                      Marquer comme lu
                    </Button>
                  </form>
                ) : null}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4">
              <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-[var(--color-muted)]">
                {selected.email ? (
                  <a
                    href={`mailto:${selected.email}`}
                    className="text-[var(--color-accent)] hover:underline"
                  >
                    {selected.email}
                  </a>
                ) : null}
                {selected.phone ? (
                  <a href={`tel:${selected.phone}`} className="text-[var(--color-accent)] hover:underline">
                    {selected.phone}
                  </a>
                ) : null}
              </div>
              {selected.subject ? (
                <p className="mt-4 text-sm font-medium text-[var(--color-text)]">
                  Objet : {selected.subject}
                </p>
              ) : null}
              <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-[var(--color-text)]">
                {selected.message}
              </p>
            </div>
          </>
        ) : null}
      </section>
    </div>
  );
}
