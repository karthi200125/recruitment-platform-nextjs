import { DEFAULT_PAGE_SIZE } from "./paginate";

export interface ParsedTableParams {
    page: number;
    limit: number;
    search: string;
    filters: Record<string, string>;
}

const RESERVED_KEYS = new Set(["tab", "search"]);

const toPageNumber = (value: string | undefined) => {
    const parsed = Number(value);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : 1;
};

// searchParams here is the raw Next.js server-component searchParams object.
// pageParamKey is tab-specific (e.g. "appliedPage") since each table paginates independently.
export const parseTableParams = (
    searchParams: Record<string, string | string[] | undefined>,
    pageParamKey: string
): ParsedTableParams => {
    const page = toPageNumber(
        Array.isArray(searchParams[pageParamKey]) ? searchParams[pageParamKey]?.[0] : (searchParams[pageParamKey] as string)
    );

    const search = (Array.isArray(searchParams.search) ? searchParams.search[0] : searchParams.search) ?? "";

    const filters: Record<string, string> = {};
    for (const [key, value] of Object.entries(searchParams)) {
        if (RESERVED_KEYS.has(key) || key.endsWith("Page")) continue;
        const resolved = Array.isArray(value) ? value[0] : value;
        if (resolved) filters[key] = resolved;
    }

    return { page, limit: DEFAULT_PAGE_SIZE, search: search.trim(), filters };
};