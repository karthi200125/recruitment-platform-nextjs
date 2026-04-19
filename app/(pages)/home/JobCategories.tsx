import Link from "next/link";
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

const categories: Category[] = [
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

const JobCategories = () => {
    const totalJobs = categories.reduce((sum, c) => sum + c.count, 0);

    return (
        <section
            aria-labelledby="job-categories-heading"
            className="relative w-full bg-[#09090b] py-24 px-4 sm:px-6 lg:px-8 overflow-hidden"
        >
            {/* Ambient glow */}
            <div className="pointer-events-none absolute inset-0 flex justify-center items-center">
                <div className="w-[700px] h-[350px] rounded-full bg-indigo-600/7 blur-[120px]" />
            </div>

            <div className="relative max-w-6xl mx-auto">

                {/* Eyebrow */}
                <div className="flex justify-center mb-5">
                    <span className="inline-flex items-center gap-2 rounded-full border border-indigo-500/25 bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-indigo-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                        {totalJobs.toLocaleString()}+ open roles
                    </span>
                </div>

                {/* Heading */}
                <div className="text-center mb-14">
                    <h2
                        id="job-categories-heading"
                        className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-[1.1] mb-4"
                    >
                        Find work in your{" "}
                        <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                            field of expertise
                        </span>
                    </h2>
                    <p className="text-zinc-400 text-base max-w-md mx-auto leading-relaxed">
                        Explore thousands of opportunities across the most in-demand tech roles, curated and verified daily.
                    </p>
                </div>

                {/* Grid */}
                <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categories.map((category) => {
                        const Icon = category.icon;

                        return (
                            <li key={category.id}>
                                <Link
                                    href={`/jobs/${category.slug}`}
                                    aria-label={`Browse ${category.name} jobs`}
                                    className={`group relative flex flex-col h-full rounded-2xl border border-white/[0.07] bg-zinc-900/50 p-6 transition-all duration-300 ${category.accent} hover:-translate-y-1 hover:bg-zinc-900/80 overflow-hidden`}
                                >
                                    {/* Top hairline on hover */}
                                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                    {/* Top row — icon + count */}
                                    <div className="flex items-start justify-between mb-5">
                                        <div className={`w-11 h-11 flex items-center justify-center rounded-xl ${category.iconBg} transition-colors duration-300`}>
                                            <Icon className="w-5 h-5" strokeWidth={1.75} />
                                        </div>
                                        <span className="text-xs font-semibold text-zinc-600 border border-white/[0.06] bg-white/[0.03] rounded-full px-2.5 py-1">
                                            {category.count.toLocaleString()} jobs
                                        </span>
                                    </div>

                                    {/* Tag */}
                                    <span className="inline-flex w-max mb-3 text-[11px] font-medium text-zinc-500 border border-white/[0.05] bg-white/[0.03] rounded-full px-2.5 py-0.5">
                                        {category.tag}
                                    </span>

                                    {/* Title */}
                                    <h3 className="text-base font-semibold text-white mb-2 group-hover:text-zinc-100 transition-colors duration-200">
                                        {category.name}
                                    </h3>

                                    {/* Description */}
                                    <p className="text-sm text-zinc-500 leading-relaxed flex-1 group-hover:text-zinc-400 transition-colors duration-300">
                                        {category.description}
                                    </p>

                                    {/* CTA */}
                                    <div className="mt-5 flex items-center gap-1.5 text-xs font-semibold text-zinc-600 group-hover:text-zinc-300 transition-all duration-300">
                                        Browse roles
                                        <ArrowRight className="w-3.5 h-3.5 translate-x-0 group-hover:translate-x-0.5 transition-transform duration-300" />
                                    </div>
                                </Link>
                            </li>
                        );
                    })}
                </ul>

                {/* Bottom CTA */}
                <div className="mt-10 text-center">
                    <Link
                        href="/jobs"
                        className="inline-flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.04] px-6 py-3 text-sm font-semibold text-zinc-300 hover:bg-white/[0.08] hover:text-white hover:border-white/20 transition-all duration-200"
                    >
                        View all categories
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

            </div>
        </section>
    );
};

export default JobCategories;