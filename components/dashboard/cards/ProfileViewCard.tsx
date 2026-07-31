"use client";

import Image from "next/image";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

import { ProfileViewWithViewer } from "@/types";
import { Lock } from "lucide-react";

interface ProfileViewsCardProps {
    profileViews: ProfileViewWithViewer[];
}

const ProfileViewsCard = ({
    profileViews,
}: ProfileViewsCardProps) => {
    return (
        <section className="w-full rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            {/* Header */}
            <div className="mb-5 flex items-center justify-between">
                <h2 className="text-[18px] font-semibold tracking-tight text-slate-900">
                    Profile Views ({profileViews.length || 0})
                </h2>

                <Link
                    href="/dashboard?tab=profileViews"
                    className="text-[14px] font-medium text-blue-600 transition-colors hover:text-blue-700"
                >
                    View all
                </Link>
            </div>


            <div className="relative">
                <div className="pointer-events-none select-none blur-sm opacity-60">
                    {/* Empty State */}
                    {profileViews.length === 0 ? (
                        <div className="flex h-40 items-center justify-center">
                            <p className="text-sm text-slate-500">
                                No profile views yet.
                            </p>
                        </div>
                    ) : (
                        <div className="flex flex-col">
                            {profileViews.map((view) => {
                                const viewer = view.viewer;

                                return (
                                    <div
                                        key={view.id}
                                        className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
                                    >
                                        {/* Left */}
                                        <div className="flex min-w-0 items-center gap-3">
                                            <div className="relative flex h-11 w-11 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                                                <Image
                                                    src={
                                                        viewer?.profileImage ??
                                                        '/noProfile.webp'
                                                    }
                                                    alt={
                                                        viewer?.username ??
                                                        "User"
                                                    }
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>

                                            <div className="min-w-0">
                                                <h3 className="truncate text-[15px] font-medium text-slate-900">
                                                    {viewer?.firstName &&
                                                        viewer?.lastName
                                                        ? `${viewer.firstName} ${viewer.lastName}`
                                                        : viewer?.username ??
                                                        "Anonymous"}
                                                </h3>

                                                <p className="truncate text-[14px] text-slate-500">
                                                    {viewer?.profession ??
                                                        "Professional"}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Right */}
                                        <span className="ml-3 flex-shrink-0 text-[13px] text-slate-400">
                                            {formatDistanceToNow(
                                                view.createdAt,
                                                {
                                                    addSuffix: true,
                                                }
                                            )}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                </div>

                <div className="absolute inset-0 flex flex-col items-center justify-center rounded-xl bg-white/30 backdrop-blur-[1px]">
                    {/* <Lock className="mb-3 h-10 w-10 text-slate-700" /> */}

                    <h3 className="text-lg font-semibold text-slate-900">
                        Unlock Profile Viewers
                    </h3>

                    <p className="mt-2 max-w-xs text-center text-sm text-slate-600">
                        Upgrade your subscription to see who viewed your profile and connect with recruiters faster.
                    </p>

                    <Link
                        href="/subscriptions"
                        className="mt-5 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
                    >
                        Upgrade Now
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default ProfileViewsCard;