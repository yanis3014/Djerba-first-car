import { CsvExportButton } from "@/components/admin/CsvExportButton";
import { MessagesInbox } from "@/components/admin/MessagesInbox";
import { asCsvRows } from "@/lib/csv";
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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-[var(--font-display)] text-3xl text-[var(--color-text)]">Messages</h1>
          <p className="mt-1 text-sm text-[var(--color-muted)]">
            Boîte de réception — messages reçus via la page contact.
          </p>
        </div>
        {!fetchError ? (
          <CsvExportButton
            rows={asCsvRows(messages)}
            filename="djerba-messages.csv"
            className="shrink-0"
          />
        ) : null}
      </div>

      {fetchError ? (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Table <code className="rounded bg-amber-100 px-1">messages</code> indisponible ou RLS : {fetchError}
        </p>
      ) : (
        <MessagesInbox messages={messages} />
      )}
    </div>
  );
}
