"use client";

import Link from "next/link";
import { ArrowRight, Briefcase } from "lucide-react";
import { Prisma } from "@prisma/client";
import JobList from "../jobs/JobLists/JobList";

type JobWithCompany = Prisma.JobGetPayload<{
    include: { company: true };
}>;

interface ShowJobsProps {
    Jobs?: JobWithCompany[];
    title: string;
    href: string;
    type?: string;
}

const Empty = ({ text }: { text: string }) => (
    <div className="flex flex-col items-center justify-center gap-3 py-12 rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 text-center">
        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
            <Briefcase className="w-5 h-5 text-slate-400" strokeWidth={1.75} />
        </div>
        <p className="text-sm font-medium text-slate-500">{text}</p>
    </div>
);

const ShowJobs = ({ Jobs = [], title, href, type }: ShowJobsProps) => {
    const hasJobs = Jobs.length > 0;
    const preview = Jobs.slice(0, 4);

    return (
        <section className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-slate-800">{title}</h2>
                    <span className="text-xs font-semibold text-slate-500 bg-slate-100 rounded-full px-2 py-0.5">
                        {Jobs.length}
                    </span>
                </div>
                {Jobs.length > 4 && (
                    <Link
                        href={href}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors duration-200"
                    >
                        View all
                        <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                )}
            </div>

            {/* Content */}
            {!hasJobs ? (
                <Empty text={`No ${title.toLowerCase()} yet`} />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {preview.map((job) => (
                        <div
                            key={job.id}
                            className="rounded-2xl border border-slate-200 bg-white p-4 hover:border-indigo-200 hover:shadow-sm hover:-translate-y-0.5 transition-all duration-200"
                        >
                            <JobList job={job} appliedJob="dashboard" />
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
};

export default ShowJobs;