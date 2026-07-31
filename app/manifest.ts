import type { MetadataRoute } from "next";

import { routes, siteConfig } from "@/config";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: siteConfig.name,

        short_name: siteConfig.shortName,

        description: siteConfig.description,

        start_url: routes.public.home,

        scope: "/",

        display: "standalone",

        orientation: "portrait",

        // background_color: siteConfig.backgroundColor,

        // theme_color: siteConfig.themeColor,

        categories: [
            "business",
            "productivity",
            "technology",
        ],

        lang: siteConfig.language,

        icons: [
            {
                src: "/favicon.ico",
                sizes: "any",
                type: "image/x-icon",
            },
        ],
    };
}