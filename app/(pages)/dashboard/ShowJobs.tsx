"use client";

import Link from "next/link";
import { HiArrowLongRight } from "react-icons/hi2";
import { Prisma } from "@prisma/client";

import JobList from "../jobs/JobLists/JobList";

type JobWithCompany = Prisma.JobGetPayload<{
    include: {
        company: true;
    };
}>;

interface ShowJobsProps {
    Jobs?: JobWithCompany[];
    title: string;
    href: string;
}

const ShowJobs = ({ Jobs = [], title, href }: ShowJobsProps) => {
    const hasJobs = Jobs.length > 0;

    return (
        <section className="space-y-4">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">
                    {title} ({Jobs.length})
                </h2>

                {Jobs.length > 4 && (
                    <Link
                        href={href}
                        className="flex items-center gap-2 text-sm text-neutral-600 hover:text-black"
                    >
                        View all <HiArrowLongRight />
                    </Link>
                )}
            </div>

            {/* Content */}
            {!hasJobs ? (
                <Empty text={`No ${title.toLowerCase()} yet`} />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {Jobs.slice(0, 4).map((job) => (
                        <div
                            key={job.id}
                            className="border rounded-2xl p-4 bg-white shadow-sm hover:shadow-md transition"
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

const Empty = ({ text }: { text: string }) => (
    <div className="text-center py-10 text-neutral-500 border rounded-2xl">
        <div className="text-3xl mb-2">📭</div>
        <p>{text}</p>
    </div>
);