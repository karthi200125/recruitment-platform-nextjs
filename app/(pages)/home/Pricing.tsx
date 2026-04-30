'use client';

import { useState } from "react";
import { FaCheck } from "react-icons/fa6";

type Role = "CANDIDATE" | "RECRUITER" | "ORGANIZATION";

const ROLE_TABS: { key: Role; label: string }[] = [
    { key: "CANDIDATE", label: "Candidate" },
    { key: "RECRUITER", label: "Recruiter" },
    { key: "ORGANIZATION", label: "Organization" },
];

export default function Pricing() {
    const [role, setRole] = useState<Role>("CANDIDATE");
    const PLANS = []
    const plans = PLANS[role];

    return (
        <section className="relative w-full min-h-screen text-white overflow-hidden py-24 px-4 sm:px-6 lg:px-8">

            {/* Ambient glow */}
            <div className="pointer-events-none absolute inset-0 flex justify-center">
                <div className="w-[700px] h-[400px] rounded-full bg-indigo-600/10 blur-[120px] -translate-y-1/4" />
            </div>

            <div className="relative max-w-5xl mx-auto">

                {/* Eyebrow */}
                <div className="flex justify-center mb-5">
                    <span className="inline-flex items-center gap-2 rounded-full border border-indigo-500/25 bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-indigo-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                        Transparent pricing
                    </span>
                </div>

                {/* Heading */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] text-white mb-4">
                        Plans for every{" "}
                        <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                            ambition
                        </span>
                    </h1>
                    <p className="text-zinc-400 text-base sm:text-lg max-w-md mx-auto leading-relaxed">
                        Pick your role, pick your plan. Scale up or cancel anytime.
                    </p>
                </div>

                {/* Role Toggle */}
                <div className="flex justify-center mb-12">
                    <div className="flex items-center gap-1 rounded-xl border border-white/[0.07] bg-white/[0.03] p-1.5">
                        {ROLE_TABS.map(({ key, label }) => (
                            <button
                                key={key}
                                onClick={() => setRole(key)}
                                className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${role === key
                                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
                                        : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.05]"
                                    }`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Plan Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-3xl mx-auto">
                    {plans.map((plan) => {
                        const isFeatured = !!plan.popular;
                        const isYearly = plan.interval === "year";

                        return (
                            <div
                                key={plan.priceId}
                                className={`relative flex flex-col rounded-2xl p-8 transition-transform duration-200 hover:-translate-y-1 ${isFeatured
                                        ? "bg-indigo-950/60 border border-indigo-500/40 shadow-xl shadow-indigo-500/10"
                                        : "bg-zinc-900/60 border border-white/[0.07]"
                                    }`}
                            >
                                {/* Popular badge */}
                                {isFeatured && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                        <span className="inline-block rounded-full bg-indigo-600 px-4 py-1 text-[11px] font-semibold tracking-wide text-white shadow-lg shadow-indigo-500/30">
                                            Most Popular
                                        </span>
                                    </div>
                                )}

                                {/* Plan name + yearly badge */}
                                <div className="flex items-center gap-2 mb-1">
                                    <p className={`text-sm font-semibold tracking-wide uppercase ${isFeatured ? "text-indigo-300" : "text-zinc-400"}`}>
                                        {plan.name}
                                    </p>
                                    {isYearly && (
                                        <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400">
                                            Save 20%
                                        </span>
                                    )}
                                </div>

                                {/* Price */}
                                <div className="flex items-end gap-1 mt-4 mb-6">
                                    <span className="text-xl font-medium text-zinc-400 mb-1">₹</span>
                                    <span className={`text-5xl font-bold tracking-tight leading-none ${isFeatured ? "text-white" : "text-zinc-100"}`}>
                                        {plan.price.toLocaleString("en-IN")}
                                    </span>
                                    <span className="text-sm text-zinc-500 mb-1 ml-0.5">/{plan.interval}</span>
                                </div>

                                {/* Divider */}
                                <div className={`h-px mb-6 ${isFeatured ? "bg-indigo-500/20" : "bg-white/[0.06]"}`} />

                                {/* Features */}
                                <ul className="flex flex-col gap-3 mb-8 flex-1">
                                    {plan.features.map((feature, i) => (
                                        <li key={i} className="flex items-start gap-3 text-sm">
                                            <span className="mt-0.5 flex-shrink-0 w-4 h-4 rounded-full bg-emerald-500/15 flex items-center justify-center">
                                                <FaCheck className="text-emerald-400 text-[9px]" />
                                            </span>
                                            <span className={isFeatured ? "text-indigo-100/80" : "text-zinc-400"}>
                                                {feature}
                                            </span>
                                        </li>
                                    ))}
                                </ul>

                                {/* CTA */}
                                <button
                                    className={`w-full rounded-xl py-3 text-sm font-semibold transition-all duration-200 ${isFeatured
                                            ? "bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40"
                                            : "bg-white/[0.06] text-zinc-300 border border-white/[0.08] hover:bg-white/10 hover:text-white"
                                        }`}
                                >
                                    {isFeatured ? "Get started →" : "Choose plan"}
                                </button>
                            </div>
                        );
                    })}
                </div>

                {/* Trust strip */}
                <div className="flex flex-wrap items-center justify-center gap-8 mt-14">
                    {["No setup fees", "Cancel anytime", "Secure payments"].map((item) => (
                        <div key={item} className="flex items-center gap-2 text-xs text-zinc-600">
                            <span className="w-1 h-1 rounded-full bg-zinc-700" />
                            {item}
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}
