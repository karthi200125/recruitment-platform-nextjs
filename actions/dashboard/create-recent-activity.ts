interface PaginationOptions {
    page?: number;
    limit?: number;
}

interface PaginationResult {
    page: number;
    limit: number;
    skip: number;
    take: number;
}

export const getPagination = ({
    page = 1,
    limit = 10,
}: PaginationOptions): PaginationResult => {
    const currentPage = Math.max(1, page);
    const currentLimit = Math.max(1, limit);

    return {
        page: currentPage,
        limit: currentLimit,
        skip: (currentPage - 1) * currentLimit,
        take: currentLimit,
    };
};