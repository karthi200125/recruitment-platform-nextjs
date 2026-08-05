"use server";

import { meiliClient } from "@/lib/meilisearch";

export async function configureJobIndex() {
    if (!meiliClient) {
        console.warn("Meilisearch is not configured. Skipping index configuration.");
        return;
    }

    const index = meiliClient.index("jobs");

    await index.updateSearchableAttributes([
        "jobTitle",
        "jobDesc",
        "skills",
        "companyName",
        "city",
        "state",
        "country",
    ]);

    await index.updateFilterableAttributes([
        "city",
        "state",
        "country",
        "type",
        "mode",
        "experience",
        "isEasyApply",
    ]);

    await index.updateSortableAttributes([
        "createdAt",
    ]);

    await index.updateRankingRules([
        "words",
        "typo",
        "proximity",
        "attribute",
        "sort",
        "exactness",
    ]);

    console.log("Meilisearch configured");
}