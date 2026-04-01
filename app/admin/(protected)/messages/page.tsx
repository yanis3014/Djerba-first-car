import { createSupabaseServerClient } from "@/lib/supabase";
import type { Message } from "@/lib/types";

export default async function AdminMessagesPage() {
  let messages: Message[] = [];
  let fetchError: string | null = null;

  try {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase.from("messages").select("*").order("created_at", { ascending: false });
    if (error) {
      fetchError = error.message;
    } else if (data) {
      messages = data as Message[];
    }
  } catch (e) {
    fetchError = e instanceof Error ? e.message : "Erreur inconnue";
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-[var(--font-display)] text-3xl text-[var(--color-text)]">Messages</h1>
        <p className="mt-1 text-sm text-[var(--color-muted)]">Messages reçus via la page contact.</p>
      </div>

      {fetchError ? (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Table <code className="rounded bg-amber-100 px-1">messages</code> indisponible ou RLS : {fetchError}
        </p>
      ) : null}

      <ul className="space-y-4">
        {messages.map((msg) => (
          <li
            key={msg.id}
            className={`rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 ${
              !msg.is_read ? "ring-1 ring-[var(--color-accent)]/30" : ""
            }`}
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <span className="font-medium text-[var(--color-text)]">{msg.name}</span>
              <time className="text-xs text-[var(--color-muted)]">{new Date(msg.created_at).toLocaleString("fr-FR")}</time>
            </div>
            <div className="mt-2 flex flex-wrap gap-3 text-sm text-[var(--color-muted)]">
              {msg.email ? (
                <a href={`mailto:${msg.email}`} className="text-[var(--color-accent)] hover:underline">
                  {msg.email}
                </a>
              ) : null}
              {msg.phone ? (
                <a href={`tel:${msg.phone}`} className="text-[var(--color-accent)] hover:underline">
                  {msg.phone}
                </a>
              ) : null}
              {msg.subject ? <span className="font-medium text-[var(--color-text)]">{msg.subject}</span> : null}
              {!msg.is_read ? (
                <span className="rounded-full bg-[var(--color-accent)]/10 px-2 py-0.5 text-xs text-[var(--color-accent)]">
                  Non lu
                </span>
              ) : null}
            </div>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-[var(--color-text)]">{msg.message}</p>
          </li>
        ))}
      </ul>
      {messages.length === 0 && !fetchError ? (
        <p className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-10 text-center text-sm text-[var(--color-muted)]">
          Aucun message.
        </p>
      ) : null}
    </div>
  );
}
