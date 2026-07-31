import type { MetadataRoute } from "next";

import { routes, siteConfig } from "@/config";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: "*",

                allow: [
                    routes.public.home,
                    routes.public.jobs,
                    routes.public.companies,
                ],

                disallow: [
                    "/api/",
                    "/dashboard/",
                    "/messages",
                    "/network/",
                    "/setting",
                    "/subscriptions",
                    "/signin",
                    "/signup",
                    "/forgot-password",
                    "/reset-password",
                    "/admin",
                    "/createJob",
                    "/create-company",
                    "/selectrole",
                ],
            },

            {
                userAgent: "Googlebot",

                allow: "/",

                disallow: [
                    "/api/",
                    "/dashboard/",
                    "/messages",
                    "/network/",
                    "/setting",
                    "/subscriptions",
                    "/admin",
                ],
            },
        ],

        sitemap: `${siteConfig.url}/sitemap.xml`,

        host: siteConfig.url,
    };
}