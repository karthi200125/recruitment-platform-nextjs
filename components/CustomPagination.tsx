"use client";

import { useRouter, useSearchParams } from "next/navigation";

import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

interface CustomPaginationProps {
    currentPage: number;
    totalJobsCount: number;
}

const JOBS_PER_PAGE = 10;

const CustomPagination = ({
    currentPage,
    totalJobsCount,
}: CustomPaginationProps) => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const totalPages = Math.max(
        1,
        Math.ceil(
            totalJobsCount / JOBS_PER_PAGE
        )
    );

    const updatePageParam = (page: number) => {
        const params = new URLSearchParams(
            searchParams.toString()
        );

        params.set("page", String(page));

        router.push(
            `/jobs?${params.toString()}`
        );
    };

    const handlePrevious = () => {
        if (currentPage > 1) {
            updatePageParam(
                currentPage - 1
            );
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            updatePageParam(
                currentPage + 1
            );
        }
    };

    /*
     * Small number of pages:
     *
     * 1 2 3 4 5
     *
     * No need for ellipsis.
     */
    if (totalPages <= 5) {
        return (
            <Pagination>
                <PaginationContent>
                    {/* Previous */}
                    <PaginationItem>
                        <PaginationPrevious
                            onClick={
                                currentPage > 1
                                    ? handlePrevious
                                    : undefined
                            }
                            className={
                                currentPage === 1
                                    ? "pointer-events-none opacity-40"
                                    : "cursor-pointer"
                            }
                        />
                    </PaginationItem>

                    {/* Pages */}
                    {Array.from(
                        {
                            length: totalPages,
                        },
                        (_, index) =>
                            index + 1
                    ).map((page) => (
                        <PaginationItem
                            key={page}
                        >
                            <PaginationLink
                                isActive={
                                    currentPage ===
                                    page
                                }
                                onClick={() =>
                                    updatePageParam(
                                        page
                                    )
                                }
                                className="cursor-pointer"
                            >
                                {page}
                            </PaginationLink>
                        </PaginationItem>
                    ))}

                    {/* Next */}
                    <PaginationItem>
                        <PaginationNext
                            onClick={
                                currentPage <
                                    totalPages
                                    ? handleNext
                                    : undefined
                            }
                            className={
                                currentPage ===
                                    totalPages
                                    ? "pointer-events-none opacity-40"
                                    : "cursor-pointer"
                            }
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        );
    }

    /*
     * Large number of pages.
     */
    const pages: (
        | number
        | "ellipsis-left"
        | "ellipsis-right"
    )[] = [];

    /*
     * FIRST PAGE
     *
     * 1 2 3 ... 13
     */
    if (currentPage <= 3) {
        pages.push(
            1,
            2,
            3
        );

        pages.push(
            "ellipsis-right"
        );

        pages.push(
            totalPages
        );
    }

    /*
     * LAST PAGE
     *
     * 1 ... 11 12 13
     */
    else if (
        currentPage >=
        totalPages - 2
    ) {
        pages.push(1);

        pages.push(
            "ellipsis-left"
        );

        pages.push(
            totalPages - 2,
            totalPages - 1,
            totalPages
        );
    }

    /*
     * MIDDLE
     *
     * 1 ... 4 5 6 ... 13
     */
    else {
        pages.push(1);

        pages.push(
            "ellipsis-left"
        );

        pages.push(
            currentPage - 1,
            currentPage,
            currentPage + 1
        );

        pages.push(
            "ellipsis-right"
        );

        pages.push(
            totalPages
        );
    }

    return (
        <Pagination>
            <PaginationContent>
                {/* Previous */}
                <PaginationItem>
                    <PaginationPrevious
                        onClick={
                            currentPage > 1
                                ? handlePrevious
                                : undefined
                        }
                        className={
                            currentPage === 1
                                ? "pointer-events-none opacity-40"
                                : "cursor-pointer"
                        }
                    />
                </PaginationItem>

                {/* Page numbers */}
                {pages.map(
                    (page, index) => {
                        if (
                            page ===
                            "ellipsis-left" ||
                            page ===
                            "ellipsis-right"
                        ) {
                            return (
                                <PaginationItem
                                    key={`${page}-${index}`}
                                >
                                    <PaginationEllipsis />
                                </PaginationItem>
                            );
                        }

                        return (
                            <PaginationItem
                                key={page}
                            >
                                <PaginationLink
                                    isActive={
                                        currentPage ===
                                        page
                                    }
                                    onClick={() =>
                                        updatePageParam(
                                            page
                                        )
                                    }
                                    className="cursor-pointer"
                                >
                                    {page}
                                </PaginationLink>
                            </PaginationItem>
                        );
                    }
                )}

                {/* Next */}
                <PaginationItem>
                    <PaginationNext
                        onClick={
                            currentPage <
                                totalPages
                                ? handleNext
                                : undefined
                        }
                        className={
                            currentPage ===
                                totalPages
                                ? "pointer-events-none opacity-40"
                                : "cursor-pointer"
                        }
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
};

export default CustomPagination;