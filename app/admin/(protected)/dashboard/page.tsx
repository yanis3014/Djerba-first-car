import { getAllCars } from "@/lib/cars";
import { createSupabaseServerClient } from "@/lib/supabase";
import type { Car, Lead } from "@/lib/types";
import dynamic from "next/dynamic";
import {
  Car as CarIcon,
  Eye,
  ExternalLink,
  MessageSquare,
  Pencil,
  UserPlus,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { Suspense } from "react";

function ChartSkeleton() {
  return (
    <div className="h-[320px] w-full animate-pulse rounded-xl bg-[var(--color-bg-alt)]" aria-hidden />
  );
}

const DashboardCarsChart = dynamic(
  () => import("@/components/admin/DashboardCarsChart").then((m) => m.DashboardCarsChart),
  { loading: () => <ChartSkeleton />, ssr: true },
);

function formatPrice(n: number) {
  return new Intl.NumberFormat("fr-TN", { style: "currency", currency: "TND", maximumFractionDigits: 0 }).format(n);
}

function formatDashboardDate(d: Date): string {
  const s = new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(d);
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function formatLeadRelativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  const now = Date.now();
  const diffMs = Math.max(0, now - then);
  const diffMin = Math.floor(diffMs / 60_000);
  const diffH = Math.floor(diffMs / 3_600_000);
  const diffDays = Math.floor(diffMs / 86_400_000);
  if (diffMin < 60) {
    const m = Math.max(1, diffMin);
    return `il y a ${m} min`;
  }
  if (diffH < 24) return `il y a ${diffH}h`;
  if (diffDays < 7) return `il y a ${diffDays} jours`;
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));
}

const leadTypeLabel: Record<Lead["type"], string> = {
  buy: "Achat",
  sell: "Vente",
  exchange: "Échange",
  info: "Infos",
};

const carStatusLabel: Record<Car["status"], string> = {
  available: "Disponible",
  reserved: "Réservé",
  sold: "Vendu",
};

async function countLeadsNonArchived(): Promise<number> {
  try {
    const supabase = createSupabaseServerClient();
    const { count, error } = await supabase
      .from("leads")
      .select("id", { count: "exact", head: true })
      .eq("archived", false);
    if (error) return 0;
    return count ?? 0;
  } catch {
    return 0;
  }
}

async function countNewLeads(): Promise<number> {
  try {
    const supabase = createSupabaseServerClient();
    const { count, error } = await supabase
      .from("leads")
      .select("id", { count: "exact", head: true })
      .eq("archived", false)
      .eq("status", "new");
    if (error) return 0;
    return count ?? 0;
  } catch {
    return 0;
  }
}

