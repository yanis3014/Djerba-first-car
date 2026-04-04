import { getAllCars } from "@/lib/cars";
import { createSupabaseServerClient } from "@/lib/supabase";
import type { Car, Lead, Message } from "@/lib/types";
import {
  ArrowLeftRight,
  ArrowRight,
  Banknote,
  Car as CarIcon,
  Eye,
  Fuel,
  Info,
  Pencil,
  ShoppingCart,
  Target,
  TrendingUp,
  UserPlus,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

function formatPrice(n: number) {
  return new Intl.NumberFormat("fr-TN", { style: "currency", currency: "TND", maximumFractionDigits: 0 }).format(n);
}

function formatHeaderDate(d: Date): string {
  const s = new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function formatKm(n: number) {
  return `${new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(Math.round(n))} km`;
}

const statusLabel: Record<Car["status"], string> = {
  available: "Disponible",
  sold: "Vendu",
  reserved: "Réservé",
};

async function fetchLeads(): Promise<Lead[]> {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) return [];
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase.from("leads").select("*").eq("archived", false);
    if (error || !data) return [];
    return data as Lead[];
  } catch {
    return [];
  }
}

async function fetchMessages(): Promise<Message[]> {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) return [];
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase.from("messages").select("*");
    if (error || !data) return [];
    return data as Message[];
  } catch {
    return [];
  }
}

