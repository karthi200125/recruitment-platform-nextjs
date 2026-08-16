const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://job-portal-hmif.vercel.app/";

export const siteConfig = {

    name: "Jobify",

    shortName: "Jobify",

    applicationName: "Jobify",

    industry: "Job Portal",

    audience: [
        "Candidates",
        "Recruiters",
        "Organizations",
    ],


    url: APP_URL,

    metadataBase: new URL(APP_URL),


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


    logo: "/logo.png",

    favicon: "/logo.png",

    appleTouchIcon: "/apple-touch-icon.png",


    themeColor: "#6366F1",

    backgroundColor: "#09090B",

    manifest: "/manifest.ts",


    ogImage: `${APP_URL}/og-image.webp`,

    twitterImage: `${APP_URL}/og-image.webp`,


    creator: "Jobify",

    publisher: "Jobify",

    authors: [
        {
            name: "Jobify Team",
            url: APP_URL,
        },
    ],

    social: {
        twitter: "",
        github: "",
        linkedin: "",
    },


    robots: {
        index: true,
        follow: true,
    },
} as const;

export type SiteConfig = typeof siteConfig;