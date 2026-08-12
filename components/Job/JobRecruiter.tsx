"use client";

import Image from "next/image";
import Link from "next/link";
import { useDispatch } from "react-redux";
import {
    Crown,
    Lock,
    MessageSquare,
    UserCircle2,
} from "lucide-react";

import { openModal } from "@/store/ModalSlice";
import Model from "@/components/Model";
import MessageBox from "../../app/(protected)/messages/MessageBox";
import { useCurrentUser } from "@/hooks/useCurrentUser";

type Role =
    | "CANDIDATE"
    | "RECRUITER"
    | "ORGANIZATION";

interface RecruiterUser {
    id: number;
    username: string;
    profileImage: string | null;
    profession: string | null;
    role: Role | null;
    isPro: boolean;
}

interface Company {
    id: number;
    companyName: string;
}

interface JobRecruiterProps {
    recruiter: RecruiterUser;
    company?: Company;
}

const JobRecruiter = ({
    recruiter,
    company,
}: JobRecruiterProps) => {
    const dispatch = useDispatch();

    const { user: currentUser } =
        useCurrentUser();

    /*
    |--------------------------------------------------------------------------
    | Messaging permission
    |--------------------------------------------------------------------------
    */

    const canMessage =
        !!currentUser?.isPro;

    /*
    |--------------------------------------------------------------------------
    | Render
    |--------------------------------------------------------------------------
    */

    return (
        <div className="w-full space-y-4 rounded-2xl border border-slate-200 bg-white p-5">

            {/* =====================================================
                HEADER
            ====================================================== */}

            <div className="flex items-center gap-2">
                <UserCircle2
                    className="h-4 w-4 text-slate-500"
                    strokeWidth={1.75}
                />

                <h3 className="text-sm font-bold text-slate-800">
                    Meet the Hiring Team
                </h3>
            </div>

            {/* =====================================================
                RECRUITER
            ====================================================== */}

            <div className="flex items-start gap-3">

                {/* Avatar */}

                <Link
                    href={`/userProfile/${recruiter.id}`}
                    className="flex-shrink-0"
                    aria-label={`View ${recruiter.username}'s profile`}
                >
                    <div className="relative">

                        <Image
                            src={
                                recruiter.profileImage ||
                                "/noProfile.webp"
                            }
                            alt={`${recruiter.username} profile`}
                            width={48}
                            height={48}
                            className="h-12 w-12 rounded-full border border-slate-200 object-cover"
                        />

                        {/* Pro badge */}

                        {recruiter.isPro && (
                            <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-amber-400">
                                <Crown
                                    className="h-2.5 w-2.5 text-white"
                                    strokeWidth={2.5}
                                />
                            </div>
                        )}

                    </div>
                </Link>

                {/* =================================================
                    RECRUITER INFO
                ================================================== */}

                <div className="min-w-0 flex-1">

                    <Link
                        href={`/userProfile/${recruiter.id}`}
                        className="block truncate text-sm font-bold text-slate-800 transition-colors duration-200 hover:text-indigo-600"
                    >
                        {recruiter.username}
                    </Link>

                    <p className="mt-0.5 truncate text-xs text-slate-500">
                        {recruiter.profession ||
                            "Recruiter"}

                        {company?.companyName &&
                            ` · ${company.companyName}`}
                    </p>

                    <span className="mt-1 inline-block rounded-full border border-indigo-100 bg-indigo-50 px-2 py-0.5 text-[11px] font-medium text-indigo-500">
                        Job poster
                    </span>

                </div>

                {/* =================================================
                    MESSAGE BUTTON
                ================================================== */}

                <button
                    type="button"
                    onClick={() => {
                        if (!canMessage) {
                            return;
                        }

                        dispatch(
                            openModal(
                                `messageModel-${recruiter.id}`
                            )
                        );
                    }}
                    disabled={!canMessage}
                    title={
                        canMessage
                            ? `Message ${recruiter.username}`
                            : "Upgrade to Premium to message recruiters"
                    }
                    aria-label={
                        canMessage
                            ? `Message ${recruiter.username}`
                            : "Upgrade to Premium to message recruiters"
                    }
                    className={`inline-flex flex-shrink-0 items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition-all duration-200 ${canMessage
                            ? "border-slate-200 bg-white text-slate-700 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700"
                            : "cursor-not-allowed border-slate-200 bg-slate-50 text-slate-400"
                        }`}
                >
                    {canMessage ? (
                        <MessageSquare
                            className="h-3.5 w-3.5"
                            strokeWidth={2}
                        />
                    ) : (
                        <Lock
                            className="h-3.5 w-3.5"
                            strokeWidth={2}
                        />
                    )}

                    Message
                </button>
            </div>

            {/* =====================================================
                PREMIUM MESSAGE
            ====================================================== */}

            {!canMessage && (
                <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5">

                    <Crown
                        className="h-3.5 w-3.5 flex-shrink-0 text-amber-500"
                        strokeWidth={2}
                    />

                    <p className="text-xs text-amber-700">
                        <span className="font-semibold">
                            Premium
                        </span>{" "}
                        members can message recruiters
                        directly.{" "}

                        <Link
                            href="/subscription"
                            className="underline underline-offset-2 transition-colors hover:text-amber-800"
                        >
                            Upgrade
                        </Link>
                    </p>

                </div>
            )}

            {/* =====================================================
                MESSAGE MODAL
            ====================================================== */}

            <Model
                modalId={`messageModel-${recruiter.id}`}
                title={`Message ${recruiter.username}`}
                className="min-w-[300px] lg:w-[800px]"
                bodyContent={
                    <MessageBox
                        receiverId={recruiter.id}
                        chatUser={{
                            id: recruiter.id,
                            username:
                                recruiter.username,
                            userImage:
                                recruiter.profileImage,
                            profession:
                                recruiter.profession,
                            role: recruiter.role,
                            isPro: recruiter.isPro,
                        }}
                    />
                }
            >
                <div />
            </Model>

        </div>
    );
};

export default JobRecruiter;