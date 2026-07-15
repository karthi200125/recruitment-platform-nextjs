"use client";

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import DashboardTableSkeleton from "@/components/skeletons/DashboardTableSkeleton";

interface DashboardDataTableProps<
    TData,
    TValue,
> {
    columns: ColumnDef<
        TData,
        TValue
    >[];
    data: TData[];
    emptyTitle?: string;
    emptyDescription?: string;
    className?: string;
    isLoading?: boolean;
}

const DashboardDataTable = <
    TData,
    TValue,
>({
    columns,
    data,
    emptyTitle = "No data found",
    emptyDescription = "There is currently no data available.",
    className,
    isLoading
}: DashboardDataTableProps<
    TData,
    TValue
>) => {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel:
            getCoreRowModel(),
    });

    if (isLoading) {
        return (
            <DashboardTableSkeleton />
        );
    }

    return (
        <div
            className={cn(
                "overflow-hidden rounded-[24px] border border-slate-200 bg-white",
                className
            )}
        >
            {/* Responsive Wrapper */}
            <div className="w-full overflow-x-auto">
                <Table className="min-w-[900px]">
                    {/* Header */}
                    <TableHeader className="bg-slate-50/80">
                        {table
                            .getHeaderGroups()
                            .map(
                                (
                                    headerGroup
                                ) => (
                                    <TableRow
                                        key={
                                            headerGroup.id
                                        }
                                        className="border-slate-200 hover:bg-transparent"
                                    >
                                        {headerGroup.headers.map(
                                            (
                                                header
                                            ) => (
                                                <TableHead
                                                    key={
                                                        header.id
                                                    }
                                                    className="h-12 whitespace-nowrap px-4 text-xs font-semibold uppercase tracking-wide text-slate-500"
                                                >
                                                    {header.isPlaceholder
                                                        ? null
                                                        : flexRender(
                                                            header
                                                                .column
                                                                .columnDef
                                                                .header,
                                                            header.getContext()
                                                        )}
                                                </TableHead>
                                            )
                                        )}
                                    </TableRow>
                                )
                            )}
                    </TableHeader>

                    {/* Body */}
                    <TableBody>
                        {table.getRowModel()
                            .rows?.length ? (
                            table
                                .getRowModel()
                                .rows.map(
                                    (
                                        row
                                    ) => (
                                        <TableRow
                                            key={
                                                row.id
                                            }
                                            className="border-slate-100 transition-colors hover:bg-slate-50/60"
                                        >
                                            {row
                                                .getVisibleCells()
                                                .map(
                                                    (
                                                        cell
                                                    ) => (
                                                        <TableCell
                                                            key={
                                                                cell.id
                                                            }
                                                            className="px-4 py-4 align-middle"
                                                        >
                                                            {flexRender(
                                                                cell
                                                                    .column
                                                                    .columnDef
                                                                    .cell,
                                                                cell.getContext()
                                                            )}
                                                        </TableCell>
                                                    )
                                                )}
                                        </TableRow>
                                    )
                                )
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={
                                        columns.length
                                    }
                                    className="h-40 text-center"
                                >
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <h3 className="text-sm font-semibold text-slate-700">
                                            {
                                                emptyTitle
                                            }
                                        </h3>

                                        <p className="max-w-sm text-sm text-slate-500">
                                            {
                                                emptyDescription
                                            }
                                        </p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default DashboardDataTable;