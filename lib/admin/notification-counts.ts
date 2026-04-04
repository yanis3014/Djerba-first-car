import { createSupabaseServerClient } from "@/lib/supabase";

export async function getAdminNotificationCounts(): Promise<{
  newLeads: number;
  unreadMessages: number;
}> {
  try {
    const supabase = createSupabaseServerClient();

    const [leadsResult, messagesResult] = await Promise.all([
      supabase
        .from("leads")
        .select("id", { count: "exact", head: true })
        .eq("status", "new")
        .eq("archived", false),
      supabase
        .from("messages")
        .select("id", { count: "exact", head: true })
        .eq("is_read", false),
    ]);

    return {
      newLeads: leadsResult.count ?? 0,
      unreadMessages: messagesResult.count ?? 0,
    };
  } catch {
    return { newLeads: 0, unreadMessages: 0 };
  }
}
