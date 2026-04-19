'use client';

import Image, { StaticImageData } from 'next/image';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { getFeaturedJobs } from '@/actions/job/getFeaturedJobs';
import noImage from '@/public/noImage.webp';
import { ArrowRight } from 'lucide-react';

interface Company {
    companyName?: string;
    companyImage?: string | null;
}

interface Job {
    id: number;
    jobTitle: string;
    jobDesc?: string | null;
    mode: string;
    salary: number | string;
    skills?: string[];
    company?: Company | null;
}

const stripHtml = (html: string) => html.replace(/<[^>]*>/g, '');

const formatSalary = (salary: number | string): string => {
    const num = typeof salary === 'string' ? parseFloat(salary) : salary;
    if (Number.isNaN(num)) return String(salary);
    return `₹${num.toLocaleString('en-IN')} / yr`;
};

const MODE_STYLES: Record<string, string> = {
    remote: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    hybrid: 'bg-violet-500/10 text-violet-400 border border-violet-500/20',
    onsite: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
};


const SkeletonCard = () => (
    <div className="flex flex-col rounded-2xl border border-white/[0.07] bg-zinc-900/50 p-6 animate-pulse">
        <div className="flex items-start justify-between mb-5">
            <div className="w-12 h-12 rounded-xl bg-white/[0.05]" />
            <div className="w-16 h-6 rounded-full bg-white/[0.05]" />
        </div>
        <div className="space-y-2 mb-4">
            <div className="h-4 w-3/4 rounded-lg bg-white/[0.05]" />
            <div className="h-3 w-1/2 rounded-lg bg-white/[0.05]" />
        </div>
        <div className="space-y-1.5 mb-5 flex-1">
            <div className="h-3 w-full rounded bg-white/[0.05]" />
            <div className="h-3 w-5/6 rounded bg-white/[0.05]" />
            <div className="h-3 w-4/6 rounded bg-white/[0.05]" />
        </div>
        <div className="flex gap-2 mb-5">
            <div className="h-6 w-14 rounded-lg bg-white/[0.05]" />
            <div className="h-6 w-14 rounded-lg bg-white/[0.05]" />
            <div className="h-6 w-14 rounded-lg bg-white/[0.05]" />
        </div>
        <div className="h-px bg-white/[0.05] mb-4" />
        <div className="flex items-center justify-between">
            <div className="h-4 w-24 rounded bg-white/[0.05]" />
            <div className="h-4 w-16 rounded bg-white/[0.05]" />
        </div>
    </div>
);


const EmptyState = () => (
    <div className="col-span-full flex flex-col items-center gap-4 py-24 text-center">
        <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/[0.07] flex items-center justify-center">
            <svg className="w-6 h-6 text-zinc-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
        </div>
        <p className="text-zinc-600 text-sm">No featured jobs right now. Check back soon.</p>
    </div>
);


const ErrorState = () => (
    <div className="col-span-full flex flex-col items-center gap-4 py-24 text-center">
        <div className="w-14 h-14 rounded-2xl bg-red-500/5 border border-red-500/20 flex items-center justify-center">
            <svg className="w-6 h-6 text-red-400/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
        </div>
        <p className="text-zinc-600 text-sm">Failed to load jobs. Please try again later.</p>
    </div>
);


