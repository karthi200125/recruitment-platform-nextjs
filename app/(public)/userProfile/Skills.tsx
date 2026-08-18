"use client";

import { useDispatch } from "react-redux";
import { Gem, Pencil } from "lucide-react";

import { SkillsForm } from "@/components/forms/SkillsForm";
import { openModal } from "@/store/ModalSlice";
import Model from "@/components/Model";
import SkillsSkeleton from "@/components/skeletons/SkillsSkeleton";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { ProfileUser } from "@/types/userProfile";

interface SkillsProps {
    profileUser?: ProfileUser | null;
    isLoading?: boolean;
}

const SKILLS_MODAL_ID = "userSkillsModal";

const Skills = ({
    profileUser,
    isLoading = false,
}: SkillsProps) => {
    const dispatch = useDispatch();
    const { user } = useCurrentUser();

    const isCurrentUser =
        user?.id === profileUser?.id;

    const skills = profileUser?.skills ?? [];

    const handleOpenSkillsModal = () => {
        if (!isCurrentUser) {
            return;
        }

        dispatch(openModal(SKILLS_MODAL_ID));
    };

    return (
        <section className="space-y-3">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Gem
                        className="h-4 w-4 text-slate-500"
                        strokeWidth={1.75}
                    />

                    <h3 className="text-sm font-bold text-slate-800">
                        Skills
                    </h3>

                    {!isLoading && skills.length > 0 && (
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-400">
                            {skills.length}
                        </span>
                    )}
                </div>

                {isCurrentUser && (
                    <Model
                        modalId={SKILLS_MODAL_ID}
                        title="Edit Your Skills"
                        desc="Add your technical and soft skills"
                        className="min-w-[300px] lg:w-[800px]"
                        triggerCls=""
                        bodyContent={
                            <SkillsForm
                                skillsData={skills}
                            />
                        }
                    >
                        <button
                            type="button"
                            onClick={handleOpenSkillsModal}
                            aria-label="Edit skills"
                            className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-colors duration-200 hover:bg-slate-100"
                        >
                            <Pencil
                                className="h-3.5 w-3.5"
                                strokeWidth={2}
                            />
                        </button>
                    </Model>
                )}
            </div>

            {/* Skills */}
            {isLoading ? (
                <SkillsSkeleton />
            ) : skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                    {skills.map((skill, index) => (
                        <span
                            key={`${skill}-${index}`}
                            className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold capitalize text-slate-700 transition-colors duration-200 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
                        >
                            {skill}
                        </span>
                    ))}
                </div>
            ) : (
                <div className="flex items-center justify-between rounded-xl border border-dashed border-slate-200 bg-slate-50/50 px-4 py-3">
                    <p className="text-xs text-slate-400">
                        No skills added yet.
                    </p>

                    {isCurrentUser && (
                        <button
                            type="button"
                            onClick={handleOpenSkillsModal}
                            className="text-xs font-semibold text-indigo-600 transition-colors duration-200 hover:text-indigo-700"
                        >
                            + Add skills
                        </button>
                    )}
                </div>
            )}
        </section>
    );
};

export default Skills;