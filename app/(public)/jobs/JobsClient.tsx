'use client';

import { FilteredJob } from '@/actions/job/get-filter-all-jobs';
import { JobSearchParams } from '@/types';
import { usePathname, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from 'react';
import Jobb from './Job';


interface JobsClientProps {
    initialJobs: FilteredJob[];
    initialCount: number;
    searchParams: JobSearchParams;
    currentPage: number;
}

const setJobIdInUrl = (pathname: string, currentParams: URLSearchParams, jobId: number) => {
    const params = new URLSearchParams(currentParams.toString());
    params.set("jobId", String(jobId));
    window.history.replaceState(null, "", `${pathname}?${params.toString()}`);
};

const JobsClient = ({ initialJobs, initialCount, searchParams, currentPage }: JobsClientProps) => {
    const pathname = usePathname();
    const urlSearchParams = useSearchParams();

    const [selectedJobId, setSelectedJobId] = useState<number | null>(() => {
        if (!initialJobs.length) return null;
        const jobIdParam = urlSearchParams.get("jobId");
        const jobIdFromUrl = jobIdParam ? Number(jobIdParam) : null;
        return initialJobs.find((job) => job.id === jobIdFromUrl)?.id ?? initialJobs[0].id;
    });

    useEffect(() => {
        if (!initialJobs.length) {
            setSelectedJobId(null);
            return;
        }

        const stillValid = initialJobs.some((job) => job.id === selectedJobId);
        const nextSelected = stillValid ? selectedJobId! : initialJobs[0].id;

        setSelectedJobId(nextSelected);
        setJobIdInUrl(pathname, urlSearchParams, nextSelected);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialJobs]);

    const selectedJob = useMemo(() => {
        if (!initialJobs.length) return null;
        return initialJobs.find((j) => j.id === selectedJobId) ?? initialJobs[0];
    }, [selectedJobId, initialJobs]);


    useEffect(() => {
        if (!selectedJob) return;

        const previousTitle = document.title;
        document.title = `${selectedJob.jobTitle} at ${selectedJob.company?.companyName ?? "a company"} | Jobify`;

        return () => {
            document.title = previousTitle;
        };
    }, [selectedJob]);

    const handleSelectedJob = useCallback(
        (id: number) => {
            setSelectedJobId(id);
            setJobIdInUrl(pathname, urlSearchParams, id);
        },
        [pathname, urlSearchParams]
    );

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