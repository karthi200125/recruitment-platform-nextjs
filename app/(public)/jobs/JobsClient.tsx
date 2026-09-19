"use client";

import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";
import {
    usePathname,
    useSearchParams,
} from "next/navigation";

import type { FilteredJob, JobWithAI } from "@/actions/job/get-filter-all-jobs";
import type { JobSearchParams } from "@/types";

import { useJobAIMatches } from "@/hooks/useJobAIMatches";

import Jobb from "./Job";

interface JobsClientProps {
    initialJobs: FilteredJob[];
    initialCount: number;
    searchParams: JobSearchParams;
    currentPage: number;
    userId?: number;
}

function setJobIdInUrl(
    pathname: string,
    urlParams: URLSearchParams,
    jobId: number
) {
    const params = new URLSearchParams(
        urlParams.toString()
    );

    params.set("jobId", String(jobId));

    window.history.replaceState(
        null,
        "",
        `${pathname}?${params.toString()}`
    );
}

export default function JobsClient({
    initialJobs,
    initialCount,
    searchParams,
    currentPage,
    userId,
}: JobsClientProps) {
    const pathname = usePathname();
    const urlParams = useSearchParams();

    /*
     * ---------------------------------------------------------------
     * Selected job
     * ---------------------------------------------------------------
     */

    const [selectedJobId, setSelectedJobId] =
        useState<number | null>(() => {
            if (initialJobs.length === 0) {
                return null;
            }

            const jobIdFromUrl = Number(
                urlParams.get("jobId")
            );

            const jobFromUrl = initialJobs.find(
                (job) => job.id === jobIdFromUrl
            );

            return (
                jobFromUrl?.id ??
                initialJobs[0].id
            );
        });

    useEffect(() => {
        if (initialJobs.length === 0) {
            setSelectedJobId(null);
            return;
        }

        const selectedStillExists =
            selectedJobId !== null &&
            initialJobs.some(
                (job) => job.id === selectedJobId
            );

        if (selectedStillExists) {
            return;
        }

        const firstJobId = initialJobs[0].id;

        setSelectedJobId(firstJobId);

        setJobIdInUrl(
            pathname,
            urlParams,
            firstJobId
        );
    }, [
        initialJobs,
        selectedJobId,
        pathname,
        urlParams,
    ]);

    const selectedJob = useMemo(() => {
        if (initialJobs.length === 0) {
            return null;
        }

        return (
            initialJobs.find(
                (job) => job.id === selectedJobId
            ) ??
            initialJobs[0]
        );
    }, [
        initialJobs,
        selectedJobId,
    ]);

    const handleSelectedJob = useCallback(
        (id: number) => {
            setSelectedJobId(id);

            setJobIdInUrl(
                pathname,
                urlParams,
                id
            );
        },
        [
            pathname,
            urlParams,
        ]
    );

    /*
     * ---------------------------------------------------------------
     * Job IDs
     * ---------------------------------------------------------------
     */

    const jobIds = useMemo(() => {
        if (initialJobs.length === 0) {
            return [];
        }

        return initialJobs
            .map((job) => job.id)
            .sort((a, b) => a - b);
    }, [initialJobs]);

    /*
     * ---------------------------------------------------------------
     * AI matching
     * ---------------------------------------------------------------
     *
     * All AI fetching, loading, error handling and caching
     * is handled inside useJobAIMatches.
     */

    const {
        aiMatchMap,
        isAIMatching,
        isAIError,
    } = useJobAIMatches(
        jobIds,
        userId
    );

    /*
     * ---------------------------------------------------------------
     * Attach AI data to jobs
     * ---------------------------------------------------------------
     */

    const jobsWithAI = useMemo<JobWithAI[]>(() => {
        return initialJobs.map((job) => ({
            ...job,
            aiMatch: aiMatchMap.get(job.id) ?? null,
        }));
    }, [initialJobs, aiMatchMap]);

    /*
     * ---------------------------------------------------------------
     * Selected job + AI
     * ---------------------------------------------------------------
     */

    const selectedJobWithAI = useMemo<JobWithAI | null>(() => {
        if (!selectedJob) {
            return null;
        }

        return {
            ...selectedJob,
            aiMatch: aiMatchMap.get(selectedJob.id) ?? null,
        };
    }, [selectedJob, aiMatchMap]);

    /*
     * ---------------------------------------------------------------
     * Render
     * ---------------------------------------------------------------
     */

    return (
        <Jobb
            jobs={jobsWithAI}
            job={selectedJobWithAI}
            count={initialCount}
            currentPage={currentPage}
            isPending={false}
            onSelectedJob={handleSelectedJob}
            safeSearchParams={searchParams}
            isAIMatching={isAIMatching}
            isAIError={isAIError}
        />
    );
}