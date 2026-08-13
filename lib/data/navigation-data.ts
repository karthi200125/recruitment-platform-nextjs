import {
    ArrowUpRight,
    Briefcase,
    Building2,
    ClipboardCheck,
    Clock3,
    FileText,
    Globe2,
    GraduationCap,
    MapPin,
    MessageSquare,
    Search,
    Sparkles,
    TrendingUp,
    Users,
    Zap,
    type LucideIcon,
} from "lucide-react";

export interface MegaMenuItem {
    title: string;
    description: string;
    href: string;
    icon: LucideIcon;
}

export interface MegaMenuConfig {
    title: string;
    description: string;
    items: MegaMenuItem[];
}

/* =========================================================
   JOBS
========================================================= */

export const JOBS_NAVIGATION: MegaMenuConfig = {
    title: "Find your next opportunity",
    description:
        "Explore jobs, discover opportunities, and find the right role for you.",

    items: [
        {
            title: "Browse Jobs",
            description:
                "Explore available job opportunities and find your next role.",
            href: "/jobs",
            icon: Briefcase,
        },
        {
            title: "Easy Apply",
            description:
                "Find jobs that let you apply quickly and easily.",
            href: "/jobs?easyApply=true",
            icon: Zap,
        },
        {
            title: "Remote Jobs",
            description:
                "Discover opportunities that let you work remotely.",
            href: "/jobs?type=Remote",
            icon: Globe2,
        },
        {
            title: "Jobs by Location",
            description:
                "Find opportunities based on your preferred location.",
            href: "/jobs",
            icon: MapPin,
        },
        {
            title: "Jobs by Experience",
            description:
                "Explore opportunities based on your experience level.",
            href: "/jobs",
            icon: TrendingUp,
        },
        {
            title: "Recently Posted",
            description:
                "Discover the latest job opportunities posted on Jobify.",
            href: "/jobs?dateposted=Past%2024%20hours",
            icon: Clock3,
        },
    ],
};

/* =========================================================
   COMPANIES
========================================================= */

export const COMPANIES_NAVIGATION: MegaMenuConfig = {
    title: "Discover great companies",
    description:
        "Explore companies, learn about their teams, and discover new opportunities.",

    items: [
        {
            title: "Explore Companies",
            description:
                "Discover companies hiring talented professionals on Jobify.",
            href: "/companies",
            icon: Building2,
        },
        {
            title: "Hiring Companies",
            description:
                "Find companies that are actively looking for new talent.",
            href: "/companies",
            icon: Users,
        },
        {
            title: "Company Profiles",
            description:
                "Learn about companies, their teams, and available opportunities.",
            href: "/companies",
            icon: Building2,
        },
        {
            title: "Find Jobs at Companies",
            description:
                "Explore open positions from companies you're interested in.",
            href: "/jobs",
            icon: Search,
        },
    ],
};

/* =========================================================
   RESOURCES
========================================================= */

export const RESOURCES_NAVIGATION: MegaMenuConfig = {
    title: "Resources for your career",
    description:
        "Tools and resources to help you search, apply, and grow your career.",

    items: [
        {
            title: "My Applications",
            description:
                "Track your applications and stay updated on your job search.",
            href: "/dashboard/jobStatus",
            icon: ClipboardCheck,
        },
        {
            title: "Resume Builder",
            description:
                "Create a professional resume and present your experience effectively.",
            href: "/resume-builder",
            icon: FileText,
        },
        {
            title: "Career Advice",
            description:
                "Get practical guidance to improve your job search and career.",
            href: "/career-advice",
            icon: GraduationCap,
        },
        {
            title: "Messaging",
            description:
                "Connect and communicate with recruiters and other professionals.",
            href: "/messages",
            icon: MessageSquare,
        },
    ],
};

/* =========================================================
   FOOTER ACTIONS
========================================================= */

export const JOBS_MEGA_MENU_FOOTER = {
    left: {
        title: "Post a Job",
        description:
            "Reach qualified candidates and find the right talent.",
        href: "/createJob",
        icon: Briefcase,
    },

    right: {
        title: "View all jobs",
        href: "/jobs",
        icon: ArrowUpRight,
    },
};

export const COMPANIES_MEGA_MENU_FOOTER = {
    left: {
        title: "Find a Company",
        description:
            "Explore companies and discover your next opportunity.",
        href: "/companies",
        icon: Building2,
    },

    right: {
        title: "View all companies",
        href: "/companies",
        icon: ArrowUpRight,
    },
};

export const RESOURCES_MEGA_MENU_FOOTER = {
    left: {
        title: "Start your job search",
        description:
            "Explore jobs and take the next step in your career.",
        href: "/jobs",
        icon: Sparkles,
    },

    right: {
        title: "Explore resources",
        href: "/messages",
        icon: ArrowUpRight,
    },
};