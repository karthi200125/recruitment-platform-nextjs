"use client";

import { FilteredJob } from "@/actions/job/get-filter-all-jobs";
import { JobSearchParams } from "@/types";

import {
    usePathname,
    useSearchParams,
} from "next/navigation";

import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import Jobb from "./Job";

interface JobsClientProps {
    initialJobs: FilteredJob[];
    initialCount: number;
    searchParams: JobSearchParams;
    currentPage: number;
}


const setJobIdInUrl = (
    pathname: string,
    currentParams: URLSearchParams,
    jobId: number
) => {
    const params = new URLSearchParams(
        currentParams.toString()
    );

    params.set("jobId", String(jobId));

    window.history.replaceState(
        null,
        "",
        `${pathname}?${params.toString()}`
    );
};


const JobsClient = ({
    initialJobs,
    initialCount,
    searchParams,
    currentPage,
}: JobsClientProps) => {
    const pathname = usePathname();
    const urlSearchParams = useSearchParams();

    const [selectedJobId, setSelectedJobId] =
        useState<number | null>(() => {
            if (!initialJobs.length) {
                return null;
            }

            const jobIdParam =
                urlSearchParams.get("jobId");

            const jobIdFromUrl = jobIdParam
                ? Number(jobIdParam)
                : null;

            const jobFromUrl =
                initialJobs.find(
                    (job) =>
                        job.id === jobIdFromUrl
                );

            return (
                jobFromUrl?.id ??
                initialJobs[0].id
            );
        });

    useEffect(() => {
        if (!initialJobs.length) {
            setSelectedJobId(null);
            return;
        }

        const stillValid =
            initialJobs.some(
                (job) =>
                    job.id === selectedJobId
            );

        const nextSelected = stillValid
            ? selectedJobId!
            : initialJobs[0].id;

        setSelectedJobId(nextSelected);

        setJobIdInUrl(
            pathname,
            urlSearchParams,
            nextSelected
        );

    }, [initialJobs, pathname, selectedJobId, urlSearchParams]);

    /*
     * Resolve selected job.
     */
    const selectedJob = useMemo(() => {
        if (!initialJobs.length) {
            return null;
        }

        return (
            initialJobs.find(
                (job) =>
                    job.id === selectedJobId
            ) ??
            initialJobs[0]
        );
    }, [
        selectedJobId,
        initialJobs,
    ]);

    const handleSelectedJob = useCallback(
        (id: number) => {
            setSelectedJobId(id);

            setJobIdInUrl(
                pathname,
                urlSearchParams,
                id
            );
        },
        [
            pathname,
            urlSearchParams,
        ]
    );

    return (
        <Jobb
            jobs={initialJobs}
            job={selectedJob}
            count={initialCount}
            currentPage={currentPage}
            isPending={false}
            onSelectedJob={
                handleSelectedJob
            }
            safeSearchParams={
                searchParams
            }
        />
    );
};

export default JobsClient;