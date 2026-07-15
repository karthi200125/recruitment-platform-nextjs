import { DashboardPaginationMeta } from "@/types/dashboard";

export const DEFAULT_PAGE_SIZE = 10;

interface PaginateArgs {
    page: number;
    limit?: number;
}

export const getPaginationArgs = ({ page, limit = DEFAULT_PAGE_SIZE }: PaginateArgs) => ({
    skip: (Math.max(page, 1) - 1) * limit,
    take: limit,
});

export const buildPaginationMeta = (page: number, limit: number, total: number): DashboardPaginationMeta => {
    const totalPages = Math.max(Math.ceil(total / limit), 1);
    const safePage = Math.min(Math.max(page, 1), totalPages);

    return {
        page: safePage,
        limit,
        total,
        totalPages,
        hasNextPage: safePage < totalPages,
        hasPreviousPage: safePage > 1,
    };
};