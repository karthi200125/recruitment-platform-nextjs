interface CreatePaginationProps<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
}

interface PaginationResult<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

export const createPagination = <T>({
    data,
    total,
    page,
    limit,
}: CreatePaginationProps<T>): PaginationResult<T> => {
    const totalPages = Math.max(
        1,
        Math.ceil(total / limit)
    );

    return {
        data,
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
    };
};