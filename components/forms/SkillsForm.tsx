"use client";

import {
    ChangeEvent,
    FormEvent,
    KeyboardEvent,
    useEffect,
    useState,
    useTransition,
} from "react";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { X } from "lucide-react";

import { getSkills } from "@/actions/user/get-skills";
import { userSkillAction } from "@/actions/user/user-skills-action";

import Button from "@/components/Button";
import FormError from "@/components/ui/FormError";

import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useCustomToast } from "@/lib/CustomToast";

import { closeModal } from "@/store/ModalSlice";
import { useRouter } from "next/navigation";

interface SkillsFormProps {
    skillsData?: string[];
}

const SKILLS_MODAL_ID = "userSkillsModal";

export function SkillsForm({
    skillsData = [],
}: SkillsFormProps) {
    const dispatch = useDispatch();    
    const router = useRouter()

    const { user } = useCurrentUser();

    const {
        showSuccessToast,
        showErrorToast,
    } = useCustomToast();

    const [isLoading, startTransition] =
        useTransition();

    const [skills, setSkills] =
        useState<string[]>(skillsData);

    const [searchTerm, setSearchTerm] =
        useState("");

    const [debouncedSearchTerm, setDebouncedSearchTerm] =
        useState("");

    const [error, setError] =
        useState("");

    /*
     * Keep local form state synchronized with
     * the latest profile data.
     */
    useEffect(() => {
        setSkills(skillsData);
    }, [skillsData]);

    /*
     * Debounce skill search.
     */
    useEffect(() => {
        const timer = window.setTimeout(() => {
            setDebouncedSearchTerm(
                searchTerm.trim()
            );
        }, 300);

        return () => {
            window.clearTimeout(timer);
        };
    }, [searchTerm]);

    /*
     * Skill suggestions.
     *
     * IMPORTANT:
     * This query is ONLY for autocomplete.
     *
     * It does NOT save the user's skills.
     */
    const {
        data: allSkills = [],
        isFetching,
    } = useQuery<string[]>({
        queryKey: [
            "skills",
            debouncedSearchTerm,
        ],

        queryFn: () =>
            getSkills(debouncedSearchTerm),

        enabled:
            debouncedSearchTerm.length > 0,

        staleTime: 60 * 1000,
    });

    /*
     * Case-insensitive duplicate check.
     */
    const hasSkill = (skill: string) => {
        const normalized =
            skill.trim().toLowerCase();

        return skills.some(
            (existingSkill) =>
                existingSkill.trim().toLowerCase() ===
                normalized
        );
    };

    /*
     * Add a skill.
     */
    const addSkill = (skill: string) => {
        const trimmedSkill = skill.trim();

        if (!trimmedSkill) {
            return;
        }

        if (hasSkill(trimmedSkill)) {
            setSearchTerm("");
            return;
        }

        setSkills((currentSkills) => [
            ...currentSkills,
            trimmedSkill,
        ]);

        setSearchTerm("");
        setError("");
    };

    /*
     * Select autocomplete suggestion.
     */
    const handleSelectSuggestion = (
        suggestion: string
    ) => {
        addSkill(suggestion);
    };

    /*
     * Input change.
     */
    const handleInputChange = (
        e: ChangeEvent<HTMLInputElement>
    ) => {
        setSearchTerm(e.target.value);
        setError("");
    };

    /*
     * Allow pressing Enter to create a custom skill.
     */
    const handleKeyDown = (
        e: KeyboardEvent<HTMLInputElement>
    ) => {
        if (e.key !== "Enter") {
            return;
        }

        e.preventDefault();

        const value = searchTerm.trim();

        if (!value) {
            return;
        }

        addSkill(value);
    };

    /*
     * Remove selected skill.
     */
    const removeSkill = (
        skillToRemove: string
    ) => {
        setSkills((currentSkills) =>
            currentSkills.filter(
                (skill) =>
                    skill !== skillToRemove
            )
        );
    };

    /*
     * Save skills.
     */
    const handleSubmit = (
        e: FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        if (isLoading) {
            return;
        }

        if (!user?.id) {
            setError("User not found.");
            return;
        }

        setError("");

        startTransition(async () => {
            try {
                const result =
                    await userSkillAction(
                        skills,
                        user.id
                    );

                if (result.error) {
                    setError(result.error);
                    showErrorToast(
                        result.error
                    );
                    return;
                }

                if (result.success) {
                    /*
                     * Refresh the profile query if
                     * your profile is loaded through
                     * this query key.
                     */
                    router.refresh();                    

                    showSuccessToast(
                        result.success
                    );

                    /*
                     * Close the correct modal.
                     */
                    dispatch(
                        closeModal(
                            SKILLS_MODAL_ID
                        )
                    );
                }
            } catch (error) {
                console.error(
                    "[UPDATE_SKILLS]",
                    error
                );

                const message =
                    "Something went wrong while updating your skills.";

                setError(message);
                showErrorToast(message);
            }
        });
    };

    /*
     * Don't show suggestions for skills
     * that have already been selected.
     */
    const filteredSuggestions =
        allSkills.filter(
            (suggestion) =>
                !hasSkill(suggestion)
        );

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-8"
        >
            {/* Skill input */}
            <div className="relative space-y-2">
                <h4 className="font-bold text-neutral-900">
                    Skills
                </h4>

                <input
                    type="text"
                    value={searchTerm}
                    placeholder="Enter your skill"
                    autoComplete="off"
                    disabled={isLoading}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    className="w-full rounded-md border border-slate-200 px-5 py-2.5 text-sm outline-none transition-colors placeholder:text-sm focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:bg-slate-50"
                />

                {/* Suggestions */}
                {debouncedSearchTerm && (
                    <div className="absolute left-0 right-0 top-full z-20 mt-2 max-h-48 overflow-y-auto rounded-md border border-slate-200 bg-white shadow-lg">
                        {isFetching ? (
                            <div className="px-4 py-3 text-sm text-slate-400">
                                Searching skills...
                            </div>
                        ) : filteredSuggestions.length > 0 ? (
                            filteredSuggestions.map(
                                (suggestion) => (
                                    <button
                                        key={suggestion}
                                        type="button"
                                        onClick={() =>
                                            handleSelectSuggestion(
                                                suggestion
                                            )
                                        }
                                        className="block w-full px-5 py-2.5 text-left text-sm transition-colors hover:bg-slate-50"
                                    >
                                        {suggestion}
                                    </button>
                                )
                            )
                        ) : (
                            <div className="px-4 py-3 text-sm text-slate-400">
                                No matching skills found.
                                Press Enter to add it.
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Selected skills */}
            {skills.length > 0 && (
                <div className="flex flex-wrap gap-3">
                    {skills.map((skill) => (
                        <div
                            key={skill}
                            className="flex h-[30px] items-center gap-2 rounded-full border border-slate-200 px-4 text-sm font-semibold text-slate-700"
                        >
                            <span>
                                {skill}
                            </span>

                            <button
                                type="button"
                                onClick={() =>
                                    removeSkill(
                                        skill
                                    )
                                }
                                disabled={isLoading}
                                aria-label={`Remove ${skill}`}
                                className="text-slate-400 transition-colors hover:text-red-400 disabled:cursor-not-allowed"
                            >
                                <X
                                    size={15}
                                />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Error */}
            <FormError message={error} />

            {/* Save */}
            <Button
                type="submit"
                isLoading={isLoading}
                className="!w-full"
            >
                Save Skills
            </Button>
        </form>
    );
}