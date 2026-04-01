"use client";

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function DashboardCarsChart({ data }: { data: { name: string; views: number }[] }) {
  if (data.length === 0) {
    return <p className="text-sm text-[var(--color-muted)]">Aucune donnée de vues à afficher.</p>;
  }

  return (
    <div className="h-[320px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 48 }}>
          <XAxis
            dataKey="name"
            tick={{ fontSize: 10, fill: "var(--color-muted)" }}
            interval={0}
            angle={-22}
            textAnchor="end"
            height={56}
          />
          <YAxis tick={{ fontSize: 11, fill: "var(--color-muted)" }} allowDecimals={false} />
          <Tooltip
            contentStyle={{
              borderRadius: "8px",
              border: "1px solid var(--color-border)",
              fontSize: "13px",
            }}
          />
          <Bar dataKey="views" fill="var(--color-accent)" radius={[6, 6, 0, 0]} name="Vues" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
