"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { AIJobMatchResult } from "@/actions/ai/jobs/get-job-ai-matches";

const AI_STALE_TIME = 5 * 60 * 1000;
const AI_GC_TIME = 30 * 60 * 1000;

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

            throw new Error("AI match request failed");
        }

        const data: unknown = await response.json();

        if (!Array.isArray(data)) {
            throw new Error("Invalid AI match response");
        }

        return data as AIJobMatchResult[];
    } catch (error) {
        console.error("AI match fetch error:", error);
        throw error;
    }
}

export function useJobAIMatches(
    jobIds: readonly number[],
    userId?: number
) {
    const [shouldFetchAI, setShouldFetchAI] =
        useState(false);

    useEffect(() => {
        if (!userId || jobIds.length === 0) {
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
                window.cancelIdleCallback(idleId);
            };
        }

        const timeoutId = setTimeout(
            startAIRequest,
            300
        );

        return () => {
            cancelled = true;
            window.clearTimeout(timeoutId);
        };
    }, [userId, jobIds]);

    const query = useQuery<AIJobMatchResult[]>({
        queryKey: [
            "job-ai-matches",
            userId ?? null,
            jobIds,
        ],

        queryFn: () => fetchAIMatches(jobIds),

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

    const aiMatchMap = useMemo(() => {
        const map =
            new Map<number, AIJobMatchResult>();

        for (const match of query.data ?? []) {
            if (
                match &&
                typeof match.jobId === "number"
            ) {
                map.set(match.jobId, match);
            }
        }

        return map;
    }, [query.data]);

    return {
        aiMatchMap,
        isAIMatching:
            query.isFetching ||
            (Boolean(userId) &&
                jobIds.length > 0 &&
                !shouldFetchAI),

        isAIError: query.isError,
    };
}