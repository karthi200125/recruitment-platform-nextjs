"use client";

import { useCallback, useEffect, useState } from "react";
import { Role } from "@prisma/client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";

import { DashboardTab, DashboardPagination as PaginatedResult } from "@/types/dashboard";
import { JobApplicationWithUser, JobWithCompany, User } from "@/types";

import { DASHBOARD_TABLE_CONFIG } from "../config/dashboardTableConfig";
import { DASHBOARD_FILTERS } from "../config/dashboardFiltersConfig";
import DashboardTableView from "./DashboardTableView";
import { TAB_PAGE_PARAM } from "@/actions/dashboard/utils/tabTableKey";
import { jobApplicationColumns, jobColumns, userColumns } from "./DashboardColumns";

type AnyTableData = JobApplicationWithUser | JobWithCompany | User;

interface DashboardTableSectionProps {
    role: Role;
    activeTab: DashboardTab;
    pagination: PaginatedResult<AnyTableData>;
    isLoading?: boolean;
}

// which column set a given tab renders
const TAB_COLUMNS: Partial<Record<DashboardTab, ColumnDef<AnyTableData, unknown>[]>> = {
    applied: jobApplicationColumns as ColumnDef<AnyTableData, unknown>[],
    interviews: jobApplicationColumns as ColumnDef<AnyTableData, unknown>[],
    applicants: jobApplicationColumns as ColumnDef<AnyTableData, unknown>[],
    hired: jobApplicationColumns as ColumnDef<AnyTableData, unknown>[],
    saved: jobColumns as ColumnDef<AnyTableData, unknown>[],
    postedJobs: jobColumns as ColumnDef<AnyTableData, unknown>[],
    jobs: jobColumns as ColumnDef<AnyTableData, unknown>[],
    followers: userColumns as ColumnDef<AnyTableData, unknown>[],
    following: userColumns as ColumnDef<AnyTableData, unknown>[],
    employees: userColumns as ColumnDef<AnyTableData, unknown>[],
};

const SEARCH_DEBOUNCE_MS = 400;

const DashboardTableSection = ({ role, activeTab, pagination, isLoading = false }: DashboardTableSectionProps) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const config = DASHBOARD_TABLE_CONFIG[activeTab];
    const filterConfig = DASHBOARD_FILTERS[activeTab as keyof typeof DASHBOARD_FILTERS];
    const columns = TAB_COLUMNS[activeTab];
    const pageParamKey = TAB_PAGE_PARAM[activeTab] ?? "page";

    const urlSearch = searchParams.get("search") ?? "";
    const [searchInput, setSearchInput] = useState(urlSearch);

    // keep local input in sync if the URL changes from elsewhere (e.g. tab switch reset)
    useEffect(() => {
        setSearchInput(urlSearch);
    }, [urlSearch]);

    const updateParam = useCallback(
        (key: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString());
            if (value) {
                params.set(key, value);
            } else {
                params.delete(key);
            }
            // any search/filter change resets pagination back to page 1
            params.delete(pageParamKey);
            router.push(`${pathname}?${params.toString()}`);
        },
        [pathname, router, searchParams, pageParamKey]
    );

    // debounce search commits to the URL so we don't push a new route on every keystroke
    useEffect(() => {
        if (searchInput === urlSearch) return;

        const timeout = setTimeout(() => {
            updateParam("search", searchInput);
        }, SEARCH_DEBOUNCE_MS);

        return () => clearTimeout(timeout);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchInput]);

    const handlePageChange = (page: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set(pageParamKey, String(page));
        router.push(`${pathname}?${params.toString()}`);
    };

    const handleFilterChange = (key: string, value: string) => updateParam(key, value);

    if (!config || !columns) {
        return (
            <div className="flex h-64 items-center justify-center rounded-[24px] border border-slate-200 bg-white text-sm text-slate-500">
                This section isn&apos;t configured yet.
            </div>
        );
    }

    const filters =
        filterConfig?.filters.map((filter) => ({
            key: filter.key,
            label: filter.label,
            value: searchParams.get(filter.key) ?? "",
            options: filter.options,
        })) ?? [];

    return (
        <DashboardTableView
            title={config.title}
            description={config.description}
            searchPlaceholder={config.searchPlaceholder}
            emptyTitle={config.emptyTitle}
            emptyDescription={config.emptyDescription}
            columns={columns}
            data={pagination.data}
            search={searchInput}
            onSearchChange={setSearchInput}
            filters={filters}
            onFilterChange={handleFilterChange}
            isLoading={isLoading}
            page={pagination.pagination.page}
            totalPages={pagination.pagination.totalPages}
            totalItems={pagination.pagination.total}
            pageSize={pagination.pagination.limit}
            onPageChange={handlePageChange}
            className="overflow-hidden rounded-[24px] border border-slate-200 bg-white"
        />
    );
};

export default DashboardTableSection;