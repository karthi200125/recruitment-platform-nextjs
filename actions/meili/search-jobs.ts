"use server";

import { meiliClient } from "@/lib/meilisearch";

interface JobSearchDocument {
    id: number;
}

export async function searchJobs(
    query: string
): Promise<number[]> {
    if (!query.trim()) {
        return [];
    }

    try {
        const index =
            meiliClient.index<JobSearchDocument>(
                "jobs"
            );

        const results =
            await index.search(query, {
                limit: 100,
            });

        return results.hits.map(
            (job) => job.id
        );
    } catch (error) {
        console.error(
            "[SEARCH_JOBS]",
            error
        );

        return [];
    }
}