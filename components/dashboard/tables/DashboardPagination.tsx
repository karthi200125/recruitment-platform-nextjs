"use client";

import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

export interface DashboardPaginationProps {
    page: number;
    totalPages: number;
    totalItems: number;
    pageSize: number;
    onPageChange: (page: number) => void;
    className?: string;
}

const buildPageWindow = (page: number, totalPages: number): (number | "ellipsis")[] => {
    const delta = 1;
    const range: (number | "ellipsis")[] = [];
    const left = Math.max(2, page - delta);
    const right = Math.min(totalPages - 1, page + delta);

    range.push(1);
    if (left > 2) range.push("ellipsis");
    for (let i = left; i <= right; i++) range.push(i);
    if (right < totalPages - 1) range.push("ellipsis");
    if (totalPages > 1) range.push(totalPages);

    return range;
};

const DashboardPagination = ({
    page,
    totalPages,
    totalItems,
    pageSize,
    onPageChange,
    className,
}: DashboardPaginationProps) => {
    if (totalPages <= 1) {
        return null;
    }

    const startItem = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
    const endItem = Math.min(page * pageSize, totalItems);
    const pageWindow = buildPageWindow(page, totalPages);

    return (
        <div
            className={`flex flex-col gap-4 border-t border-slate-200 px-6 py-4 md:flex-row md:items-center md:justify-between ${className ?? ""}`}
        >
            <p className="text-sm text-slate-500">
                Showing <span className="font-semibold text-slate-900">{startItem}</span> to{" "}
                <span className="font-semibold text-slate-900">{endItem}</span> of{" "}
                <span className="font-semibold text-slate-900">{totalItems}</span> results
            </p>

            <div className="flex items-center gap-2">
                <button
                    type="button"
                    disabled={page === 1}
                    onClick={() => onPageChange(page - 1)}
                    aria-label="Previous page"
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 disabled:pointer-events-none disabled:opacity-40"
                >
                    <ChevronLeft className="h-4 w-4" />
                </button>

                {pageWindow.map((item, index) =>
                    item === "ellipsis" ? (
                        <span key={`ellipsis-${index}`} className="flex h-10 w-10 items-center justify-center text-slate-400">
                            <MoreHorizontal className="h-4 w-4" />
                        </span>
                    ) : (
                        <button
                            key={item}
                            type="button"
                            aria-current={item === page ? "page" : undefined}
                            onClick={() => onPageChange(item)}
                            className={`flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium transition ${item === page
                                    ? "bg-blue-600 text-white"
                                    : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                                }`}
                        >
                            {item}
                        </button>
                    )
                )}

                <button
                    type="button"
                    disabled={page === totalPages}
                    onClick={() => onPageChange(page + 1)}
                    aria-label="Next page"
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 disabled:pointer-events-none disabled:opacity-40"
                >
                    <ChevronRight className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
};

export default DashboardPagination;