const JobCard = ({ job, index }: { job: Job; index: number }) => {
    const imageSrc: string | StaticImageData = job.company?.companyImage || noImage;
    const modeLower = job.mode.toLowerCase();
    const badgeClass = MODE_STYLES[modeLower] ?? 'bg-white/[0.05] text-zinc-500 border border-white/[0.07]';

    return (
        <article className="group flex flex-col rounded-2xl border border-white/[0.07] bg-zinc-900/50 p-6 hover:border-indigo-500/35 hover:-translate-y-1 hover:bg-zinc-900/80 hover:shadow-xl hover:shadow-indigo-500/[0.08] transition-all duration-300">

            {/* Top row — logo + mode badge */}
            <div className="flex items-start justify-between mb-5">
                <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-white/[0.08] bg-white/[0.04] flex-shrink-0">
                    <Image
                        src={imageSrc}
                        alt={job.company?.companyName ?? 'Company logo'}
                        fill
                        sizes="48px"
                        className="object-cover"
                    />
                </div>
                <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full capitalize tracking-wide ${badgeClass}`}>
                    {job.mode}
                </span>
            </div>

            {/* Title + company */}
            <div className="mb-3 space-y-0.5">
                <h3 className="text-white font-semibold text-[15px] leading-snug capitalize line-clamp-2 group-hover:text-indigo-300 transition-colors duration-200">
                    {job.jobTitle}
                </h3>
                {job.company?.companyName && (
                    <p className="text-zinc-600 text-xs font-medium capitalize">
                        {job.company.companyName}
                    </p>
                )}
            </div>

            {/* Description */}
            <p className="text-zinc-500 text-[13px] leading-relaxed line-clamp-3 mb-5 flex-1 group-hover:text-zinc-400 transition-colors duration-300">
                {stripHtml(job.jobDesc ?? 'No description provided.')}
            </p>

            {/* Skills */}
            {job.skills?.length ? (
                <ul className="flex flex-wrap gap-1.5 mb-5">
                    {job.skills.slice(0, 4).map((skill) => (
                        <li
                            key={`${job.id}-${skill}`}
                            className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-white/[0.04] text-zinc-500 border border-white/[0.07] hover:bg-white/[0.08] hover:text-zinc-300 transition-colors duration-150"
                        >
                            {skill}
                        </li>
                    ))}
                    {job.skills.length > 4 && (
                        <li className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-white/[0.04] text-zinc-600 border border-white/[0.07]">
                            +{job.skills.length - 4}
                        </li>
                    )}
                </ul>
            ) : null}

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-white/[0.06]">
                <span className="text-white font-semibold text-sm tabular-nums">
                    {formatSalary(job.salary)}
                </span>
                <Link
                    href={`/jobs`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors duration-150 group/link"
                    aria-label={`View ${job.jobTitle} job`}
                >
                    View Role
                    <ArrowRight className="w-3.5 h-3.5 translate-x-0 group-hover/link:translate-x-0.5 transition-transform duration-150" />
                </Link>
            </div>
        </article>
    );
};


const FeaturedJobs = () => {
    const { data: jobs = [], isPending, isError } = useQuery({
        queryKey: ['featured-jobs'],
        queryFn: async () => {
            const res = await getFeaturedJobs();
            if (!res.success) throw new Error(res.error);
            return res.data;
        },
    });

    return (
        <section
            aria-labelledby="featured-jobs-heading"
            className="relative w-full bg-[#09090b] py-24 px-4 sm:px-6 lg:px-8 overflow-hidden"
        >
            {/* Ambient glow */}
            <div className="pointer-events-none absolute inset-0 flex justify-center items-center">
                <div className="w-[700px] h-[350px] rounded-full bg-indigo-600/7 blur-[120px]" />
            </div>

            <div className="relative max-w-6xl mx-auto space-y-12">

                {/* Header */}
                <div className="max-w-xl mx-auto text-center space-y-4">
                    <div className="flex justify-center">
                        <span className="inline-flex items-center gap-2 rounded-full border border-indigo-500/25 bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-indigo-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                            Now Hiring
                        </span>
                    </div>
                    <h2
                        id="featured-jobs-heading"
                        className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-[1.1]"
                    >
                        Featured{" "}
                        <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                            job openings
                        </span>
                    </h2>
                    <p className="text-zinc-400 text-base leading-relaxed">
                        Verified opportunities from top employers — updated daily.
                    </p>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {isPending
                        ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
                        : isError
                            ? <ErrorState />
                            : jobs.length === 0
                                ? <EmptyState />
                                : jobs.map((job, i) => <JobCard key={job.id} job={job} index={i} />)
                    }
                </div>

                {/* View all CTA */}
                {!isPending && !isError && jobs.length > 0 && (
                    <div className="flex justify-center pt-2">
                        <Link
                            href="/jobs"
                            className="inline-flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.04] px-6 py-3 text-sm font-semibold text-zinc-300 hover:bg-white/[0.08] hover:text-white hover:border-white/20 transition-all duration-200"
                        >
                            Browse all jobs
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                )}
            </div>
        </section>
    );
};

export default FeaturedJobs;