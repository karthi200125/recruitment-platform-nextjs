"use client";

import Image from "next/image";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

import { ProfileViewWithViewer } from "@/types";

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
                    Profile Views
                </h2>

                <Link
                    href="/dashboard?tab=profileViews"
                    className="text-[14px] font-medium text-blue-600 transition-colors hover:text-blue-700"
                >
                    View all
                </Link>
            </div>

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
                                                "/images/user-placeholder.png"
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
        </section>
    );
};

export default ProfileViewsCard;