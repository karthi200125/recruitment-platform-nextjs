"use server";

import { db } from "@/lib/db";
import { meiliClient } from "@/lib/meilisearch";

export async function indexJobs() {
    if (!meiliClient) {
        console.warn("Meilisearch is not configured. Skipping job indexing.");

        return {
            success: false,
            count: 0,
        };
    }

    try {
        const jobs = await db.job.findMany({
            include: {
                company: true,
            },
        });

        const formattedJobs = jobs.map((job) => ({
            id: job.id,

            // Searchable
            jobTitle: job.jobTitle,
            jobDesc: job.jobDesc,
            skills: job.skills,

            // Location
            city: job.city,
            state: job.state,
            country: job.country,

            // Filters
            type: job.type,
            mode: job.mode,
            experience: job.experience,
            salary: job.salary,

            // Company
            companyName: job.company.companyName,

            // Extra
            isEasyApply: job.isEasyApply,
            createdAt: job.createdAt,
        }));

        const index = meiliClient.index("jobs");

        await index.deleteAllDocuments();
        await index.addDocuments(formattedJobs);

        console.log(`✅ Indexed ${formattedJobs.length} jobs into Meilisearch.`);

        return {
            success: true,
            count: formattedJobs.length,
        };
    } catch (error) {
        console.error("[INDEX_JOBS]", error);

        return {
            success: false,
            count: 0,
        };
    }
}