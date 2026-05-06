import { Meilisearch } from 'meilisearch';

export const meiliClient = new Meilisearch({
    host: 'http://127.0.0.1:7700',
});