"use client";

import { useState } from "react";
import { RefreshCw, Sparkles } from "lucide-react";

import { improveUserHeadline } from "@/actions/ai/user/improve-user-headline";

interface AIImproveHeadlineProps {
    userBio?: string;
    profession?: string;
    skills?: string[];
    about?: string;
    onUseSuggestion: (suggestion: string) => void;
}

const AIImproveHeadline = ({
    userBio,
    profession,
    skills,
    about,
    onUseSuggestion,
}: AIImproveHeadlineProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const safeUserBio = userBio ?? "";
    const hasHeadline = safeUserBio.trim().length > 0;

    const handleGenerate = async () => {
        if (isLoading) return;

        try {
            setIsLoading(true);
            setError("");

            const result = await improveUserHeadline({
                userBio: safeUserBio,
                profession,
                skills,
                about,
            });

            if (result.error) {
                setError(result.error);
                return;
            }

            if (result.suggestion) {
                onUseSuggestion(result.suggestion);
            }
        } catch (error) {
            console.error("AI Headline error:", error);
            setError("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-end gap-1">
            <button
                type="button"
                onClick={handleGenerate}
                disabled={isLoading}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 transition-colors hover:text-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
                {isLoading ? (
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" strokeWidth={2} />
                ) : (
                    <Sparkles className="h-3.5 w-3.5" strokeWidth={2} />
                )}

                {isLoading
                    ? hasHeadline
                        ? "Improving..."
                        : "Generating..."
                    : hasHeadline
                        ? "Improve with AI"
                        : "Generate with AI"}
            </button>

            {error && (
                <p className="text-[11px] font-medium text-red-500">
                    {error}
                </p>
            )}
        </div>
    );
};

export default AIImproveHeadline;