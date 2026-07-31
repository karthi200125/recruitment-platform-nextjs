import type { MetadataRoute } from "next";

import { routes, siteConfig } from "@/config";

const currentDate = new Date();


const staticRoutes: MetadataRoute.Sitemap = [
    {
        url: `${siteConfig.url}${routes.public.home}`,
        lastModified: currentDate,
        changeFrequency: "weekly",
        priority: 1,
    },

    {
        url: `${siteConfig.url}${routes.public.jobs}`,
        lastModified: currentDate,
        changeFrequency: "daily",
        priority: 0.9,
    },

    {
        url: `${siteConfig.url}${routes.public.companies}`,
        lastModified: currentDate,
        changeFrequency: "weekly",
        priority: 0.8,
    },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    /**
     * -------------------------------------------------------------------------
     * Future Dynamic Routes
     * -------------------------------------------------------------------------
     *
     * Example:
     *
     * const jobs = await db.job.findMany({
     *     where: {
     *         status: "ACTIVE",
     *         published: true,
     *     },
     * });
     *
     * const jobRoutes = jobs.map((job) => ({
     *     url: `${siteConfig.url}/jobs/${job.slug}`,
     *     lastModified: job.updatedAt,
     *     changeFrequency: "daily",
     *     priority: 0.8,
     * }));
     *
     * -------------------------------------------------------------------------
     *
     * const companies = await db.company.findMany(...);
     *
     * const companyRoutes = ...
     *
     * -------------------------------------------------------------------------
     *
     * const publicProfiles = ...
     *
     * const profileRoutes = ...
     */

    return [
        ...staticRoutes,

        // ...jobRoutes,

        // ...companyRoutes,

        // ...profileRoutes,
    ];
}