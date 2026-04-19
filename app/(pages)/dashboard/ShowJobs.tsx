'use client';

import Link from 'next/link';
import { HiArrowLongRight } from 'react-icons/hi2';
import { Prisma } from '@prisma/client';

import JobListsSkeleton from '@/Skeletons/JobListsSkeleten';
import JobList from '../jobs/JobLists/JobList';

// ✅ Types
type JobWithCompany = Prisma.JobGetPayload<{
    include: {
        company: {
            select: {
                id: true;
                companyName: true;
                companyImage: true;
            };
        };
        _count: {
            select: {
                jobApplications: true;
            };
        };
    };
}>;

interface ShowJobsProps {
    Jobs?: JobWithCompany[];
    isLoading?: boolean;
    title?: string;
    href?: string;
    type?: 'applied' | 'posted';
}

const ShowJobs = ({
    Jobs = [],
    isLoading,
    title = 'Jobs',
    href = '/dashboard',
    type,
}: ShowJobsProps) => {
    const hasJobs = Jobs.length > 0;

    return (
        <section className="space-y-4">
            {/* 🔹 Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">
                    {title} <span className="text-neutral-400">({Jobs.length})</span>
                </h2>

                {Jobs.length > 4 && (
                    <Link
                        href={href}
                        className="flex items-center gap-2 text-sm font-medium text-neutral-600 hover:text-black transition"
                    >
                        View all
                        <HiArrowLongRight size={18} />
                    </Link>
                )}
            </div>

            {/* 🔹 Content */}
            {isLoading ? (
                <JobListsSkeleton isDash count={2} />
            ) : !hasJobs ? (
                <EmptyState text={`No ${title.toLowerCase()} yet`} />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-5">
                    {Jobs.slice(0, 4).map((job) => (
                        <div
                            key={job.id}
                            className="group border rounded-2xl p-4 bg-white/70 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300"
                        >
                            <JobList
                                job={job}
                                appliedJob="dashboard"
                                app_or_pos={type}
                            />
                        </div>
                    ))}
                </div>
            )}

            {/* 🔹 Bottom CTA (mobile friendly) */}
            {Jobs.length > 4 && (
                <div className="flex justify-center md:hidden">
                    <Link
                        href={href}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium hover:bg-black hover:text-white transition"
                    >
                        Show all {title}
                        <HiArrowLongRight size={18} />
                    </Link>
                </div>
            )}
        </section>
    );
};

export default ShowJobs;

// ================= EMPTY STATE =================

const EmptyState = ({ text }: { text: string }) => {
    return (
        <div className="flex flex-col items-center justify-center py-12 text-center text-neutral-500 border rounded-2xl">
            <div className="text-3xl mb-2">📭</div>
            <p className="text-sm">{text}</p>
        </div>
    );
};