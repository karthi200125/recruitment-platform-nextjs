'use client';

import FilterNavbar from '@/components/FilterNavbar/FilterNavbar';
import JobLists from './JobLists/JobLists';
import JobDetails from './Job/JobDetails';
import { JobWithCompany } from '@/actions/job/getFilterAllJobs';

export interface JobSearchParams {
    userId?: number;
    q?: string;
    location?: string;
    type?: string;
    experiencelevel?: string;
    dateposted?: string;
    easyApply?: string;
    company?: string;
    page: number;
}

interface Props {
    jobs: JobWithCompany[];
    job: JobWithCompany | null;
    isPending: boolean;
    onSelectedJob: (id: number) => void;
    count: number;
    currentPage: number;
    safeSearchParams: JobSearchParams;
}

const Jobb = ({
    jobs,
    job,
    count,
    currentPage,
    isPending,
    onSelectedJob,
    safeSearchParams,
}: Props) => {
    return (
        <div>
            <FilterNavbar />

            <div className="w-full flex flex-row items-start">
                {/* 🔹 Job List */}
                <div className="w-full md:w-[40%] jobsh overflow-y-auto">
                    <JobLists
                        jobs={jobs}
                        isLoading={isPending}
                        onSelectedJob={onSelectedJob}
                        count={count}
                        currentPage={currentPage}
                    />
                </div>

                {/* 🔹 Job Details */}
                <div className="hidden md:block w-full md:w-[60%] overflow-y-auto jobsh">
                    {job && (
                        <JobDetails
                            job={job}
                            safeSearchParams={safeSearchParams}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Jobb;