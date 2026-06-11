"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Point = { day: string; scans: number };

function formatDay(day: string) {
  const d = new Date(day);
  return d.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit" });
}

export function ScansAreaChart({ data }: { data: Point[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <defs>
          <linearGradient id="scanFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.35} />
            <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid
          strokeDasharray="3 3"
          vertical={false}
          stroke="var(--border)"
        />
        <XAxis
          dataKey="day"
          tickFormatter={formatDay}
          tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
          tickLine={false}
          axisLine={false}
          minTickGap={24}
        />
        <YAxis
          allowDecimals={false}
          width={32}
          tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          contentStyle={{
            borderRadius: 10,
            border: "1px solid var(--border)",
            background: "var(--popover)",
            fontSize: 12,
          }}
          labelFormatter={(l) =>
            new Date(l as string).toLocaleDateString("de-DE", {
              weekday: "short",
              day: "2-digit",
              month: "short",
            })
          }
          formatter={(v) => [v as number, "Scans"]}
        />
        <Area
          type="monotone"
          dataKey="scans"
          stroke="var(--chart-1)"
          strokeWidth={2}
          fill="url(#scanFill)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
