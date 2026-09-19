"use client";

import { useQuery } from "@tanstack/react-query";
import type { AIJobMatchResult } from "@/actions/ai/jobs/get-job-ai-matches";
import AIJobMatch from "./AIJobMatch";

interface JobAIMatchesProps {
    jobIds: number[];
}

async function fetchAIMatches(
    jobIds: number[]
): Promise<AIJobMatchResult[]> {
    const response = await fetch("/api/aiJobMatch", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ jobIds }),
    });

    if (!response.ok) {
        throw new Error("Failed to fetch AI matches");
    }

    return response.json();
}

export default function JobAIMatches({
    jobIds,
}: JobAIMatchesProps) {
    const {
        data: results = [],
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["job-ai-matches", jobIds],
        queryFn: () => fetchAIMatches(jobIds),
        enabled: jobIds.length > 0,
        staleTime: 5 * 60 * 1000,
        gcTime: 30 * 60 * 1000,
        retry: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        refetchOnMount: false,
    });

    const resultMap = new Map(
        results.map((result) => [
            result.jobId,
            result,
        ])
    );

    return (
        <>
            {jobIds.map((jobId) => (
                <AIJobMatch
                    key={jobId}
                    result={resultMap.get(jobId) ?? null}
                    isAIMatching={isLoading}
                    isAIError={isError}
                />
            ))}
        </>
    );
}