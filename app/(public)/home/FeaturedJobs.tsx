"use client";

import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { memo } from "react";

import { useQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";

import {
    getFeaturedJobs,
    type FeaturedJob,
} from "@/actions/job/get-featured-jobs";

import CtaButton from "@/components/ui/CtaButton";
import noImage from "@/public/noImage.webp";

const stripHtml = (html: string) =>
    html.replace(/<[^>]*>/g, "");

const formatSalary = (
    salary: number | string
): string => {
    const num =
        typeof salary === "string"
            ? parseFloat(salary)
            : salary;

    if (Number.isNaN(num)) {
        return String(salary);
    }

    return `₹${num.toLocaleString("en-IN")} / yr`;
};

const MODE_STYLES: Record<string, string> = {
    remote: "text-emerald-300",
    hybrid: "text-violet-300",
    onsite: "text-amber-300",
};

const SkeletonCard = memo(() => (
    <div className="flex flex-col rounded-[28px] border border-white/[0.08] bg-white/[0.03] p-7 animate-pulse">
        <div className="mb-6 flex items-start justify-between">
            <div className="h-14 w-14 rounded-2xl bg-white/[0.05]" />
            <div className="h-5 w-16 rounded-full bg-white/[0.05]" />
        </div>
        <div className="mb-5 space-y-3">
            <div className="h-5 w-3/4 rounded-lg bg-white/[0.05]" />
            <div className="h-4 w-1/3 rounded-lg bg-white/[0.05]" />
        </div>
        <div className="mb-6 space-y-2">
            <div className="h-3 w-full rounded bg-white/[0.05]" />
            <div className="h-3 w-5/6 rounded bg-white/[0.05]" />
            <div className="h-3 w-4/6 rounded bg-white/[0.05]" />
        </div>
        <div className="mb-7 flex gap-2">
            <div className="h-7 w-16 rounded-xl bg-white/[0.05]" />
            <div className="h-7 w-16 rounded-xl bg-white/[0.05]" />
            <div className="h-7 w-16 rounded-xl bg-white/[0.05]" />
        </div>
        <div className="mt-auto flex items-center justify-between border-t border-white/[0.05] pt-5">
            <div className="h-4 w-24 rounded bg-white/[0.05]" />
            <div className="h-4 w-20 rounded bg-white/[0.05]" />
        </div>
    </div>
));

SkeletonCard.displayName = "SkeletonCard";

const EmptyState = memo(() => (
    <div className="col-span-full flex flex-col items-center py-28 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-3xl border border-white/[0.08] bg-white/[0.03]">
            <svg
                className="h-7 w-7 text-zinc-700"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5"
                />
            </svg>
        </div>

        <p className="mt-5 text-sm text-zinc-500">
            No featured jobs available right now.
        </p>
    </div>
));

EmptyState.displayName = "EmptyState";

const ErrorState = memo(() => (
    <div className="col-span-full flex flex-col items-center py-28 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-3xl border border-red-500/15 bg-red-500/5">
            <svg
                className="h-7 w-7 text-red-400/60"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 9v2m0 4h.01"
                />
            </svg>
        </div>

        <p className="mt-5 text-sm text-zinc-500">
            Failed to load featured jobs.
        </p>
    </div>
));

ErrorState.displayName = "ErrorState";

const JobCard = memo(
    ({
        job,
        featured,
    }: {
        job: FeaturedJob;
        featured?: boolean;
    }) => {
        const imageSrc:
            | string
            | StaticImageData =
            job.company?.companyImage ||
            noImage;

        const modeLower =
            job.mode.toLowerCase();

        const badgeClass =
            MODE_STYLES[modeLower] ??
            "text-zinc-400";

        return (
            <article
                className={`
                    group relative flex h-full flex-col overflow-hidden rounded-[30px]
                    border border-white/[0.08]
                    bg-white/[0.03]
                    p-7
                    backdrop-blur-xl
                    transition-all duration-300
                    hover:-translate-y-1
                    hover:border-white/[0.14]
                    hover:bg-white/[0.05]

                    ${featured
                        ? "sm:col-span-2"
                        : ""
                    }
                `}
            >
                {/* TOP HAIRLINE */}
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                {/* FEATURED GLOW */}
                {featured && (
                    <div className="absolute inset-0 -z-10 bg-gradient-to-br from-indigo-500/5 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                )}

                {/* TOP */}
                <div className="mb-7 flex items-start justify-between">
                    <div className="relative h-14 w-14 overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.03]">
                        <Image
                            src={imageSrc}
                            alt={
                                job.company
                                    ?.companyName ??
                                "Company logo"
                            }
                            fill
                            sizes="56px"
                            className="object-cover"
                        />
                    </div>

                    <div
                        className={`inline-flex items-center gap-2 text-xs font-medium capitalize ${badgeClass}`}
                    >
                        <span
                            className={`h-2 w-2 rounded-full ${modeLower ===
                                "remote"
                                ? "bg-emerald-400"
                                : modeLower ===
                                    "hybrid"
                                    ? "bg-violet-400"
                                    : "bg-amber-400"
                                }`}
                        />

                        {job.mode}
                    </div>
                </div>

                {/* CONTENT */}
                <div className="flex flex-1 flex-col">

                    {/* TITLE */}
                    <div className="mb-5">
                        <h3
                            className={`
                                font-semibold tracking-tight text-white transition-colors duration-300
                                group-hover:text-indigo-300

                                ${featured
                                    ? "text-2xl"
                                    : "text-lg"
                                }
                            `}
                        >
                            {job.jobTitle}
                        </h3>

                        {job.company
                            ?.companyName && (
                                <p className="mt-2 text-sm font-medium text-white/40">
                                    {
                                        job.company
                                            .companyName
                                    }
                                </p>
                            )}
                    </div>

                    {/* DESCRIPTION */}
                    <p
                        className={`
                            flex-1 text-sm leading-7 text-white/50 transition-colors duration-300
                            group-hover:text-white/60

                            ${featured
                                ? "max-w-2xl line-clamp-3"
                                : "line-clamp-2"
                            }
                        `}
                    >
                        {stripHtml(
                            job.jobDesc ??
                            "No description provided."
                        )}
                    </p>

                    {/* SKILLS */}
                    {job.skills?.length ? (
                        <ul className="mt-6 flex flex-wrap gap-2">
                            {job.skills
                                .slice(0, 3)
                                .map((skill) => (
                                    <li
                                        key={`${job.id}-${skill}`}
                                        className="rounded-xl bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-white/50"
                                    >
                                        {skill}
                                    </li>
                                ))}

                            {job.skills.length >
                                3 && (
                                    <li className="rounded-xl bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-white/40">
                                        +
                                        {job.skills
                                            .length -
                                            3}
                                    </li>
                                )}
                        </ul>
                    ) : null}

                    {/* FOOTER */}
                    <div className="mt-8 flex items-center justify-between border-t border-white/[0.05] pt-5">
                        <span className="text-base font-semibold tracking-tight text-white">
                            {formatSalary(
                                job.salary
                            )}
                        </span>

                        <Link
                            href="/jobs"
                            className="group/link inline-flex items-center gap-2 text-sm font-medium text-indigo-300 transition-colors duration-300 hover:text-indigo-200"
                            aria-label={`View ${job.jobTitle} job`}
                        >
                            View role

                            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/link:translate-x-1" />
                        </Link>
                    </div>
                </div>
            </article>
        );
    }
);

JobCard.displayName = "JobCard";

const FeaturedJobs = () => {
    const {
        data: jobs = [],
        isPending,
        isError,
    } = useQuery({
        queryKey: ["featured-jobs"],
        queryFn: async () => {
            const res =
                await getFeaturedJobs();

            if (!res.success) {
                throw new Error(
                    res.error
                );
            }

            return res.data;
        },

        staleTime: 1000 * 60 * 10,
        gcTime: 1000 * 60 * 30,
        refetchOnWindowFocus: false,
        retry: 2,
    });

    const featuredJobs = jobs.slice(
        0,
        3
    );

    return (
        <section
            aria-labelledby="featured-jobs-heading"
            className="relative overflow-hidden bg-[#09090B] py-28"
        >
            {/* BACKGROUND */}
            <div className="absolute inset-0 -z-20 bg-black" />

            {/* TOP GLOW */}
            <div className="absolute inset-x-0 top-0 -z-10 h-[350px] bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.18),transparent_72%)]" />

            {/* SIDE GLOW */}
            <div className="absolute right-0 top-1/3 -z-10 h-[300px] w-[300px] rounded-full bg-indigo-500/10 blur-3xl" />

            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                {/* HEADER */}
                <div className="mx-auto max-w-3xl text-center">

                    {/* EYEBROW */}
                    <div className="mb-6 flex justify-center">
                        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-5 py-2 backdrop-blur-xl">
                            <div className="h-2 w-2 rounded-full bg-indigo-400" />

                            <span className="text-xs font-medium uppercase tracking-[0.18em] text-white/60">
                                Now Hiring
                            </span>
                        </div>
                    </div>

                    {/* HEADING */}
                    <h2
                        id="featured-jobs-heading"
                        className="text-4xl font-semibold leading-[1.05] tracking-[-0.03em] text-white sm:text-5xl lg:text-6xl"
                    >
                        Find your next
                        <span className="block bg-gradient-to-r from-indigo-400 via-violet-400 to-blue-400 bg-clip-text text-transparent">
                            big opportunity
                        </span>
                    </h2>

                    {/* DESCRIPTION */}
                    <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-white/60 sm:text-lg">
                        Curated opportunities from
                        fast-growing startups and
                        industry-leading companies.
                    </p>
                </div>

                {/* GRID */}
                <div className="mt-20 grid grid-cols-1 gap-5 sm:grid-cols-2">
                    {isPending ? (
                        Array.from({
                            length: 3,
                        }).map((_, i) => (
                            <SkeletonCard
                                key={i}
                            />
                        ))
                    ) : isError ? (
                        <ErrorState />
                    ) : featuredJobs.length ===
                        0 ? (
                        <EmptyState />
                    ) : (
                        featuredJobs.map(
                            (
                                job,
                                index
                            ) => (
                                <JobCard
                                    key={job.id}
                                    job={job}
                                    featured={
                                        index === 0
                                    }
                                />
                            )
                        )
                    )}
                </div>

                {/* CTA */}
                {!isPending &&
                    !isError &&
                    featuredJobs.length >
                    0 && (
                        <div className="mt-14 flex justify-center">
                            <CtaButton
                                href="/jobs"
                                variant="secondary"
                            >
                                Browse all jobs
                            </CtaButton>
                        </div>
                    )}
            </div>
        </section>
    );
};

export default memo(FeaturedJobs);