"use client";

import Image from "next/image";
import { Loader2, Mail, BriefcaseBusiness } from "lucide-react";

import { RecruiterSearchResult } from "@/types/company-employee";

interface RecruiterCardProps {
    recruiter: RecruiterSearchResult;

    loading?: boolean;
    invited?: boolean;
    disabled?: boolean;

    onInvite?: (
        recruiterId: number
    ) => void | Promise<void>;
}

const RecruiterCard = ({
    recruiter,
    loading = false,
    invited = false,
    disabled = false,
    onInvite,
}: RecruiterCardProps) => {
    const fullName =
        recruiter.firstName && recruiter.lastName
            ? `${recruiter.firstName} ${recruiter.lastName}`
            : recruiter.username;

    return (
        <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-sm">
            {/* Left */}
            <div className="flex min-w-0 items-center gap-4">
                {/* Avatar */}
                <div className="relative h-14 w-14 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                    <Image
                        src={
                            recruiter.profileImage ??
                            "/images/user-placeholder.png"
                        }
                        alt={fullName}
                        fill
                        className="object-cover"
                    />
                </div>

                {/* Info */}
                <div className="min-w-0">
                    <h3 className="truncate text-[16px] font-semibold text-slate-900">
                        {fullName}
                    </h3>

                    <div className="mt-1 flex items-center gap-2 text-sm text-slate-500">
                        <BriefcaseBusiness className="h-4 w-4" />

                        <span className="truncate">
                            {recruiter.profession ??
                                "Recruiter"}
                        </span>
                    </div>

                    <div className="mt-1 flex items-center gap-2 text-sm text-slate-500">
                        <Mail className="h-4 w-4" />

                        <span className="truncate">
                            {recruiter.email}
                        </span>
                    </div>
                </div>
            </div>

            {/* Right */}
            <button
                type="button"
                disabled={
                    disabled ||
                    invited ||
                    loading
                }
                onClick={() =>
                    onInvite?.(recruiter.id)
                }
                className={`inline-flex h-10 min-w-[110px] items-center justify-center rounded-xl px-5 text-sm font-semibold transition-all
                    ${invited
                        ? "cursor-default bg-emerald-50 text-emerald-700"
                        : disabled
                            ? "cursor-not-allowed bg-slate-100 text-slate-400"
                            : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
            >
                {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : invited ? (
                    "Invited"
                ) : (
                    "Invite"
                )}
            </button>
        </div>
    );
};

export default RecruiterCard;