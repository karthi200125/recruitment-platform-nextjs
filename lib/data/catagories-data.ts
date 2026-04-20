import { Briefcase, Code, Database, Palette, BarChart3, Shield, ArrowRight } from "lucide-react";

type Category = {
    id: number;
    name: string;
    slug: string;
    icon: React.ElementType;
    count: number;
    description: string;
    accent: string;
    iconBg: string;
    tag: string;
};

export const categoriesdata: Category[] = [
    {
        id: 1,
        name: "Frontend Developer",
        slug: "frontend-developer",
        icon: Code,
        count: 1240,
        description: "React, Next.js, and UI engineering roles for builders who care about craft.",
        accent: "hover:border-indigo-500/40",
        iconBg: "bg-indigo-500/15 text-indigo-400",
        tag: "Most Popular",
    },
    {
        id: 2,
        name: "Backend Developer",
        slug: "backend-developer",
        icon: Database,
        count: 980,
        description: "Node.js, APIs, and scalable distributed systems built for performance.",
        accent: "hover:border-sky-500/40",
        iconBg: "bg-sky-500/15 text-sky-400",
        tag: "High Demand",
    },
    {
        id: 3,
        name: "Full Stack Developer",
        slug: "fullstack-developer",
        icon: Briefcase,
        count: 1560,
        description: "End-to-end development roles spanning frontend, backend, and infra.",
        accent: "hover:border-violet-500/40",
        iconBg: "bg-violet-500/15 text-violet-400",
        tag: "Top Hiring",
    },
    {
        id: 4,
        name: "UI/UX Designer",
        slug: "ui-ux-designer",
        icon: Palette,
        count: 620,
        description: "Product design, user research, and end-to-end experience design roles.",
        accent: "hover:border-pink-500/40",
        iconBg: "bg-pink-500/15 text-pink-400",
        tag: "Creative",
    },
    {
        id: 5,
        name: "Data Analyst",
        slug: "data-analyst",
        icon: BarChart3,
        count: 540,
        description: "Insights, dashboards, and data-driven decision-making at scale.",
        accent: "hover:border-amber-500/40",
        iconBg: "bg-amber-500/15 text-amber-400",
        tag: "Growing Fast",
    },
    {
        id: 6,
        name: "Cyber Security",
        slug: "cyber-security",
        icon: Shield,
        count: 310,
        description: "Security engineering, penetration testing, and infrastructure hardening.",
        accent: "hover:border-emerald-500/40",
        iconBg: "bg-emerald-500/15 text-emerald-400",
        tag: "Niche & Lucrative",
    },
];