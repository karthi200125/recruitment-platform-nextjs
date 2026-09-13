"use client";

import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import type { FilteredJob } from "@/actions/job/get-filter-all-jobs";
import type { AIJobMatchResult } from "@/actions/ai/jobs/get-job-ai-matches";
import type { JobSearchParams } from "@/types";

import Jobb from "./Job";

interface JobsClientProps {
    initialJobs: FilteredJob[];
    initialCount: number;
    searchParams: JobSearchParams;
    currentPage: number;
    companynames: string[];
    userId?: number;
}

const AI_STALE_TIME = 5 * 60 * 1000;
const AI_GC_TIME = 30 * 60 * 1000;

function setJobIdInUrl(
    pathname: string,
    urlParams: URLSearchParams,
    jobId: number
) {
    const params = new URLSearchParams(urlParams.toString());

    params.set("jobId", String(jobId));

    window.history.replaceState(
        null,
        "",
        `${pathname}?${params.toString()}`
    );
}

async function fetchAIMatches(
    jobIds: readonly number[]
): Promise<AIJobMatchResult[]> {
    if (jobIds.length === 0) {
        return [];
    }

    try {
        const response = await fetch("/api/aiJobMatch", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
                jobIds,
            }),
        });

        if (!response.ok) {
            console.error(
                "AI match request failed:",
                response.status,
                response.statusText
            );

            return [];
        }

        const data: unknown = await response.json();

        if (!Array.isArray(data)) {
            console.error(
                "Invalid AI match response:",
                data
            );

            return [];
        }

        return data as AIJobMatchResult[];
    } catch (error) {
        console.error(
            "AI match fetch error:",
            error
        );

        return [];
    }
}

export default function JobsClient({
    initialJobs,
    initialCount,
    searchParams,
    currentPage,
    companynames,
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
     *
     * We create a stable, sorted list.
     *
     * This prevents React Query from treating the same set of jobs
     * as a different query merely because the order changed.
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
     * IMPORTANT:
     *
     * We intentionally delay the AI request until the browser is
     * idle.
     *
     * The Jobs page should render first.
     *
     * Priority:
     *
     *   1. Render jobs
     *   2. Render selected job
     *   3. Browser becomes idle
     *   4. Fetch AI matches
     *
     * This prevents the AI request from competing with the initial
     * page rendering.
     */

    const [shouldFetchAI, setShouldFetchAI] =
        useState(false);

    useEffect(() => {
        if (
            !userId ||
            jobIds.length === 0
        ) {
            setShouldFetchAI(false);
            return;
        }

        setShouldFetchAI(false);

        let cancelled = false;

        const startAIRequest = () => {
            if (!cancelled) {
                setShouldFetchAI(true);
            }
        };

        if (
            typeof window !== "undefined" &&
            "requestIdleCallback" in window
        ) {
            const idleId =
                window.requestIdleCallback(
                    startAIRequest,
                    {
                        timeout: 1500,
                    }
                );

            return () => {
                cancelled = true;
                cancelIdleCallback(idleId);
            };
        }

        const timeoutId = setTimeout(
            startAIRequest,
            300
        );

        return () => {
            cancelled = true;
            clearTimeout(timeoutId);
        };
    }, [
        userId,
        jobIds,
        currentPage,
    ]);

    const {
        data: aiMatches = [],
        isFetching: isAIMatching,
        isError: isAIError,
    } = useQuery<AIJobMatchResult[]>({
        queryKey: [
            "job-ai-matches",
            userId ?? null,
            jobIds,
        ],

        queryFn: () =>
            fetchAIMatches(jobIds),

        enabled:
            Boolean(userId) &&
            jobIds.length > 0 &&
            shouldFetchAI,

        staleTime: AI_STALE_TIME,

        gcTime: AI_GC_TIME,

        retry: false,

        refetchOnWindowFocus: false,

        refetchOnReconnect: false,

        refetchOnMount: false,
    });

    /*
     * ---------------------------------------------------------------
     * AI result lookup
     * ---------------------------------------------------------------
     *
     * Map gives O(1) lookup for each job instead of repeatedly
     * searching the AI results array.
     */

    const aiMatchMap = useMemo(() => {
        const map =
            new Map<number, AIJobMatchResult>();

        for (const match of aiMatches) {
            if (
                match &&
                typeof match.jobId === "number"
            ) {
                map.set(
                    match.jobId,
                    match
                );
            }
        }

        return map;
    }, [aiMatches]);

    /*
     * ---------------------------------------------------------------
     * Attach AI data to jobs
     * ---------------------------------------------------------------
     */

    const jobsWithAI = useMemo(() => {
        return initialJobs.map((job) => ({
            ...job,

            aiMatch:
                aiMatchMap.get(job.id) ??
                null,
        }));
    }, [
        initialJobs,
        aiMatchMap,
    ]);

    /*
     * ---------------------------------------------------------------
     * Selected job + AI
     * ---------------------------------------------------------------
     */

    const selectedJobWithAI = useMemo(() => {
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
            companynames={companynames}
            isPending={false}
            onSelectedJob={
                handleSelectedJob
            }
            safeSearchParams={
                searchParams
            }
            isAIMatching={
                isAIMatching
            }
            isAIError={
                isAIError
            }
        />
    );
}