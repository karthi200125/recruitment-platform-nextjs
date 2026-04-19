'use client';

import { getCompanyById } from "@/actions/company/getCompanyById";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import JobCompany from "./JobCompany";
import JobDescription from "./JobDescription";
import JobPremium from "./JobPremium";
import JobRecruiter from "./JobRecruiter";
import JobTitles from "./JobTitles";

interface JobDescProps {
    job: any;
    safeSearchParams?: any;
}

const JobDetails = ({ job, safeSearchParams }: JobDescProps) => {
    const user = useSelector((state: any) => state.user.user);
    const cId = job?.companyId;

    const { data, isPending } = useQuery({
        queryKey: ['getCompany', cId],
        queryFn: () => getCompanyById(cId),
        enabled: !!cId,
    });

    const memoizedCompanyData = useMemo(() => data, [data]);
    const isDataLoading = isPending || !job;

    return (
        <div className="w-full h-full overflow-y-auto p-5 space-y-5">
            <JobTitles
                job={job}
                company={memoizedCompanyData}
                isPending={isDataLoading}
                safeSearchParams={safeSearchParams}
            />
            <JobRecruiter
                job={job}
                company={memoizedCompanyData}
                isPending={isDataLoading}
            />
            <JobDescription
                job={job}
                isPending={isDataLoading}
            />
            {!user?.isPro && <JobPremium />}
            {user?.role !== "ORGANIZATION" && (
                <JobCompany
                    company={memoizedCompanyData}
                    isPending={isDataLoading}
                />
            )}
        </div>
    );
};

export default JobDetails;
