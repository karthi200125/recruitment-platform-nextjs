import Link from "next/link";
import { ArrowRight } from "lucide-react";

const COMPANY_LOGOS = [
    "TechCorp",
    "InnovateX",
    "CloudNet",
    "ScaleUp",
    "DesignHub",
];

const RECRUITER_STATS = [
    {
        value: "3x",
        label: "Faster hiring",
    },
    {
        value: "91%",
        label: "Candidate match rate",
    },
    {
        value: "12K+",
        label: "Companies hiring",
    },
];

const ForRecruiters = () => {
    return (
        <section
            aria-labelledby="recruiters-heading"
            className="relative overflow-hidden py-28"
        >
            {/* BACKGROUND */}
            <div className="absolute inset-0 -z-20 bg-black" />

            {/* TOP GLOW */}
            <div className="absolute inset-x-0 top-0 -z-10 h-[360px] bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.16),transparent_72%)]" />

            {/* SIDE GLOW */}
            <div className="absolute right-0 top-1/3 -z-10 h-[320px] w-[320px] rounded-full bg-indigo-500/10 blur-3xl" />

            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                {/* EYEBROW */}
                <div className="mb-6 flex justify-center lg:justify-start">
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-5 py-2 backdrop-blur-xl">
                        <div className="h-2 w-2 rounded-full bg-indigo-400" />

                        <span className="text-xs font-medium uppercase tracking-[0.18em] text-white/60">
                            For recruiters & companies
                        </span>
                    </div>
                </div>

                {/* MAIN GRID */}
                <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:items-center">

                    {/* LEFT SIDE */}
                    <div>

                        {/* HEADING */}
                        <h2
                            id="recruiters-heading"
                            className="text-4xl font-semibold leading-[1.05] tracking-[-0.03em] text-white sm:text-5xl lg:text-6xl"
                        >
                            Hire exceptional talent
                            <span className="block bg-gradient-to-r from-indigo-400 via-violet-400 to-blue-400 bg-clip-text text-transparent">
                                without slowing down
                            </span>
                        </h2>

                        {/* DESCRIPTION */}
                        <p className="mt-6 max-w-2xl text-base leading-8 text-white/60 sm:text-lg">
                            Streamline sourcing, candidate screening,
                            and hiring workflows with a platform built
                            for modern recruiting teams.
                        </p>

                        {/* BUTTONS */}
                        <div className="mt-10 flex flex-wrap items-center gap-4">

                            <Link
                                href="/signin"
                                className="
                                    inline-flex items-center justify-center
                                    rounded-2xl
                                    bg-white
                                    px-7 py-3.5
                                    text-sm font-medium text-black
                                    transition-all duration-300
                                    hover:bg-white/90
                                "
                            >
                                Post a job

                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>

                            <Link
                                href="/pricing"
                                className="
                                    inline-flex items-center justify-center
                                    rounded-2xl
                                    border border-white/[0.08]
                                    bg-white/[0.03]
                                    px-7 py-3.5
                                    text-sm font-medium text-white/70
                                    backdrop-blur-xl
                                    transition-all duration-300
                                    hover:border-white/[0.14]
                                    hover:bg-white/[0.06]
                                    hover:text-white
                                "
                            >
                                View pricing
                            </Link>
                        </div>

                        {/* TRUSTED BY */}
                        <div className="mt-14">
                            <p className="text-xs font-medium uppercase tracking-[0.18em] text-white/35">
                                Trusted by hiring teams at
                            </p>

                            <div className="mt-5 flex flex-wrap items-center gap-3">
                                {COMPANY_LOGOS.map((logo) => (
                                    <div
                                        key={logo}
                                        className="
                                            rounded-2xl
                                            border border-white/[0.06]
                                            bg-white/[0.03]
                                            px-4 py-2
                                            text-sm font-medium text-white/45
                                            backdrop-blur-xl
                                        "
                                    >
                                        {logo}
                                    </div>
                                ))}

                                <span className="pl-2 text-sm text-white/35">
                                    +12,000 more
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT SIDE */}
                    <div className="relative">

                        {/* GLOW */}
                        <div className="absolute inset-0 -z-10 rounded-[36px] bg-indigo-500/10 blur-3xl" />

                        {/* PANEL */}
                        <div
                            className="
                                relative overflow-hidden rounded-[32px]
                                border border-white/[0.08]
                                bg-white/[0.03]
                                p-8
                                backdrop-blur-2xl
                            "
                        >
                            {/* TOP LINE */}
                            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                            {/* PANEL HEADER */}
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-white/40">
                                        Hiring Dashboard
                                    </p>

                                    <h3 className="mt-2 text-2xl font-semibold tracking-tight text-white">
                                        Recruitment insights
                                    </h3>
                                </div>

                                <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] px-4 py-2 text-sm font-medium text-emerald-300">
                                    Live
                                </div>
                            </div>

                            {/* STATS */}
                            <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-3">
                                {RECRUITER_STATS.map((item) => (
                                    <div
                                        key={item.label}
                                        className="
                                            rounded-2xl
                                            border border-white/[0.06]
                                            bg-white/[0.03]
                                            p-5
                                        "
                                    >
                                        <h4 className="text-3xl font-semibold tracking-tight text-white">
                                            {item.value}
                                        </h4>

                                        <p className="mt-2 text-xs font-medium uppercase tracking-[0.16em] text-white/35">
                                            {item.label}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            {/* ACTIVITY */}
                            <div className="mt-8 space-y-4">

                                {[
                                    "24 new applications received today",
                                    "8 candidates shortlisted this week",
                                    "AI matching improved hiring accuracy",
                                ].map((item) => (
                                    <div
                                        key={item}
                                        className="
                                            flex items-center gap-3
                                            rounded-2xl
                                            border border-white/[0.05]
                                            bg-white/[0.02]
                                            px-5 py-4
                                        "
                                    >
                                        <div className="h-2 w-2 rounded-full bg-indigo-400" />

                                        <p className="text-sm text-white/55">
                                            {item}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ForRecruiters;