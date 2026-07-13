"use client";

import { FrankfurterRate } from "@/infra/api/frankfurter/types";
import { EmptySection } from "@/shared/utils";
import {
  Area,
  AreaChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CustomToolTip } from "./ToolTip";

export const MainChart = ({ rates }: { rates: FrankfurterRate[] }) => {
  if (rates.length === 0)
    return (
      <EmptySection
        text="Missing Historical rates. Make sure you have loaded a well known currency."
        heading="No historical rates provided"
      />
    );
  return (
    <div className="h-64 md:h-72 p-4 border border-dashed border-card rounded-lg text-foreground-secondary text-sm">
      <ResponsiveContainer width={"100%"} height={"100%"}>
        <AreaChart
          data={rates}
          responsive
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="rateGradient" x1="0" y1="0" x2="0" y2="1">
              {/* Top of the chart area: higher opacity */}
              <stop
                offset="5%"
                stopColor="var(--color-lime-500)"
                stopOpacity={0.25}
              />
              {/* Bottom of the chart area: completely transparent fade */}
              <stop
                offset="95%"
                stopColor="var(--color-lime-500)"
                stopOpacity={0}
              />
            </linearGradient>
          </defs>
          <XAxis
            dataKey={"date"}
            axisLine={false}
            tickLine={false}
            minTickGap={40}
            tick={{ fill: "var(--color-foreground-secondary)", fontSize: 12 }}
          />
          <YAxis
            dataKey={"rate"}
            domain={["auto", "auto"]}
            axisLine={false}
            tickLine={false}
            tick={{ fill: "var(--color-foreground-secondary)", fontSize: 12 }}
          />
          <Tooltip content={<CustomToolTip />} />
          <Area
            type="monotone"
            dataKey="rate"
            stroke="var(--color-lime-500)"
            fill="url(#rateGradient)"
            dot={false}
            activeDot={{ r: 6 }}
          />
          <Legend />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
