'use server';

import { meiliClient } from '@/lib/meilisearch';

export async function searchJobs(query: string) {

    if (!query) {
        return [];
    }

    try {

        const index = meiliClient.index('jobs');

        const results = await index.search(query, {
            limit: 100,
        });

        return results.hits.map((job: any) => job.id);

    } catch (error) {

        console.error(error);

        return [];
    }
}