export default async function AdminStatsPage() {
  const now = new Date();
  const [cars, leads, messages] = await Promise.all([getAllCars(), fetchLeads(), fetchMessages()]);

  const totalCars = cars.length;
  const availableCars = cars.filter((c) => c.status === "available").length;
  const soldCars = cars.filter((c) => c.status === "sold").length;
  const reservedCars = cars.filter((c) => c.status === "reserved").length;
  const featuredCars = cars.filter((c) => c.is_featured).length;

  const prices = cars.map((c) => c.price);
  const minPrice = prices.length ? Math.min(...prices) : 0;
  const maxPrice = prices.length ? Math.max(...prices) : 0;
  const averagePrice = totalCars === 0 ? 0 : Math.round(cars.reduce((s, c) => s + c.price, 0) / totalCars);
  const totalCatalogValue = cars.reduce((s, c) => s + c.price, 0);
  const averageMileage = totalCars === 0 ? 0 : Math.round(cars.reduce((s, c) => s + c.mileage, 0) / totalCars);

  const byFuelType = {
    Essence: 0,
    Diesel: 0,
    Hybride: 0,
    Electrique: 0,
  } as Record<"Essence" | "Diesel" | "Hybride" | "Electrique", number>;
  for (const c of cars) {
    if (c.fuel_type in byFuelType) byFuelType[c.fuel_type]++;
  }

  const byTransmission = { Manuelle: 0, Automatique: 0 };
  for (const c of cars) {
    byTransmission[c.transmission]++;
  }

  const byCondition = { new: 0, used: 0 };
  for (const c of cars) {
    byCondition[c.condition]++;
  }

  const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const carsAddedThisMonth = cars.filter((c) => new Date(c.created_at) >= startOfThisMonth).length;
  const carsAddedLastMonth = cars.filter((c) => {
    const d = new Date(c.created_at);
    return d >= startOfLastMonth && d < startOfThisMonth;
  }).length;

  const topViewedCars = [...cars].sort((a, b) => b.views - a.views).slice(0, 10);

  const totalLeads = leads.length;
  const newLeads = leads.filter((l) => l.status === "new").length;
  const contactedLeads = leads.filter((l) => l.status === "contacted").length;
  const closedLeads = leads.filter((l) => l.status === "closed").length;

  const sevenDaysAgo = new Date(now.getTime() - 7 * 86_400_000);
  const fourteenDaysAgo = new Date(now.getTime() - 14 * 86_400_000);

  const leadsThisWeek = leads.filter((l) => new Date(l.created_at) >= sevenDaysAgo).length;
  const leadsLastWeek = leads.filter((l) => {
    const d = new Date(l.created_at);
    return d >= fourteenDaysAgo && d < sevenDaysAgo;
  }).length;

  const leadsThisMonth = leads.filter((l) => new Date(l.created_at) >= startOfThisMonth).length;
  const leadsLastMonth = leads.filter((l) => {
    const d = new Date(l.created_at);
    return d >= startOfLastMonth && d < startOfThisMonth;
  }).length;

  const byType = { buy: 0, sell: 0, exchange: 0, info: 0 };
  for (const l of leads) {
    byType[l.type]++;
  }

  const conversionRate = totalLeads === 0 ? 0 : (closedLeads / totalLeads) * 100;

  const totalMessages = messages.length;
  const unreadMessages = messages.filter((m) => !m.is_read).length;
  const messagesThisWeek = messages.filter((m) => new Date(m.created_at) >= sevenDaysAgo).length;

  const stockTotal = totalCars || 1;
  const pctStock = (n: number) => Math.round((n / stockTotal) * 1000) / 10;
  const fuelTotal = totalCars || 1;
  const pctFuel = (n: number) => Math.round((n / fuelTotal) * 1000) / 10;

  const priceSpan = maxPrice - minPrice;
  const avgMarkerPct = priceSpan <= 0 ? 50 : ((averagePrice - minPrice) / priceSpan) * 100;

  const carsMonthDelta = carsAddedThisMonth - carsAddedLastMonth;

  const fuelConfig: { key: keyof typeof byFuelType; color: string; bar: string }[] = [
    { key: "Essence", color: "text-blue-600", bar: "bg-blue-500" },
    { key: "Diesel", color: "text-gray-600", bar: "bg-gray-500" },
    { key: "Hybride", color: "text-green-600", bar: "bg-green-500" },
    { key: "Electrique", color: "text-teal-600", bar: "bg-teal-500" },
  ];

  const leadTypeConfig: {
    key: keyof typeof byType;
    label: string;
    icon: ReactNode;
    accent: string;
    bar: string;
  }[] = [
    {
      key: "buy",
      label: "Achat",
      icon: <ShoppingCart className="h-4 w-4 text-blue-600" aria-hidden />,
      accent: "text-blue-600",
      bar: "bg-blue-500",
    },
    {
      key: "sell",
      label: "Vente",
      icon: <Banknote className="h-4 w-4 text-emerald-600" aria-hidden />,
      accent: "text-emerald-600",
      bar: "bg-emerald-500",
    },
    {
      key: "exchange",
      label: "Échange",
      icon: <ArrowLeftRight className="h-4 w-4 text-amber-600" aria-hidden />,
      accent: "text-amber-600",
      bar: "bg-amber-500",
    },
    {
      key: "info",
      label: "Info",
      icon: <Info className="h-4 w-4 text-gray-500" aria-hidden />,
      accent: "text-gray-600",
      bar: "bg-gray-400",
    },
  ];

  return (
    <div className="space-y-10">
      {/* SECTION 1 — HEADER */}
      <header>
        <h1 className="font-[var(--font-display)] text-3xl text-[var(--color-text)]">Statistiques</h1>
        <p className="mt-1 text-sm text-[var(--color-muted)]">
          Données en temps réel du catalogue et des contacts.
        </p>
        <p className="mt-2 text-sm text-[var(--color-muted)]">{formatHeaderDate(now)}</p>
      </header>

      {/* SECTION 2 — KPI */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatsKpiCard
          icon={<CarIcon className="h-5 w-5" aria-hidden />}
          value={totalCars}
          label="Total voitures en stock"
          hint={`${availableCars} disponibles · ${featuredCars} en avant`}
        />
        <StatsKpiCard
          icon={<TrendingUp className="h-5 w-5" aria-hidden />}
          value={formatPrice(totalCatalogValue)}
          label="Valeur catalogue"
          hint="Somme des prix affichés"
          valueIsString
        />
        <StatsKpiCard
          icon={<UserPlus className="h-5 w-5" aria-hidden />}
          value={totalLeads}
          label="Total leads"
          hint={leadsThisMonth === 0 ? "Aucun ce mois" : `+${leadsThisMonth} ce mois`}
        />
        <StatsKpiCard
          icon={<Target className="h-5 w-5" aria-hidden />}
          value={totalLeads === 0 ? "—" : `${conversionRate.toFixed(1)}%`}
          label="Taux de conversion"
          hint={totalLeads === 0 ? "Aucun lead" : `${closedLeads} clôturés / ${totalLeads}`}
          valueIsString
        />
      </div>

      {/* SECTION 3 — STOCK */}
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-card)]">
          <h2 className="mb-1 font-[var(--font-display)] text-xl text-[var(--color-text)]">Répartition du stock</h2>
          <p className="text-sm text-[var(--color-muted)]">Répartition par statut et par carburant.</p>

          <div className="mt-6 flex h-5 w-full overflow-hidden rounded-full bg-[var(--color-bg-alt)]">
            {totalCars === 0 ? (
              <div className="h-full w-full bg-[var(--color-border)]" />
            ) : (
              <>
                <div
                  className="h-full min-w-0 bg-emerald-500"
                  style={{ flex: availableCars }}
                  title={`Disponibles : ${availableCars} (${pctStock(availableCars)}%)`}
                />
                <div
                  className="h-full min-w-0 bg-amber-400"
                  style={{ flex: reservedCars }}
                  title={`Réservés : ${reservedCars} (${pctStock(reservedCars)}%)`}
                />
                <div
                  className="h-full min-w-0 bg-red-500"
                  style={{ flex: soldCars }}
                  title={`Vendus : ${soldCars} (${pctStock(soldCars)}%)`}
                />
              </>
            )}
          </div>

          <div className="mt-4 space-y-2.5">
            <div className="flex items-center gap-2 text-sm">
              <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-500" aria-hidden />
              <span className="flex-1 text-[var(--color-text)]">Disponibles</span>
              <span className="font-medium tabular-nums">{availableCars}</span>
              <span className="text-[var(--color-muted)]">({pctStock(availableCars)}%)</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-amber-400" aria-hidden />
              <span className="flex-1 text-[var(--color-text)]">Réservés</span>
              <span className="font-medium tabular-nums">{reservedCars}</span>
              <span className="text-[var(--color-muted)]">({pctStock(reservedCars)}%)</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-red-500" aria-hidden />
              <span className="flex-1 text-[var(--color-text)]">Vendus</span>
              <span className="font-medium tabular-nums">{soldCars}</span>
              <span className="text-[var(--color-muted)]">({pctStock(soldCars)}%)</span>
            </div>
          </div>

          <div className="my-6 border-t border-[var(--color-border)]" />

          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">Carburant</p>
          <ul className="mt-3 space-y-3">
            {fuelConfig.map(({ key, color, bar }) => {
              const n = byFuelType[key];
              const w = pctFuel(n);
              return (
                <li key={key} className="flex items-center gap-3">
                  <Fuel className={cn("h-4 w-4 shrink-0", color)} aria-hidden />
                  <span className={cn("w-24 shrink-0 text-sm font-medium", color)}>{key}</span>
                  <div className="min-w-0 flex-1">
                    <div className="h-2 overflow-hidden rounded-full bg-[var(--color-bg-alt)]">
                      <div className={cn("h-full rounded-full transition-[width]", bar)} style={{ width: `${w}%` }} />
                    </div>
                  </div>
                  <span className="w-10 shrink-0 text-right text-sm tabular-nums text-[var(--color-text)]">{n}</span>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="rounded-2xl border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-card)]">
          <h2 className="mb-1 font-[var(--font-display)] text-xl text-[var(--color-text)]">
            Caractéristiques du stock
          </h2>
          <p className="text-sm text-[var(--color-muted)]">Prix, usage et rythme d’ajout.</p>

          <div className="mt-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">Fourchette de prix</p>
            <p className="mt-1 text-sm text-[var(--color-text)]">
              {formatPrice(minPrice)} → {formatPrice(maxPrice)}
            </p>
            <div className="relative mt-4 h-10">
              <div className="absolute inset-x-0 top-1/2 h-2 -translate-y-1/2 rounded-full bg-[var(--color-bg-alt)]" />
              <div
                className="absolute top-1/2 z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
                style={{ left: `${avgMarkerPct}%` }}
              >
                <span className="h-3 w-3 rounded-full border-2 border-[var(--color-accent)] bg-white shadow-sm" />
                <span className="mt-1 whitespace-nowrap text-[10px] font-medium text-[var(--color-accent)]">Moy.</span>
              </div>
              <span className="absolute left-0 top-[calc(50%+10px)] text-[10px] text-[var(--color-muted)]">Min</span>
              <span className="absolute right-0 top-[calc(50%+10px)] text-[10px] text-[var(--color-muted)]">Max</span>
            </div>
            <p className="mt-6 text-center text-sm text-[var(--color-muted)]">
              Prix moyen : <span className="font-semibold text-[var(--color-text)]">{formatPrice(averagePrice)}</span>
            </p>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="rounded-xl bg-[var(--color-bg-alt)] p-4 text-center">
              <p className="font-[var(--font-display)] text-3xl tabular-nums text-[var(--color-text)]">
                {byTransmission.Manuelle}
              </p>
              <p className="mt-1 text-xs font-medium uppercase tracking-wide text-[var(--color-muted)]">Manuelle</p>
            </div>
            <div className="rounded-xl bg-[var(--color-bg-alt)] p-4 text-center">
              <p className="font-[var(--font-display)] text-3xl tabular-nums text-[var(--color-text)]">
                {byTransmission.Automatique}
              </p>
              <p className="mt-1 text-xs font-medium uppercase tracking-wide text-[var(--color-muted)]">Automatique</p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-[var(--color-border)] p-4 text-center">
              <p className="font-[var(--font-display)] text-3xl tabular-nums text-[var(--color-text)]">{byCondition.new}</p>
              <p className="mt-1 text-xs font-medium text-[var(--color-muted)]">Neuf</p>
            </div>
            <div className="rounded-xl border border-[var(--color-border)] p-4 text-center">
              <p className="font-[var(--font-display)] text-3xl tabular-nums text-[var(--color-text)]">{byCondition.used}</p>
              <p className="mt-1 text-xs font-medium text-[var(--color-muted)]">Occasion</p>
            </div>
          </div>

          <div className="mt-6 rounded-xl bg-[var(--color-bg-alt)] p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">Kilométrage moyen</p>
            <p className="mt-1 font-[var(--font-display)] text-2xl text-[var(--color-text)]">{formatKm(averageMileage)}</p>
          </div>

          <div className="mt-4 flex flex-wrap items-baseline justify-between gap-2 border-t border-[var(--color-border)] pt-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">Ajouts ce mois</p>
              <p className="mt-1 font-[var(--font-display)] text-2xl tabular-nums text-[var(--color-text)]">
                {carsAddedThisMonth}
              </p>
            </div>
            <p
              className={cn(
                "text-sm font-medium",
                carsMonthDelta > 0 ? "text-emerald-600" : carsMonthDelta < 0 ? "text-red-600" : "text-[var(--color-muted)]",
              )}
            >
              {carsMonthDelta > 0
                ? `↑ +${carsMonthDelta} vs mois dernier`
                : carsMonthDelta < 0
                  ? `↓ ${carsMonthDelta} vs mois dernier`
                  : "= mois dernier"}
            </p>
          </div>
        </section>
      </div>

      {/* SECTION 4 — LEADS */}
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-card)]">
          <h2 className="mb-1 font-[var(--font-display)] text-xl text-[var(--color-text)]">Activité des leads</h2>
          <p className="text-sm text-[var(--color-muted)]">Volumes et statuts sur la période.</p>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-xl bg-[var(--color-bg-alt)] p-4">
            <div className="min-w-0 flex-1 text-center">
              <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-muted)]">Cette semaine</p>
              <p className="mt-1 font-[var(--font-display)] text-3xl tabular-nums text-[var(--color-text)]">
                {leadsThisWeek}
              </p>
            </div>
            <ArrowRight className="h-5 w-5 shrink-0 text-[var(--color-muted)]" aria-hidden />
            <div className="min-w-0 flex-1 text-center">
              <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-muted)]">Semaine dernière</p>
              <p className="mt-1 font-[var(--font-display)] text-3xl tabular-nums text-[var(--color-text)]">
                {leadsLastWeek}
              </p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-[var(--color-border)] p-4">
            <div className="min-w-0 flex-1 text-center">
              <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-muted)]">Ce mois</p>
              <p className="mt-1 font-[var(--font-display)] text-3xl tabular-nums text-[var(--color-text)]">
                {leadsThisMonth}
              </p>
            </div>
            <ArrowRight className="h-5 w-5 shrink-0 text-[var(--color-muted)]" aria-hidden />
            <div className="min-w-0 flex-1 text-center">
              <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-muted)]">Mois dernier</p>
              <p className="mt-1 font-[var(--font-display)] text-3xl tabular-nums text-[var(--color-text)]">
                {leadsLastMonth}
              </p>
            </div>
          </div>

          <p className="mb-2 mt-8 text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">Par statut</p>
          <ul className="space-y-3">
            {[
              { label: "Nouveau", count: newLeads, dot: "bg-red-500", bar: "bg-red-400" },
              { label: "Contacté", count: contactedLeads, dot: "bg-amber-400", bar: "bg-amber-400" },
              { label: "Clôturé", count: closedLeads, dot: "bg-emerald-500", bar: "bg-emerald-500" },
            ].map((row) => {
              const pct = totalLeads === 0 ? 0 : Math.round((row.count / totalLeads) * 1000) / 10;
              return (
                <li key={row.label}>
                  <div className="flex items-center gap-2 text-sm">
                    <span className={cn("h-2 w-2 shrink-0 rounded-full", row.dot)} aria-hidden />
                    <span className="flex-1 text-[var(--color-text)]">{row.label}</span>
                    <span className="tabular-nums font-medium">{row.count}</span>
                    <span className="w-10 text-right text-[var(--color-muted)]">{pct}%</span>
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-[var(--color-bg-alt)]">
                    <div className={cn("h-full rounded-full", row.bar)} style={{ width: `${pct}%` }} />
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="rounded-2xl border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-card)]">
          <h2 className="mb-1 font-[var(--font-display)] text-xl text-[var(--color-text)]">Répartition par type</h2>
          <p className="text-sm text-[var(--color-muted)]">Origine des demandes.</p>

          <ul className="mt-6 space-y-4">
            {leadTypeConfig.map(({ key, label, icon, accent, bar }) => {
              const n = byType[key];
              const pct = totalLeads === 0 ? 0 : Math.round((n / totalLeads) * 1000) / 10;
              return (
                <li key={key} className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-2">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--color-bg-alt)]">
                      {icon}
                    </span>
                    <span className={cn("flex-1 font-medium", accent)}>{label}</span>
                    <span className="tabular-nums text-[var(--color-text)]">{n}</span>
                    <span className="w-12 text-right text-sm text-[var(--color-muted)]">{pct}%</span>
                  </div>
                  <div className="ml-11 h-2 overflow-hidden rounded-full bg-[var(--color-bg-alt)]">
                    <div className={cn("h-full rounded-full", bar)} style={{ width: `${pct}%` }} />
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      </div>

      {/* SECTION 5 — TOP VOITURES */}
      <section className="rounded-2xl border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-card)]">
        <h2 className="mb-1 font-[var(--font-display)] text-xl text-[var(--color-text)]">Voitures les plus consultées</h2>
        <p className="text-sm text-[var(--color-muted)]">Classement par nombre de vues sur le site.</p>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)] text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">
                <th className="pb-3 pr-4">Rang</th>
                <th className="pb-3 pr-4">Aperçu</th>
                <th className="pb-3 pr-4">Véhicule</th>
                <th className="pb-3 pr-4">Statut</th>
                <th className="pb-3 pr-4">Prix</th>
                <th className="pb-3 pr-4">Vues</th>
                <th className="pb-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {topViewedCars.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-[var(--color-muted)]">
                    Aucun véhicule dans le catalogue.
                  </td>
                </tr>
              ) : (
                topViewedCars.map((car, i) => (
                  <tr
                    key={car.id}
                    className={cn(
                      "border-b border-[var(--color-border)] last:border-0",
                      i === 0 && "bg-amber-50/50",
                    )}
                  >
                    <td
                      className={cn(
                        "py-3 pr-4 align-middle",
                        i === 0 && "border-l-4 border-l-amber-400 pl-2",
                      )}
                    >
                      <span className="font-[var(--font-display)] text-2xl leading-none text-[var(--color-accent)]">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </td>
                    <td className="py-3 pr-4 align-middle">
                      <div className="relative h-10 w-10 overflow-hidden rounded-md bg-[var(--color-bg-alt)]">
                        {car.cover_image || car.images[0] ? (
                          <Image
                            src={car.cover_image ?? car.images[0]!}
                            alt=""
                            width={40}
                            height={40}
                            className="h-10 w-10 object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <CarIcon className="h-4 w-4 text-[var(--color-muted)]" aria-hidden />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-3 pr-4 align-middle font-medium text-[var(--color-text)]">
                      {car.brand} {car.model} {car.year}
                    </td>
                    <td className="py-3 pr-4 align-middle">
                      <span className="rounded-full bg-[var(--color-bg-alt)] px-2 py-0.5 text-xs font-medium">
                        {statusLabel[car.status]}
                      </span>
                    </td>
                    <td className="py-3 pr-4 align-middle tabular-nums">{formatPrice(car.price)}</td>
                    <td className="py-3 pr-4 align-middle">
                      <span className="inline-flex items-center gap-1 text-[var(--color-muted)]">
                        <Eye className="h-3.5 w-3.5" aria-hidden />
                        {car.views}
                      </span>
                    </td>
                    <td className="py-3 align-middle">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/voitures/${car.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex rounded-lg p-1.5 text-[var(--color-muted)] hover:bg-[var(--color-bg-alt)] hover:text-[var(--color-accent)]"
                          aria-label="Voir la fiche publique"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        <Link
                          href={`/admin/voitures/${car.id}`}
                          className="inline-flex rounded-lg p-1.5 text-[var(--color-muted)] hover:bg-[var(--color-bg-alt)] hover:text-[var(--color-accent)]"
                          aria-label="Modifier"
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* SECTION 6 — MESSAGES */}
      <section className="rounded-2xl border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-card)]">
        <h2 className="mb-1 font-[var(--font-display)] text-xl text-[var(--color-text)]">Messages récents</h2>
        <p className="text-sm text-[var(--color-muted)]">Boîte de réception du formulaire contact.</p>

        <div className="mt-6 flex flex-wrap items-center gap-4 text-sm">
          <div className="flex flex-col">
            <span className="text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">Total</span>
            <span className="font-[var(--font-display)] text-2xl tabular-nums text-[var(--color-text)]">{totalMessages}</span>
          </div>
          <span className="hidden h-10 w-px bg-[var(--color-border)] sm:block" aria-hidden />
          <div className="flex flex-col">
            <span className="text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">Non lus</span>
            <span className="font-[var(--font-display)] text-2xl tabular-nums text-[var(--color-accent)]">
              {unreadMessages}
            </span>
          </div>
          <span className="hidden h-10 w-px bg-[var(--color-border)] sm:block" aria-hidden />
          <div className="flex flex-col">
            <span className="text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">Cette semaine</span>
            <span className="font-[var(--font-display)] text-2xl tabular-nums text-[var(--color-text)]">
              {messagesThisWeek}
            </span>
          </div>
        </div>

        <Link
          href="/admin/messages"
          className="mt-6 inline-flex text-sm font-medium text-[var(--color-accent)] underline-offset-4 hover:underline"
        >
          Voir tous les messages →
        </Link>
      </section>
    </div>
  );
}

function StatsKpiCard({
  icon,
  value,
  label,
  hint,
  valueIsString,
}: {
  icon: ReactNode;
  value: number | string;
  label: string;
  hint: string;
  valueIsString?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-card)]">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">{icon}</div>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-muted)]">{label}</p>
          <p
            className={cn(
              "mt-1 font-[var(--font-display)] font-medium leading-none text-[var(--color-text)]",
              valueIsString ? "text-2xl" : "text-3xl tabular-nums",
            )}
          >
            {value}
          </p>
          <p className="mt-1.5 text-xs text-[var(--color-muted)]">{hint}</p>
        </div>
      </div>
    </div>
  );
}
