'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
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

    // ✅ Always sync with jobs
    useEffect(() => {
        if (initialJobs.length > 0) {
            setSelectedJobId(initialJobs[0].id);
        } else {
            setSelectedJobId(null);
        }
    }, [initialJobs]);

    const selectedJob = useMemo(() => {
        if (!initialJobs.length) return null;

        return (
            initialJobs.find(j => j.id === selectedJobId) ??
            initialJobs[0]
        );
    }, [selectedJobId, initialJobs]);

    const handleSelectedJob = useCallback((id: number) => {
        setSelectedJobId(id);
    }, []);

    if (!initialJobs.length) {
        return <div className="p-10 text-center">No jobs found</div>;
    }

    return (
        <Jobb
            jobs={initialJobs}
            job={selectedJob}
            count={initialCount}
            currentPage={currentPage}
            isPending={false}
            onSelectedJob={handleSelectedJob}
            safeSearchParams={searchParams}
        />
    );
};

export default JobsClient;