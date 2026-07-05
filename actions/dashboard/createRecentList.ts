interface CreateRecentListOptions {
    limit?: number;
}

export const createRecentList = <T>(
    data: T[],
    {
        limit = 5,
    }: CreateRecentListOptions = {}
): T[] => {
    return data.slice(0, limit);
};