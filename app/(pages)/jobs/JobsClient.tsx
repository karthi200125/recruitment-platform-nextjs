'use client';

import { useState, useMemo, useCallback } from 'react';
import { JobWithCompany } from '@/actions/job/getFilterAllJobs';
import Jobb from './Job';

interface JobSearchParams {
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

interface JobsClientProps {
    initialJobs: JobWithCompany[];
    initialCount: number;
    searchParams: JobSearchParams;
    currentPage: number;
}

const JobsClient = ({
    initialJobs,
    initialCount,
    searchParams,
    currentPage,
}: JobsClientProps) => {

    const [selectedJobId, setSelectedJobId] = useState<number | null>(null);


    const selectedJob = useMemo(() => {
        if (!initialJobs.length) return null;

        if (selectedJobId === null) return initialJobs[0];

        return (
            initialJobs.find((job) => job.id === selectedJobId) ??
            initialJobs[0]
        );
    }, [selectedJobId, initialJobs]);


    const handleSelectedJob = useCallback((jobId: number) => {
        setSelectedJobId(jobId);
    }, []);


    if (!initialJobs.length) {
        return (
            <div className="w-full py-20 flex items-center justify-center text-sm text-muted-foreground">
                No jobs found
            </div>
        );
    }


    return (
        <div className="w-full relative">
            <Jobb
                count={initialCount}
                safeSearchParams={searchParams}
                currentPage={currentPage}
                jobs={initialJobs}
                job={selectedJob}
                isPending={false}
                onSelectedJob={handleSelectedJob}
            />
        </div>
    );
};

export default JobsClient;