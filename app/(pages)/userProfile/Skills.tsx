"use client";

import { useDispatch } from "react-redux";
import { Pencil, Gem } from "lucide-react";

import { SkillsForm } from "@/app/Forms/SkillsForm";
import { openModal } from "@/app/Redux/ModalSlice";
import Model from "@/components/Model/Model";
import SkillsSkeleton from "@/Skeletons/SkillsSkeleton";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { ProfileUser } from "@/types/userProfile";

interface SkillsProps {
    profileUser?: ProfileUser | null;
    isLoading?: boolean;
}

const Skills = ({ profileUser, isLoading = false }: SkillsProps) => {
    const dispatch = useDispatch();
    const { user } = useCurrentUser();
    const isCurrentUser = user?.id === profileUser?.id;
    const skills = profileUser?.skills ?? [];

    return (
        <section className="space-y-3">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Gem className="w-4 h-4 text-slate-500" strokeWidth={1.75} />
                    <h3 className="text-sm font-bold text-slate-800">Skills</h3>
                    {skills.length > 0 && (
                        <span className="text-xs font-semibold text-slate-400 bg-slate-100 rounded-full px-2 py-0.5">
                            {skills.length}
                        </span>
                    )}
                </div>
                {isCurrentUser && (
                    <Model
                        bodyContent={<SkillsForm skillsData={skills} />}
                        modalId="userSkillsModal"
                        title="Add Your Skills"
                        desc="Add your technical and soft skills"
                        className="min-w-[300px] lg:w-[800px]"
                        triggerCls=""
                    >
                        <button
                            onClick={() => dispatch(openModal("userSkillsModal"))}
                            aria-label="Edit skills"
                            className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors duration-200"
                        >
                            <Pencil className="w-3.5 h-3.5" strokeWidth={2} />
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
                            className="inline-flex items-center px-3 py-1 rounded-full border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700 capitalize hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-700 transition-colors duration-200"
                        >
                            {skill}
                        </span>
                    ))}
                </div>
            ) : (
                <div className="flex items-center justify-between rounded-xl border border-dashed border-slate-200 bg-slate-50/50 px-4 py-3">
                    <p className="text-xs text-slate-400">No skills added yet.</p>
                    {isCurrentUser && (
                        <button
                            onClick={() => dispatch(openModal("userSkillsModal"))}
                            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors duration-200"
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