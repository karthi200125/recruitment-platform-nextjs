import { Meilisearch } from "meilisearch";

export const meiliClient = new Meilisearch({
    host: process.env.MEILISEARCH_HOST!,
    apiKey: process.env.MEILISEARCH_MASTER_KEY,
});