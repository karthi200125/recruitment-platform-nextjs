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

import type { FilteredJob } from "@/actions/job/get-filter-all-jobs";
import type {
    AIJobMatchResult,
} from "@/actions/ai/jobs/get-job-ai-matches";
import type { JobSearchParams } from "@/types";

import Jobb from "./Job";


interface JobsClientProps {
    initialJobs: FilteredJob[];
    initialCount: number;
    searchParams: JobSearchParams;
    currentPage: number;
    companynames: string[];
    userId?: number;
    initialAIMatches: AIJobMatchResult[];
}

function setJobIdInUrl(
    pathname: string,
    urlParams: URLSearchParams,
    jobId: number
) {
    const params = new URLSearchParams(
        urlParams.toString()
    );

    params.set(
        "jobId",
        String(jobId)
    );

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
    companynames,
    userId,
    initialAIMatches,
}: JobsClientProps) {
    const pathname = usePathname();

    const urlParams = useSearchParams();

    const [
        selectedJobId,
        setSelectedJobId,
    ] = useState<number | null>(() => {
        if (!initialJobs.length) {
            return null;
        }

        const jobIdFromUrl =
            Number(
                urlParams.get("jobId")
            );

        const jobFromUrl =
            initialJobs.find(
                (job) =>
                    job.id ===
                    jobIdFromUrl
            );

        return (
            jobFromUrl?.id ??
            initialJobs[0]?.id ??
            null
        );
    });

    useEffect(() => {
        if (!initialJobs.length) {
            setSelectedJobId(null);
            return;
        }

        const stillExists =
            initialJobs.some(
                (job) =>
                    job.id ===
                    selectedJobId
            );

        if (
            stillExists &&
            selectedJobId !== null
        ) {
            return;
        }

        const firstJobId =
            initialJobs[0].id;

        setSelectedJobId(
            firstJobId
        );

        setJobIdInUrl(
            pathname,
            urlParams,
            firstJobId
        );
    }, [
        initialJobs,
        pathname,
        selectedJobId,
        urlParams,
    ]);

    const selectedJob = useMemo(() => {
        if (!initialJobs.length) {
            return null;
        }

        return (
            initialJobs.find(
                (job) =>
                    job.id ===
                    selectedJobId
            ) ??
            initialJobs[0] ??
            null
        );
    }, [
        initialJobs,
        selectedJobId,
    ]);

    const handleSelectedJob =
        useCallback(
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
    
    const aiMatchMap = useMemo(() => {
        const map =
            new Map<
                number,
                AIJobMatchResult
            >();

        for (
            const match of initialAIMatches
        ) {
            if (
                !match ||
                !Number.isInteger(
                    match.jobId
                )
            ) {
                continue;
            }

            map.set(
                match.jobId,
                match
            );
        }

        return map;
    }, [
        initialAIMatches,
    ]);

    const jobsWithAI = useMemo(() => {
        return initialJobs.map(
            (job) => ({
                ...job,

                aiMatch:
                    aiMatchMap.get(
                        job.id
                    ) ?? null,
            })
        );
    }, [
        initialJobs,
        aiMatchMap,
    ]);

    const selectedJobWithAI =
        useMemo(() => {
            if (!selectedJob) {
                return null;
            }

            return {
                ...selectedJob,

                aiMatch:
                    aiMatchMap.get(
                        selectedJob.id
                    ) ?? null,
            };
        }, [
            selectedJob,
            aiMatchMap,
        ]);

    return (
        <Jobb
            jobs={jobsWithAI}
            job={selectedJobWithAI}
            count={initialCount}
            currentPage={currentPage}
            companynames={companynames}
            isPending={false}
            onSelectedJob={
                handleSelectedJob
            }
            safeSearchParams={
                searchParams
            }
        />
    );
}