'use client';

import { getCompanyById } from "@/actions/company/getCompanyById";
import { useQuery } from "@tanstack/react-query";

import JobCompany from "./JobCompany";
import JobDescription from "./JobDescription";
import JobPremium from "./JobPremium";
import JobRecruiter from "./JobRecruiter";
import JobTitles from "./JobTitles";

import { useCurrentUser } from "../../../../hooks/useCurrentUser";
import { JobSearchParams } from "../Job";

// ✅ TYPES

interface Job {
    id: number;
    companyId: number;
    userId: number;
    jobTitle: string;
    jobDesc: string;
}

interface Company {
    id: number;
    companyName: string;
    companyImage?: string | null;
    companyAbout: string;
    companyTotalEmployees: string;
    userId: number;
}

interface JobDescProps {
    job: Job;
    safeSearchParams?: JobSearchParams;
}

const JobDetails: React.FC<JobDescProps> = ({
    job,
    safeSearchParams,
}) => {
    const { user } = useCurrentUser();
    const companyId = job.companyId;

    // ✅ Only fetch company here
    const {
        data: company,
        isPending: isCompanyLoading,
    } = useQuery<Company>({
        queryKey: ["company", companyId],
        queryFn: () => getCompanyById(companyId),
        enabled: !!companyId,
        staleTime: 1000 * 60 * 5,
    });

    const isDataLoading = isCompanyLoading || !company;

    return (
        <div className="w-full h-full overflow-y-auto p-5 space-y-5">
            {/* Job Title */}
            <JobTitles
                user={user}
                job={job}
                company={company}
                isPending={isDataLoading}
                safeSearchParams={safeSearchParams}
            />

            {/* Recruiter */}
            <JobRecruiter
                job={job}
                company={company}
                isPending={isDataLoading}
            />

            {/* Description */}
            <JobDescription
                job={job}
                isPending={isDataLoading}
            />

            {/* Premium */}
            {!user?.isPro && <JobPremium />}

            {/* Company + Follow */}
            {user?.role !== "ORGANIZATION" && company && (
                <JobCompany
                    company={company}
                    isPending={isDataLoading}
                />
            )}
        </div>
    );
};

export default JobDetails;