/**
 * -----------------------------------------------------------------------------
 * Site Configuration
 * -----------------------------------------------------------------------------
 *
 * Single source of truth for all global application metadata.
 *
 * Used by:
 * - app/layout.tsx
 * - app/manifest.ts
 * - app/robots.ts
 * - app/sitemap.ts
 * - Open Graph
 * - Twitter Cards
 * - JSON-LD
 * -----------------------------------------------------------------------------
 */

const APP_URL =
    process.env.NEXT_PUBLIC_APP_URL ??
    "https://jobify.com";

export const siteConfig = {
    /**
     * -------------------------------------------------------------------------
     * Identity
     * -------------------------------------------------------------------------
     */
    name: "Jobify",

    shortName: "Jobify",

    applicationName: "Jobify",

    industry: "Job Portal",

    audience: [
        "Candidates",
        "Recruiters",
        "Organizations",
    ],

    /**
     * -------------------------------------------------------------------------
     * URLs
     * -------------------------------------------------------------------------
     */
    url: APP_URL,

    metadataBase: new URL(APP_URL),

    /**
     * -------------------------------------------------------------------------
     * SEO
     * -------------------------------------------------------------------------
     */
    title: "Jobify | Find Your Dream Job",

    titleTemplate: "%s | Jobify",

    description:
        "Find jobs, discover companies, connect with recruiters, and manage hiring opportunities with Jobify.",

    keywords: [
        "Jobify",
        "Jobs",
        "Job Portal",
        "Job Search",
        "Careers",
        "Employment",
        "Hiring",
        "Recruitment",
        "Recruiters",
        "Companies",
        "Job Board",
        "HR",
        "Remote Jobs",
        "Career Opportunities",
        "Software Engineer Jobs",
    ],

    category: "Technology",

    locale: "en_US",

    language: "en",

    /**
     * -------------------------------------------------------------------------
     * Branding
     * -------------------------------------------------------------------------
     */
    logo: "/logo.png",

    favicon: "/favicon.ico",

    appleTouchIcon: "/apple-touch-icon.png",

    /**
     * -------------------------------------------------------------------------
     * PWA
     * -------------------------------------------------------------------------
     */
    themeColor: "#6366F1",

    backgroundColor: "#09090B",

    manifest: "/manifest.ts",

    /**
     * -------------------------------------------------------------------------
     * Social Images
     * -------------------------------------------------------------------------
     */
    ogImage: `${APP_URL}/og-image.webp`,

    twitterImage: `${APP_URL}/og-image.webp`,

    /**
     * -------------------------------------------------------------------------
     * Organization
     * -------------------------------------------------------------------------
     */
    creator: "Jobify",

    publisher: "Jobify",

    authors: [
        {
            name: "Jobify Team",
            url: APP_URL,
        },
    ],

    /**
     * -------------------------------------------------------------------------
     * Social Links
     * -------------------------------------------------------------------------
     *
     * Leave empty until official accounts exist.
     */
    social: {
        twitter: "",
        github: "",
        linkedin: "",
    },

    /**
     * -------------------------------------------------------------------------
     * Search Engine
     * -------------------------------------------------------------------------
     */
    robots: {
        index: true,
        follow: true,
    },
} as const;

export type SiteConfig = typeof siteConfig;