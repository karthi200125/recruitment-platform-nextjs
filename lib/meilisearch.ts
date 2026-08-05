import { Meilisearch } from "meilisearch";

const host = process.env.MEILISEARCH_HOST;

export const meiliClient = host
    ? new Meilisearch({
        host,
        apiKey: process.env.MEILISEARCH_MASTER_KEY,
    })
    : null;