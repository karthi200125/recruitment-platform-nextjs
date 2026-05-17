"use client";

import Link from "next/link";

import { ArrowRight } from "lucide-react";

import {
  ColumnDef,
} from "@tanstack/react-table";

import DashboardJobsTable from "../tables/DashboardJobsTable";

interface DashboardOverviewSectionProps<
  TData,
  TValue,
> {
  title: string;

  href: string;

  columns: ColumnDef<TData, TValue>[];

  data: TData[];

  emptyTitle?: string;

  emptyDescription?: string;
}

const DashboardOverviewSection = <
  TData,
  TValue,
>({
  title,
  href,
  columns,
  data,
  emptyTitle = "No data found",
  emptyDescription = "No records available.",
}: DashboardOverviewSectionProps<
  TData,
  TValue
>) => {
  return (
    <section className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-bold text-slate-900">
            {title}
          </h2>

          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-500">
            {data.length}
          </span>
        </div>

        <Link
          href={href}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 transition-colors duration-200 hover:text-indigo-700"
        >
          View all

          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Table */}
      <DashboardJobsTable
        columns={columns}
        data={data.slice(0, 5)}
        emptyTitle={emptyTitle}
        emptyDescription={emptyDescription}
      />
    </section>
  );
};

export default DashboardOverviewSection;