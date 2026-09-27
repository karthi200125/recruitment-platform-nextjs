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

import Jobb from "./Job";

interface JobsClientProps {
    initialJobs: FilteredJob[];
    initialCount: number;
    searchParams: JobSearchParams;
    currentPage: number;
    userId: number | undefined;
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
}: JobsClientProps) {
    const pathname = usePathname();
    const urlParams = useSearchParams();

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

    const jobsWithAI: JobWithAI[] = initialJobs.map((job) => ({
        ...job,
        aiMatch: null,
    }));

    const selectedJobWithAI = useMemo<JobWithAI | null>(() => {
        if (!selectedJob) {
            return null;
        }

        return {
            ...selectedJob,
            aiMatch: null,
        };
    }, [selectedJob]);

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

    return (
        <Jobb
            jobs={jobsWithAI}
            job={selectedJobWithAI}
            count={initialCount}
            currentPage={currentPage}
            isPending={false}
            onSelectedJob={handleSelectedJob}
            safeSearchParams={searchParams}
            isAIMatching={false}
            isAIError={false}
        />
    );
}