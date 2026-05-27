"use client";

import {
    Check,
    MoreVertical,
} from "lucide-react";

import {
    CircularProgressbar,
    buildStyles,
} from "react-circular-progressbar";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

interface CompletionItem {
    label: string;

    completed: boolean;
}

interface ProfileCompletionCardProps {
    percentage: number;

    items: CompletionItem[];
}

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────

const ProfileCompletionCard = ({
    percentage,

    items,
}: ProfileCompletionCardProps) => {
    return (
        <div className="rounded-[24px] border border-[#EAEAEA] bg-white p-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h3 className="text-[20px] font-semibold tracking-[-0.3px] text-[#111827]">
                    Profile Completion
                </h3>

                <button className="text-[#9CA3AF] transition-colors hover:text-[#6B7280]">
                    <MoreVertical
                        className="h-5 w-5"
                        strokeWidth={2}
                    />
                </button>
            </div>

            {/* Top */}
            <div className="mt-8 flex items-center gap-6">
                {/* Progress */}
                <div className="h-[120px] w-[120px] flex-shrink-0">
                    <CircularProgressbar
                        value={percentage}
                        text={`${percentage}%`}
                        strokeWidth={10}
                        styles={buildStyles({
                            pathColor:
                                "#16A34A",

                            trailColor:
                                "#DCFCE7",

                            textColor:
                                "#111827",

                            textSize: "18px",

                            pathTransitionDuration: 0.5,
                        })}
                    />
                </div>

                {/* Right */}
                <div>
                    <h4 className="text-[28px] font-semibold leading-tight tracking-[-1px] text-[#111827]">
                        Great! Keep going
                    </h4>

                    <p className="mt-3 text-[17px] leading-[32px] text-[#4B5563]">
                        Complete your profile
                        to increase your chances
                        of getting hired.
                    </p>
                </div>
            </div>

            {/* Checklist */}
            <div className="mt-8 space-y-5">
                {items.map((item) => (
                    <div
                        key={item.label}
                        className="flex items-center justify-between"
                    >
                        {/* Left */}
                        <div className="flex items-center gap-3">
                            {/* Checkbox */}
                            <div
                                className={`flex h-5 w-5 items-center justify-center rounded-md border ${item.completed
                                        ? "border-[#16A34A] bg-[#16A34A]"
                                        : "border-[#D1D5DB] bg-white"
                                    }`}
                            >
                                {item.completed && (
                                    <Check
                                        className="h-3.5 w-3.5 text-white"
                                        strokeWidth={
                                            3
                                        }
                                    />
                                )}
                            </div>

                            {/* Label */}
                            <span className="text-[16px] font-medium text-[#111827]">
                                {item.label}
                            </span>
                        </div>

                        {/* Status */}
                        <div
                            className={`h-6 w-6 rounded-full border-2 ${item.completed
                                    ? "border-[#16A34A] bg-[#16A34A]"
                                    : "border-[#D1D5DB] bg-white"
                                }`}
                        >
                            {item.completed && (
                                <div className="flex h-full w-full items-center justify-center">
                                    <Check
                                        className="h-3.5 w-3.5 text-white"
                                        strokeWidth={
                                            3
                                        }
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Button */}
            <button className="mt-8 h-12 w-full rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] text-[15px] font-semibold text-[#111827] transition-colors hover:bg-[#F3F4F6]">
                Improve Profile
            </button>
        </div>
    );
};

export default ProfileCompletionCard;