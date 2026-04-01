import { DashboardCarsChart } from "@/components/admin/DashboardCarsChart";
import { getAllCars } from "@/lib/cars";
import { createSupabaseServerClient } from "@/lib/supabase";
async function countLeads(): Promise<number> {
  try {
    const supabase = createSupabaseServerClient();
    const { count, error } = await supabase.from("leads").select("id", { count: "exact", head: true });
    if (error) return 0;
    return count ?? 0;
  } catch {
    return 0;
  }
}

async function countMessages(): Promise<{ total: number; unread: number }> {
  try {
    const supabase = createSupabaseServerClient();
    const { count: total, error: e1 } = await supabase.from("messages").select("id", { count: "exact", head: true });
    if (e1) return { total: 0, unread: 0 };
    const { count: unread, error: e2 } = await supabase
      .from("messages")
      .select("id", { count: "exact", head: true })
      .eq("is_read", false);
    return { total: total ?? 0, unread: e2 ? 0 : (unread ?? 0) };
  } catch {
    return { total: 0, unread: 0 };
  }
}

function formatPrice(n: number) {
  return new Intl.NumberFormat("fr-TN", { style: "currency", currency: "TND", maximumFractionDigits: 0 }).format(n);
}

export default async function AdminDashboardPage() {
  const cars = await getAllCars();
  const leadsCount = await countLeads();
  const { total: msgTotal, unread: msgUnread } = await countMessages();

  const totalViews = cars.reduce((s, c) => s + c.views, 0);
  const available = cars.filter((c) => c.status === "available").length;
  const avgPrice =
    cars.length === 0 ? 0 : Math.round(cars.reduce((s, c) => s + c.price, 0) / cars.length);

  const chartData = [...cars]
    .sort((a, b) => b.views - a.views)
    .slice(0, 8)
    .map((c) => ({
      name: `${c.brand} ${c.model}`.slice(0, 22),
      views: c.views,
    }));

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-[var(--font-display)] text-3xl text-[var(--color-text)]">Tableau de bord</h1>
        <p className="mt-1 text-sm text-[var(--color-muted)]">Vue d’ensemble du catalogue et des contacts.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi title="Voitures" value={String(cars.length)} hint={`${available} disponibles`} />
        <Kpi title="Vues (total)" value={String(totalViews)} hint="Toutes fiches confondues" />
        <Kpi title="Leads" value={String(leadsCount)} hint="Formulaires & demandes" />
        <Kpi title="Messages" value={String(msgTotal)} hint={msgUnread ? `${msgUnread} non lus` : "Boîte contact"} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 lg:col-span-2">
          <h2 className="font-[var(--font-display)] text-xl text-[var(--color-text)]">Vues par véhicule</h2>
          <p className="mb-4 text-sm text-[var(--color-muted)]">Top 8 du catalogue.</p>
          <DashboardCarsChart data={chartData} />
        </div>
        <div className="space-y-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
          <h2 className="font-[var(--font-display)] text-xl text-[var(--color-text)]">Prix</h2>
          <p className="text-3xl font-semibold text-[var(--color-accent)]">{formatPrice(avgPrice)}</p>
          <p className="text-sm text-[var(--color-muted)]">Prix moyen affiché sur les {cars.length} fiches.</p>
        </div>
      </div>
    </div>
  );
}

function Kpi({ title, value, hint }: { title: string; value: string; hint: string }) {
  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
      <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-muted)]">{title}</p>
      <p className="mt-2 font-[var(--font-display)] text-3xl text-[var(--color-text)]">{value}</p>
      <p className="mt-1 text-xs text-[var(--color-muted)]">{hint}</p>
    </div>
  );
}
