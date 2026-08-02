'use client';

import { useCurrentUser } from "@/hooks/useCurrentUser";

import { JobSearchParams, JobWithCompany } from "@/types";
import JobCompany from "./JobCompany";
import JobDescription from "./JobDescription";
import JobRecruiter from "./JobRecruiter";
import JobTitles from "./JobTitles";

interface JobDetailsProps {
    job: JobWithCompany;
    safeSearchParams?: JobSearchParams;
}

const JobDetails = ({
    job,
    safeSearchParams,
}: JobDetailsProps) => {
    const { user } = useCurrentUser();

    const company = job.company;

    return (
        <div className="h-full w-full overflow-y-auto">
            <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-slate-100 bg-white/90 px-6 py-3 backdrop-blur-sm">
                <div className="min-w-0">
                    <p className="truncate text-sm font-bold capitalize text-slate-800">
                        {job.jobTitle}
                    </p>

                    <p className="truncate text-xs text-slate-400">
                        {company.companyName}
                    </p>
                </div>
            </div>

            <div className="space-y-5 p-6">
                <JobTitles
                    user={user}
                    job={job}
                    company={company}
                    isPending={false}
                    safeSearchParams={safeSearchParams}
                />

                <div className="h-px bg-slate-100" />

                <JobRecruiter
                    job={job}
                    company={company}
                />

                <div className="h-px bg-slate-100" />

                <JobDescription
                    job={job}
                    isPending={false}
                />
                
                {user?.role !== "ORGANIZATION" && (
                    <>
                        <div className="h-px bg-slate-100" />

                        <JobCompany
                            company={company}
                            isPending={false}
                        />
                    </>
                )}
            </div>
        </div>
    );
};

export default JobDetails;