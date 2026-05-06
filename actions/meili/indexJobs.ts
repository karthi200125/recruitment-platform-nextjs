'use server';

import { db } from '@/lib/db';
import { meiliClient } from '@/lib/meilisearch';

export async function indexJobs() {
    try {
        const jobs = await db.job.findMany({
            include: {
                company: true,
            },
        });

        const formattedJobs = jobs.map((job: any) => ({
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

        const index = meiliClient.index('jobs');

        await index.addDocuments(formattedJobs);

        console.log('Jobs indexed successfully');

        return {
            success: true,
        };

    } catch (error) {
        console.error(error);

        return {
            success: false,
        };
    }
}