async function countLeadsInRange(fromIso: string, toIsoExclusive?: string): Promise<number> {
  try {
    const supabase = createSupabaseServerClient();
    let q = supabase
      .from("leads")
      .select("id", { count: "exact", head: true })
      .eq("archived", false)
      .gte("created_at", fromIso);
    if (toIsoExclusive) q = q.lt("created_at", toIsoExclusive);
    const { count, error } = await q;
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

async function fetchRecentLeads(limit: number): Promise<Lead[]> {
  try {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .eq("archived", false)
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error || !data) return [];
    return data as Lead[];
  } catch {
    return [];
  }
}

export default async function AdminDashboardPage() {
  const now = new Date();
  const sevenDaysAgoIso = new Date(now.getTime() - 7 * 86_400_000).toISOString();
  const fourteenDaysAgoIso = new Date(now.getTime() - 14 * 86_400_000).toISOString();

  const [
    cars,
    leadsTotal,
    leadsThisWeek,
    leadsPrevWeek,
    newLeadsCount,
    { total: msgTotal, unread: msgUnread },
    recentLeads,
  ] = await Promise.all([
    getAllCars(),
    countLeadsNonArchived(),
    countLeadsInRange(sevenDaysAgoIso),
    countLeadsInRange(fourteenDaysAgoIso, sevenDaysAgoIso),
    countNewLeads(),
    countMessages(),
    fetchRecentLeads(5),
  ]);

  const totalViews = cars.reduce((s, c) => s + c.views, 0);
  const availableCount = cars.filter((c) => c.status === "available").length;
  const reservedCount = cars.filter((c) => c.status === "reserved").length;
  const soldCount = cars.filter((c) => c.status === "sold").length;
  const stockTotal = cars.length;
  const pct = (n: number) => (stockTotal === 0 ? 0 : Math.round((n / stockTotal) * 1000) / 10);

  const chartData = [...cars]
    .sort((a, b) => b.views - a.views)
    .slice(0, 8)
    .map((c) => ({
      name: `${c.brand} ${c.model}`.slice(0, 22),
      views: c.views,
    }));

  const top5MostViewed = [...cars].sort((a, b) => b.views - a.views).slice(0, 5);
  const recentlyAdded = [...cars].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 3);

  const leadTrendDelta = leadsThisWeek - leadsPrevWeek;

  return (
    <div className="space-y-10">
      {/* Page header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-[var(--font-display)] text-3xl text-[var(--color-text)]">Tableau de bord</h1>
          <p className="mt-1 text-[var(--color-muted)]">{formatDashboardDate(now)}</p>
        </div>
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-[var(--color-accent)] underline-offset-4 hover:underline"
        >
          Voir le site →
        </Link>
      </div>

      {/* KPI row */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          icon={<CarIcon className="h-5 w-5" aria-hidden />}
          value={cars.length}
          label="Voitures"
          hint={`${availableCount} disponibles`}
        />
        <KpiCard
          icon={<Eye className="h-5 w-5" aria-hidden />}
          value={totalViews}
          label="Vues (total)"
          hint="toutes fiches"
        />
        <KpiCard
          icon={<UserPlus className="h-5 w-5" aria-hidden />}
          value={leadsTotal}
          label="Leads"
          hint="non archivés"
          trend={
            leadTrendDelta > 0
              ? { tone: "up", text: `+${leadTrendDelta} cette semaine` }
              : leadTrendDelta < 0
                ? { tone: "down", text: `${leadTrendDelta} cette semaine` }
                : { tone: "flat", text: "Stable vs semaine précédente" }
          }
        />
        <KpiCard
          icon={<MessageSquare className="h-5 w-5" aria-hidden />}
          value={msgUnread}
          label="Messages non lus"
          hint={`${msgTotal} messages au total`}
        />
      </div>

      {/* Stock status band */}
      <section className="rounded-2xl border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-card)]">
        <h2 className="font-[var(--font-display)] text-lg text-[var(--color-text)]">Répartition du stock</h2>
        <p className="mt-0.5 text-sm text-[var(--color-muted)]">Proportion des véhicules par statut.</p>
        <div className="mt-5 flex h-4 w-full overflow-hidden rounded-full bg-[var(--color-bg-alt)]">
          {stockTotal === 0 ? (
            <div className="h-full w-full bg-[var(--color-border)]" />
          ) : (
            <>
              <div
                className="h-full min-w-0 bg-emerald-500 transition-[flex-grow]"
                style={{ flex: availableCount }}
                title="Disponibles"
              />
              <div
                className="h-full min-w-0 bg-amber-400 transition-[flex-grow]"
                style={{ flex: reservedCount }}
                title="Réservés"
              />
              <div
                className="h-full min-w-0 bg-red-500 transition-[flex-grow]"
                style={{ flex: soldCount }}
                title="Vendus"
              />
            </>
          )}
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="flex items-center gap-2 text-sm">
            <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-500" aria-hidden />
            <span className="text-[var(--color-text)]">
              Disponibles <span className="font-medium">{availableCount}</span>{" "}
              <span className="text-[var(--color-muted)]">({pct(availableCount)}%)</span>
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-amber-400" aria-hidden />
            <span className="text-[var(--color-text)]">
              Réservés <span className="font-medium">{reservedCount}</span>{" "}
              <span className="text-[var(--color-muted)]">({pct(reservedCount)}%)</span>
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-red-500" aria-hidden />
            <span className="text-[var(--color-text)]">
              Vendus <span className="font-medium">{soldCount}</span>{" "}
              <span className="text-[var(--color-muted)]">({pct(soldCount)}%)</span>
            </span>
          </div>
        </div>
      </section>

      {/* Two columns: chart + leads */}
      <div className="grid gap-6 lg:grid-cols-5">
        <div className="rounded-2xl border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-card)] lg:col-span-3">
          <h2 className="font-[var(--font-display)] text-xl text-[var(--color-text)]">Vues par véhicule</h2>
          <p className="mt-0.5 text-sm text-[var(--color-muted)]">Top 8 du catalogue par nombre de vues.</p>
          <div className="mt-4">
            <Suspense fallback={<ChartSkeleton />}>
              <DashboardCarsChart data={chartData} />
            </Suspense>
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-card)] lg:col-span-2">
          <h2 className="font-[var(--font-display)] text-xl text-[var(--color-text)]">Derniers leads</h2>
          <p className="mt-0.5 text-sm text-[var(--color-muted)]">
            {newLeadsCount > 0 ? `${newLeadsCount} nouveau(x) en attente` : "Aucun lead « nouveau » en attente"}
          </p>
          <ul className="mt-4 space-y-3">
            {recentLeads.length === 0 ? (
              <li className="text-sm text-[var(--color-muted)]">Aucun lead récent.</li>
            ) : (
              recentLeads.map((lead) => (
                <li
                  key={lead.id}
                  className="flex flex-col gap-1.5 border-b border-[var(--color-border)] pb-3 last:border-0 last:pb-0"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium text-[var(--color-text)]">{lead.name}</span>
                    <LeadStatusBadge status={lead.status} />
                    <span className="rounded-full bg-[var(--color-bg-alt)] px-2 py-0.5 text-xs text-[var(--color-muted)]">
                      {leadTypeLabel[lead.type]}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-[var(--color-muted)]">
                    <a href={`tel:${lead.phone.replace(/\s/g, "")}`} className="text-[var(--color-accent)] hover:underline">
                      {lead.phone}
                    </a>
                    <span>{formatLeadRelativeTime(lead.created_at)}</span>
                    <LeadStatusDot status={lead.status} />
                  </div>
                </li>
              ))
            )}
          </ul>
          <Link
            href="/admin/leads"
            className="mt-5 inline-flex text-sm font-medium text-[var(--color-accent)] underline-offset-4 hover:underline"
          >
            Voir tous les leads →
          </Link>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-card)]">
          <h2 className="font-[var(--font-display)] text-xl text-[var(--color-text)]">Voitures récemment ajoutées</h2>
          <p className="mt-0.5 text-sm text-[var(--color-muted)]">Les 3 dernières entrées du catalogue.</p>
          <ul className="mt-4 space-y-4">
            {recentlyAdded.length === 0 ? (
              <li className="text-sm text-[var(--color-muted)]">Aucun véhicule.</li>
            ) : (
              recentlyAdded.map((car) => (
                <li key={car.id} className="flex gap-4">
                  <div className="relative h-[60px] w-[60px] shrink-0 overflow-hidden rounded-lg bg-[var(--color-bg-alt)]">
                    {car.cover_image || car.images[0] ? (
                      <Image
                        src={car.cover_image ?? car.images[0]!}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="60px"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-[var(--color-muted)]">
                        <CarIcon className="h-6 w-6" aria-hidden />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-[var(--color-text)]">
                      {car.brand} {car.model} · {car.year}
                    </p>
                    <p className="text-sm text-[var(--color-accent)]">{formatPrice(car.price)}</p>
                    <div className="mt-1 flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-[var(--color-bg-alt)] px-2 py-0.5 text-xs font-medium text-[var(--color-text)]">
                        {carStatusLabel[car.status]}
                      </span>
                      <Link
                        href={`/admin/voitures/${car.id}`}
                        className="inline-flex items-center gap-1 text-xs font-medium text-[var(--color-muted)] hover:text-[var(--color-accent)]"
                      >
                        <Pencil className="h-3.5 w-3.5" aria-hidden />
                        Modifier
                      </Link>
                    </div>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>

        <div className="rounded-2xl border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-card)]">
          <h2 className="font-[var(--font-display)] text-xl text-[var(--color-text)]">Voitures les plus consultées</h2>
          <p className="mt-0.5 text-sm text-[var(--color-muted)]">Top 5 par nombre de vues.</p>
          <ol className="mt-4 space-y-4">
            {top5MostViewed.length === 0 ? (
              <li className="text-sm text-[var(--color-muted)]">Aucune donnée.</li>
            ) : (
              top5MostViewed.map((car, i) => (
                <li key={car.id} className="flex items-start gap-3">
                  <span className="font-[var(--font-display)] text-2xl leading-none text-[var(--color-accent)]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-[var(--color-text)]">
                      {car.brand} {car.model}
                    </p>
                    <p className="mt-0.5 flex items-center gap-1.5 text-sm text-[var(--color-muted)]">
                      <Eye className="h-3.5 w-3.5 shrink-0" aria-hidden />
                      {car.views} vues
                    </p>
                    <Link
                      href={`/voitures/${car.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-[var(--color-accent)] hover:underline"
                    >
                      Voir la fiche
                      <ExternalLink className="h-3 w-3" aria-hidden />
                    </Link>
                  </div>
                </li>
              ))
            )}
          </ol>
        </div>
      </div>
    </div>
  );
}

function KpiCard({
  icon,
  value,
  label,
  hint,
  trend,
}: {
  icon: ReactNode;
  value: number;
  label: string;
  hint: string;
  trend?: { tone: "up" | "down" | "flat"; text: string };
}) {
  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-card)]">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">{icon}</div>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-muted)]">{label}</p>
          <p className="mt-1 font-[var(--font-display)] text-3xl font-medium tabular-nums leading-none text-[var(--color-text)]">
            {value}
          </p>
          <p className="mt-1.5 text-xs text-[var(--color-muted)]">{hint}</p>
          {trend ? (
            <p
              className={
                trend.tone === "up"
                  ? "mt-2 text-xs font-medium text-emerald-600"
                  : trend.tone === "down"
                    ? "mt-2 text-xs font-medium text-red-600"
                    : "mt-2 text-xs font-medium text-[var(--color-muted)]"
              }
            >
              {trend.text}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function LeadStatusBadge({ status }: { status: Lead["status"] }) {
  if (status === "new") {
    return <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800">Nouveau</span>;
  }
  if (status === "contacted") {
    return <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-900">Contacté</span>;
  }
  return <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-900">Clôturé</span>;
}

function LeadStatusDot({ status }: { status: Lead["status"] }) {
  const cls =
    status === "new" ? "bg-red-500" : status === "contacted" ? "bg-amber-400" : "bg-emerald-500";
  return <span className={`inline-block h-2 w-2 shrink-0 rounded-full ${cls}`} title={status} aria-hidden />;
}
