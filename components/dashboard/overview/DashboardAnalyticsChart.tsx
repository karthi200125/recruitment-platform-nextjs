"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  Tooltip,
} from "recharts";

interface DashboardAnalyticsChartProps {
  title: string;

  data: {
    name: string;
    value: number;
  }[];
}

const DashboardAnalyticsChart = ({
  title,
  data,
}: DashboardAnalyticsChartProps) => {
  return (
    <Card className="rounded-2xl border border-slate-200 shadow-none">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold text-slate-800">
          {title}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="h-[260px] w-full">
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <AreaChart data={data}>
              <XAxis
                dataKey="name"
                tickLine={false}
                axisLine={false}
                fontSize={12}
              />

              <Tooltip />

              <Area
                type="monotone"
                dataKey="value"
                strokeWidth={2}
                fillOpacity={0.15}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardAnalyticsChart;