'use client';

import JobCompany from "./JobCompany";
import JobDescription from "./JobDescription";
import JobPremium from "./JobPremium";
import JobRecruiter from "./JobRecruiter";
import JobTitles from "./JobTitles";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { JobWithCompany } from "@/actions/job/getFilterAllJobs";

interface JobDetailsProps {
    job: JobWithCompany;
    safeSearchParams?: any;
}

const JobDetails: React.FC<JobDetailsProps> = ({ job, safeSearchParams }) => {
    const { user } = useCurrentUser();
    const company = job.company;

    return (
        <div className="w-full h-full overflow-y-auto">
            {/* Sticky header — job title + apply CTA visible on scroll */}
            <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm border-b border-slate-100 px-6 py-3 flex items-center justify-between gap-4">
                <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-800 truncate capitalize">{job.jobTitle}</p>
                    <p className="text-xs text-slate-400 truncate">{company?.companyName}</p>
                </div>
            </div>

            <div className="p-6 space-y-5">
                {/* Job title block */}
                <JobTitles
                    user={user}
                    job={job}
                    company={company}
                    isPending={false}
                    safeSearchParams={safeSearchParams}
                />

                <div className="h-px bg-slate-100" />

                {/* Recruiter */}
                <JobRecruiter job={job} company={company} />

                <div className="h-px bg-slate-100" />

                {/* Description */}
                <JobDescription job={job} isPending={false} />

                {/* Premium upsell */}
                {!user?.isPro && <JobPremium />}

                {/* Company card */}
                {user?.role !== "ORGANIZATION" && company && (
                    <>
                        <div className="h-px bg-slate-100" />
                        <JobCompany company={company} isPending={false} />
                    </>
                )}
            </div>
        </div>
    );
};

export default JobDetails;