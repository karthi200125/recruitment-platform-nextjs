import Link from "next/link";
import { Briefcase, Users, Zap, ArrowRight, BarChart3, MessageSquare, ShieldCheck } from "lucide-react";
import { benefits } from '@/lib/data/for-recruiter-data'

const LOGOS = ["TechCorp", "InnovateX", "CloudNet", "ScaleUp", "DesignHub"];

const ForRecruiters = () => {
    return (
        <section
            aria-labelledby="recruiters-heading"
            className="relative w-full py-24 px-4 sm:px-6 lg:px-8 overflow-hidden"
        >
            {/* Ambient glow */}
            <div className="pointer-events-none absolute inset-0 flex justify-center items-center">
                <div className="w-[700px] h-[400px] rounded-full bg-indigo-600/8 blur-[120px]" />
            </div>

            <div className="relative max-w-6xl mx-auto">

                {/* Eyebrow */}
                <div className="flex justify-center mb-5">
                    <span className="inline-flex items-center gap-2 rounded-full border border-indigo-500/25 bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-indigo-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                        For recruiters & companies
                    </span>
                </div>

                {/* Heading */}
                <div className="text-center mb-6">
                    <h2
                        id="recruiters-heading"
                        className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-[1.1] mb-4"
                    >
                        Hire the right talent,{" "}
                        <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                            faster than ever
                        </span>
                    </h2>
                    <p className="text-zinc-400 text-base max-w-lg mx-auto leading-relaxed">
                        Post jobs, connect with pre-verified candidates, and streamline your entire hiring pipeline — all in one place.
                    </p>
                </div>

                {/* Company logos strip */}
                <div className="flex items-center justify-center gap-2 flex-wrap mb-16">
                    <span className="text-xs text-zinc-600 mr-1">Trusted by</span>
                    {LOGOS.map((name) => (
                        <span key={name} className="text-xs font-medium text-zinc-500 border border-white/[0.06] bg-white/[0.03] rounded-full px-3 py-1">
                            {name}
                        </span>
                    ))}
                    <span className="text-xs text-zinc-600 ml-1">& 12,000+ more</span>
                </div>

                {/* Benefits grid */}
                <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
                    {benefits.map((benefit) => {
                        const Icon = benefit.icon;
                        return (
                            <li key={benefit.id}>
                                <div className="group h-full flex flex-col gap-4 rounded-2xl border border-white/[0.07] bg-zinc-900/50 p-6 hover:border-white/[0.14] hover:-translate-y-1 transition-all duration-300">

                                    {/* Icon + stat */}
                                    <div className="flex items-start justify-between">
                                        <div className={`w-11 h-11 flex items-center justify-center rounded-xl ${benefit.iconBg}`}>
                                            <Icon className="w-5 h-5" strokeWidth={1.75} />
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-bold text-white leading-none">{benefit.stat}</p>
                                            <p className="text-[11px] text-zinc-600 mt-0.5 uppercase tracking-wide">{benefit.statLabel}</p>
                                        </div>
                                    </div>

                                    {/* Text */}
                                    <div className="flex-1">
                                        <h3 className="text-base font-semibold text-white mb-2">{benefit.title}</h3>
                                        <p className="text-sm text-zinc-500 leading-relaxed group-hover:text-zinc-400 transition-colors duration-300">
                                            {benefit.description}
                                        </p>
                                    </div>
                                </div>
                            </li>
                        );
                    })}
                </ul>

                {/* Bottom CTA banner */}
                <div className="relative rounded-2xl border border-white/[0.07] bg-zinc-900/40 overflow-hidden">

                    {/* Top accent line */}
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />

                    <div className="px-8 py-10 flex flex-col lg:flex-row items-center justify-between gap-8">

                        {/* Left */}
                        <div className="text-center lg:text-left">
                            <p className="text-base font-semibold text-white mb-1.5">
                                Start hiring today — it's free
                            </p>
                            <p className="text-sm text-zinc-500 max-w-sm">
                                Post your first job for free. Upgrade anytime for premium visibility, advanced analytics, and priority candidate matching.
                            </p>
                        </div>

                        {/* Right */}
                        <div className="flex flex-col sm:flex-row items-center gap-3 flex-shrink-0">
                            <Link
                                href="/post-job"
                                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors duration-200 shadow-lg shadow-indigo-500/20 w-full sm:w-auto justify-center"
                            >
                                Post a Job Free
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                            <Link
                                href="/pricing"
                                className="inline-flex items-center gap-2 rounded-xl border border-white/[0.09] bg-white/[0.04] px-6 py-3 text-sm font-semibold text-zinc-300 hover:bg-white/[0.09] hover:text-white transition-all duration-200 w-full sm:w-auto justify-center"
                            >
                                View Pricing
                            </Link>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default ForRecruiters;