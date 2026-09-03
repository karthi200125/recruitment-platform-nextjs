"use client";

import { useState } from "react";
import { RefreshCw, Sparkles } from "lucide-react";

import { improveUserAbout } from "@/actions/ai/user/improve-user-about";

interface AIImproveAboutProps {
    about: string;
    profession?: string;
    userBio?: string;
    skills?: string[];
    onUseSuggestion: (suggestion: string) => void;
}

const AIImproveAbout = ({
    about,
    profession,
    userBio,
    skills,
    onUseSuggestion,
}: AIImproveAboutProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const hasAbout = about.trim().length > 0;

    const convertAITextToQuillHTML = (text: string): string => {
        const normalizedText = text
            .replace(/\r\n/g, "\n")
            .replace(/\r/g, "\n")
            .replace(/\s+-\s+(?=\*\*)/g, "\n- ");

        const lines = normalizedText
            .split("\n")
            .map((line) => line.trim())
            .filter(Boolean);

        const bulletLines = lines.filter((line) =>
            /^[-*•]\s+/.test(line)
        );

        if (bulletLines.length > 0) {
            const items = bulletLines
                .map((line) => {
                    const content = line
                        .replace(/^[-*•]\s+/, "")
                        .replace(
                            /\*\*(.*?)\*\*/g,
                            "<strong>$1</strong>"
                        );

                    return `<li>${content}</li>`;
                })
                .join("");

            return `<ul>${items}</ul>`;
        }

        return normalizedText
            .replace(
                /\*\*(.*?)\*\*/g,
                "<strong>$1</strong>"
            )
            .replace(/\n/g, "<br>");
    };

    const handleGenerate = async () => {
        if (isLoading) return;

        try {
            setIsLoading(true);
            setError("");

            const result = await improveUserAbout({
                about,
                profession,
                userBio,
                skills,
            });

            if (result.error) {
                setError(result.error);
                return;
            }

            if (result.suggestion) {
                const formattedSuggestion =
                    convertAITextToQuillHTML(
                        result.suggestion
                    );

                onUseSuggestion(formattedSuggestion);
            }
        } catch (error) {
            console.error("AI About error:", error);
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
                    ? hasAbout
                        ? "Improving..."
                        : "Generating..."
                    : hasAbout
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

export default AIImproveAbout;