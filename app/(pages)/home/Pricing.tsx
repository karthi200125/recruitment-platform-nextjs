'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

import { ArrowRight } from 'lucide-react';

import {
    getPublicPlans,
    type PublicPlan as Plan,
} from "@/lib/data/public-pricing-data";

type Role =
    | 'CANDIDATE'
    | 'RECRUITER'
    | 'ORGANIZATION';

const ROLE_TABS: {
    key: Role;
    label: string;
}[] = [
        {
            key: 'CANDIDATE',
            label: 'Candidate',
        },

        {
            key: 'RECRUITER',
            label: 'Recruiter',
        },

        {
            key: 'ORGANIZATION',
            label: 'Organization',
        },
    ];

const PLANS: Record<Role, Plan[]> = getPublicPlans();

const TRUST_ITEMS = [
    'No setup fees',
    'Cancel anytime',
    'Secure payments',
];

export default function Pricing() {
    const [role, setRole] = useState<Role>('CANDIDATE');

    const plans = useMemo(() => PLANS[role],
        [role]
    );

    return (
        <section
            aria-labelledby="pricing-heading"
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
                <div className="mb-6 flex justify-center">
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-5 py-2 backdrop-blur-xl">
                        <div className="h-2 w-2 rounded-full bg-indigo-400" />

                        <span className="text-xs font-medium uppercase tracking-[0.18em] text-white/60">
                            Transparent pricing
                        </span>
                    </div>
                </div>

                {/* HEADING */}
                <div className="mx-auto max-w-3xl text-center">
                    <h2
                        id="pricing-heading"
                        className="text-4xl font-semibold leading-[1.05] tracking-[-0.03em] text-white sm:text-5xl lg:text-6xl"
                    >
                        Flexible plans for
                        <span className="block bg-gradient-to-r from-indigo-400 via-violet-400 to-blue-400 bg-clip-text text-transparent">
                            every stage of growth
                        </span>
                    </h2>

                    <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-white/60 sm:text-lg">
                        Whether you&apos;re applying for jobs,
                        hiring candidates, or scaling recruitment
                        across teams — choose a plan designed for you.
                    </p>
                </div>

                {/* ROLE TOGGLE */}
                <div className="mt-14 flex justify-center">
                    <div className="inline-flex rounded-2xl border border-white/[0.08] bg-white/[0.03] p-1.5 backdrop-blur-xl">

                        {ROLE_TABS.map(({key,label}) => (
                                <button
                                    key={key}
                                    onClick={() => setRole(key)}
                                    aria-pressed={role === key}
                                    className={`
                                        rounded-xl px-6 py-3 text-sm font-medium
                                        transition-all duration-300

                                        ${role ===
                                            key
                                            ? 'bg-white/[0.08] text-white'
                                            : 'text-white/45 hover:text-white/80'
                                        }
                                    `}
                                >
                                    {label}
                                </button>
                            )
                        )}
                    </div>
                </div>

                {/* PLANS */}
                <div className="mx-auto mt-20 grid max-w-5xl grid-cols-1 gap-5 md:grid-cols-2">

                    {plans.map(
                        (
                            plan,
                            index
                        ) => {
                            const isFeatured =
                                !!plan.popular;

                            return (
                                <article
                                    key={
                                        plan.price
                                    }
                                    className={`
                                        group relative flex flex-col overflow-hidden rounded-[30px]
                                        border border-white/[0.08]
                                        bg-white/[0.03]
                                        p-8
                                        backdrop-blur-xl
                                        transition-all duration-300
                                        hover:-translate-y-1
                                        hover:border-white/[0.14]
                                        hover:bg-white/[0.05]

                                        ${isFeatured
                                            ? 'md:-translate-y-3'
                                            : ''
                                        }
                                    `}
                                >
                                    {/* TOP HAIRLINE */}
                                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                                    {/* FEATURED GLOW */}
                                    {isFeatured && (
                                        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-indigo-500/[0.06] via-transparent to-transparent" />
                                    )}

                                    {/* PLAN HEADER */}
                                    <div className="flex items-start justify-between gap-4">

                                        <div>
                                            <div className="flex items-center gap-3">

                                                <h3 className="text-lg font-semibold tracking-tight text-white">
                                                    {
                                                        plan.name
                                                    }
                                                </h3>

                                                {isFeatured && (
                                                    <span className="text-xs font-medium uppercase tracking-[0.16em] text-indigo-300">
                                                        Recommended
                                                    </span>
                                                )}
                                            </div>

                                            <p className="mt-3 text-sm text-white/45">
                                                {role ===
                                                    'CANDIDATE'
                                                    ? 'For professionals accelerating their careers.'
                                                    : role ===
                                                        'RECRUITER'
                                                        ? 'For recruiters hiring at scale.'
                                                        : 'For organizations building high-performing teams.'}
                                            </p>
                                        </div>

                                        {plan.interval ===
                                            'year' && (
                                                <div className="rounded-full border border-emerald-500/15 bg-emerald-500/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-emerald-300">
                                                    Save
                                                    20%
                                                </div>
                                            )}
                                    </div>

                                    {/* PRICE */}
                                    <div className="mt-10 flex items-end gap-1">

                                        <span className="pb-3 text-lg text-white/40">
                                            ₹
                                        </span>

                                        <span className="text-6xl font-semibold leading-none tracking-tight text-white">
                                            {plan.price.toLocaleString(
                                                'en-IN'
                                            )}
                                        </span>

                                        <span className="pb-2 text-sm text-white/35">
                                            /
                                            {
                                                plan.interval
                                            }
                                        </span>
                                    </div>

                                    {/* FEATURES */}
                                    <ul className="mt-10 flex flex-1 flex-col gap-4">

                                        {plan.features.map(
                                            (
                                                feature,
                                                i
                                            ) => (
                                                <li
                                                    key={
                                                        i
                                                    }
                                                    className="flex items-start gap-3"
                                                >
                                                    <div className="mt-[9px] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-400" />

                                                    <span className="text-sm leading-7 text-white/55">
                                                        {
                                                            feature
                                                        }
                                                    </span>
                                                </li>
                                            )
                                        )}
                                    </ul>

                                    {/* LIMITS */}
                                    {plan.limits && (
                                        <div className="mt-10 border-t border-white/[0.05] pt-6">

                                            <div className="flex flex-wrap gap-x-6 gap-y-3">

                                                {plan
                                                    .limits
                                                    .jobPosts !==
                                                    undefined && (
                                                        <div>
                                                            <p className="text-2xl font-semibold tracking-tight text-white">
                                                                {plan
                                                                    .limits
                                                                    .jobPosts ===
                                                                    -1
                                                                    ? '∞'
                                                                    : plan
                                                                        .limits
                                                                        .jobPosts}
                                                            </p>

                                                            <p className="mt-1 text-xs uppercase tracking-[0.16em] text-white/30">
                                                                Job
                                                                posts
                                                            </p>
                                                        </div>
                                                    )}

                                                {plan
                                                    .limits
                                                    .applications !==
                                                    undefined && (
                                                        <div>
                                                            <p className="text-2xl font-semibold tracking-tight text-white">
                                                                {plan
                                                                    .limits
                                                                    .applications ===
                                                                    -1
                                                                    ? '∞'
                                                                    : plan
                                                                        .limits
                                                                        .applications}
                                                            </p>

                                                            <p className="mt-1 text-xs uppercase tracking-[0.16em] text-white/30">
                                                                Applications
                                                            </p>
                                                        </div>
                                                    )}

                                                {plan
                                                    .limits
                                                    .aiMatches !==
                                                    undefined && (
                                                        <div>
                                                            <p className="text-2xl font-semibold tracking-tight text-white">
                                                                {plan
                                                                    .limits
                                                                    .aiMatches ===
                                                                    -1
                                                                    ? '∞'
                                                                    : plan
                                                                        .limits
                                                                        .aiMatches}
                                                            </p>

                                                            <p className="mt-1 text-xs uppercase tracking-[0.16em] text-white/30">
                                                                AI
                                                                matches
                                                            </p>
                                                        </div>
                                                    )}
                                            </div>
                                        </div>
                                    )}

                                    {/* CTA */}
                                    <div className="mt-10">

                                        <Link
                                            href="/signin"
                                            aria-label={`Choose ${plan.name} plan`}
                                            className={`
                                                inline-flex h-14 w-full items-center justify-center gap-2
                                                rounded-2xl
                                                text-sm font-medium
                                                transition-all duration-300

                                                ${isFeatured
                                                    ? 'bg-white text-black hover:bg-white/90'
                                                    : 'border border-white/[0.08] bg-white/[0.03] text-white/70 hover:border-white/[0.14] hover:bg-white/[0.06] hover:text-white'
                                                }
                                            `}
                                        >
                                            {isFeatured
                                                ? 'Get started'
                                                : 'Choose plan'}

                                            <ArrowRight className="h-4 w-4" />
                                        </Link>
                                    </div>
                                </article>
                            );
                        }
                    )}
                </div>

                {/* TRUST STRIP */}
                <div className="mt-16 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">

                    {TRUST_ITEMS.map(
                        (item) => (
                            <div
                                key={item}
                                className="flex items-center gap-3"
                            >
                                <div className="h-1.5 w-1.5 rounded-full bg-white/20" />

                                <span className="text-sm text-white/35">
                                    {item}
                                </span>
                            </div>
                        )
                    )}
                </div>
            </div>
        </section>
    );
}