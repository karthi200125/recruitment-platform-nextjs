"use client";

import { ReactNode } from "react";
import { ColumnDef } from "@tanstack/react-table";

import DashboardTableHeader from "./DashboardTableHeader";
import DashboardSearch from "./DashboardSearch";
import DashboardFilters, { DashboardFilterItem } from "./DashboardFilters";
import DashboardDataTable from "./DashboardDataTable";
import DashboardPagination from "./DashboardPagination";

interface DashboardTableViewProps<TData, TValue> {
    title: string;
    description?: string;
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    search: string;
    onSearchChange: (value: string) => void;
    searchPlaceholder?: string;
    filters?: DashboardFilterItem[];
    onFilterChange?: (key: string, value: string) => void;
    action?: ReactNode;
    isLoading?: boolean;
    className?: string;
    emptyTitle?: string;
    emptyDescription?: string;
    page: number;
    totalPages: number;
    totalItems: number;
    pageSize: number;
    onPageChange: (page: number) => void;
}

const DashboardTableView = <TData, TValue>({
    title,
    description,
    columns,
    data,
    search,
    onSearchChange,
    searchPlaceholder,
    filters = [],
    onFilterChange,
    action,
    isLoading = false,
    className,
    emptyTitle,
    emptyDescription,
    page,
    totalPages,
    totalItems,
    pageSize,
    onPageChange,
}: DashboardTableViewProps<TData, TValue>) => {
    return (
        <section className={className}>
            <DashboardTableHeader title={title} description={description} action={action} />

            <div className="flex flex-col gap-4 border-b border-slate-200 bg-white px-6 py-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-1 flex-col gap-4 lg:flex-row lg:items-center">
                    <div className="w-full lg:max-w-sm">
                        <DashboardSearch
                            value={search}
                            onChange={onSearchChange}
                            placeholder={searchPlaceholder ?? `Search ${title.toLowerCase()}...`}
                        />
                    </div>

                    {filters.length > 0 && onFilterChange && (
                        <DashboardFilters filters={filters} onChange={onFilterChange} />
                    )}
                </div>
            </div>

            <div className="bg-white">
                <DashboardDataTable
                    columns={columns}
                    data={data}
                    className="rounded-none border-0 shadow-none"
                    emptyTitle={emptyTitle}
                    emptyDescription={emptyDescription}
                    isLoading={isLoading}
                />
            </div>

            <DashboardPagination
                page={page}
                totalPages={totalPages}
                totalItems={totalItems}
                pageSize={pageSize}
                onPageChange={onPageChange}
            />
        </section>
    );
};

export default DashboardTableView;