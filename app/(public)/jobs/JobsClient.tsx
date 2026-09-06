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

// ─────────────────────────────────────────────────────────────────────────────
// URL
// ─────────────────────────────────────────────────────────────────────────────

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

// ─────────────────────────────────────────────────────────────────────────────
// AI MATCH REQUEST
// ─────────────────────────────────────────────────────────────────────────────

async function fetchAIMatches(
    jobIds: number[]
): Promise<AIJobMatchResult[]> {
    if (jobIds.length === 0) {
        return [];
    }

    try {
        console.log("🤖 Requesting AI matches:", {
            jobIds,
        });

        const response = await fetch(
            "/api/aiJobMatch",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                },

                // Send authentication cookies with request.
                credentials: "include",

                body: JSON.stringify({
                    jobIds,
                }),
            }
        );

        if (!response.ok) {
            console.error(
                "❌ AI match request failed:",
                response.status,
                response.statusText
            );

            return [];
        }
        
        const data: unknown = await response.json();            

        if (!Array.isArray(data)) {
            console.error(
                "❌ Invalid AI match response:",
                data
            );

            return [];
        }

        const results = data as AIJobMatchResult[];                    

        return results;
    } catch (error) {
        console.error(
            "❌ AI match fetch error:",
            error
        );

        return [];
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

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

    // ─────────────────────────────────────────────────────────────────────────
    // SELECTED JOB
    // ─────────────────────────────────────────────────────────────────────────

    const [selectedJobId, setSelectedJobId] =
        useState<number | null>(() => {
            if (!initialJobs.length) {
                return null;
            }

            const jobIdFromUrl =
                Number(urlParams.get("jobId"));

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

    // ─────────────────────────────────────────────────────────────────────────
    // KEEP SELECTED JOB VALID WHEN FILTER/PAGE CHANGES
    // ─────────────────────────────────────────────────────────────────────────

    useEffect(() => {
        if (!initialJobs.length) {
            setSelectedJobId(null);
            return;
        }

        const selectedStillExists =
            initialJobs.some(
                (job) =>
                    job.id === selectedJobId
            );

        if (selectedStillExists) {
            return;
        }

        const firstJobId =
            initialJobs[0].id;

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

    // ─────────────────────────────────────────────────────────────────────────
    // SELECTED JOB
    // ─────────────────────────────────────────────────────────────────────────

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
        initialJobs,
        selectedJobId,
    ]);

    // ─────────────────────────────────────────────────────────────────────────
    // SELECT JOB HANDLER
    // ─────────────────────────────────────────────────────────────────────────

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

    // ─────────────────────────────────────────────────────────────────────────
    // JOB IDS FOR AI
    // ─────────────────────────────────────────────────────────────────────────

    const jobIds = useMemo(
        () =>
            initialJobs.map(
                (job) => job.id
            ),
        [initialJobs]
    );

    // ─────────────────────────────────────────────────────────────────────────
    // AI MATCHING
    //
    // IMPORTANT:
    //
    // We DO NOT call getJobAIMatches() here.
    //
    // Browser
    //   ↓
    // /api/jobs/ai-matches
    //   ↓
    // route.ts
    //   ↓
    // getJobAIMatches()
    //   ↓
    // Gemini
    //
    // This keeps the AI implementation server-side.
    // ─────────────────────────────────────────────────────────────────────────

    const {
        data: aiMatches = [],
        isFetching: isAIMatching,
        isError: isAIError,
    } = useQuery<AIJobMatchResult[]>({
        queryKey: [
            "job-ai-matches",
            userId ?? null,
            currentPage,
            jobIds,
        ],

        queryFn: () =>
            fetchAIMatches(jobIds),
        
        enabled:
            Boolean(userId) &&
            jobIds.length > 0,

        staleTime:
            5 * 60 * 1000,

        gcTime:
            30 * 60 * 1000,

        retry: false,
        
        refetchOnWindowFocus: false,

        refetchOnReconnect: false,

        refetchInterval: false,

        refetchIntervalInBackground: false,
    });

    // ─────────────────────────────────────────────────────────────────────────
    // AI RESULT MAP
    // ─────────────────────────────────────────────────────────────────────────

    const aiMatchMap = useMemo(() => {
        const map =
            new Map<
                number,
                AIJobMatchResult
            >();

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

    // ─────────────────────────────────────────────────────────────────────────
    // ADD AI DATA TO JOBS
    // ─────────────────────────────────────────────────────────────────────────

    const jobsWithAI = useMemo(() => {
        return initialJobs.map(
            (job) => ({
                ...job,

                // Before AI returns:
                //     aiMatch = null
                //
                // After AI returns:
                //     aiMatch = actual AI result

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

    // ─────────────────────────────────────────────────────────────────────────
    // ADD AI DATA TO SELECTED JOB
    // ─────────────────────────────────────────────────────────────────────────

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

    // ─────────────────────────────────────────────────────────────────────────
    // DEBUG
    // ─────────────────────────────────────────────────────────────────────────

    useEffect(() => {
        console.log(
            "🤖 AI MATCH STATE:",
            {
                userId,
                jobIds,
                isAIMatching,
                isAIError,
                aiMatches,
            }
        );
    }, [
        userId,
        jobIds,
        isAIMatching,
        isAIError,
        aiMatches,
    ]);

    // ─────────────────────────────────────────────────────────────────────────
    // UI
    // ─────────────────────────────────────────────────────────────────────────

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