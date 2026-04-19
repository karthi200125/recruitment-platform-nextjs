
"use client";

import { LuPencil } from "react-icons/lu";
import { SlDiamond } from "react-icons/sl";
import { useDispatch, useSelector } from "react-redux";

import { SkillsForm } from "@/app/Forms/SkillsForm";
import { openModal } from "@/app/Redux/ModalSlice";

import Icon from "@/components/Icon";
import Model from "@/components/Model/Model";

import SkillsSkeleton from "@/Skeletons/SkillsSkeleton";

/* ────────────────────────────────────────────────
   Types
──────────────────────────────────────────────── */
interface SkillsProfileUser {
    id: number;
    skills?: string[];
}

interface AuthUser {
    id: number;
}

interface RootState {
    user: {
        user: AuthUser | null;
    };
}

interface SkillsProps {
    SkillsprofileUser?: SkillsProfileUser | null;
    isLoading?: boolean;
}

/* ────────────────────────────────────────────────
   Component
──────────────────────────────────────────────── */
const Skills = ({
    SkillsprofileUser,
    isLoading = false,
}: SkillsProps) => {
    const dispatch = useDispatch();

    const user = useSelector(
        (state: RootState) => state.user.user
    );

    const isCurrentUser =
        user?.id === SkillsprofileUser?.id;

    const skills = SkillsprofileUser?.skills ?? [];

    return (
        <section className="relative space-y-4 border rounded-[20px] p-5 mt-5">
            {/* Edit Skills Modal */}
            {isCurrentUser && (
                <Model
                    bodyContent={
                        <SkillsForm skillsData={skills} />
                    }
                    modalId="userSkillsModal"
                    title="Add Your Skills"
                    desc="Add your technical and soft skills"
                    className="min-w-[300px] lg:w-[800px] min-h-[100px]"
                    triggerCls="absolute top-3 right-3"
                >
                    <Icon
                        icon={<LuPencil size={20} />}
                        isHover
                        title="Edit Skills"
                        onClick={() =>
                            dispatch(openModal("userSkillsModal"))
                        }
                    />
                </Model>
            )}

            {/* Header */}
            <div className="flex items-center gap-3">
                <SlDiamond size={20} />
                <h3 className="font-bold">Skills</h3>
            </div>

            {/* Skills Content */}
            <div className="flex flex-wrap gap-3">
                {isLoading ? (
                    <SkillsSkeleton />
                ) : skills.length > 0 ? (
                    skills.map((skill) => (
                        <span
                            key={skill}
                            className="
                px-5 h-[30px]
                rounded-full border
                text-sm font-semibold capitalize
                flex items-center justify-center
              "
                        >
                            {skill}
                        </span>
                    ))
                ) : (
                    <p className="text-sm text-neutral-400">
                        No skills added yet.
                    </p>
                )}
            </div>
        </section>
    );
};

export default Skills;

