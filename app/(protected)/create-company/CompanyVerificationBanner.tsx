"use client";

import { CheckCircle, CircleDashed, Clock, Loader2 } from "lucide-react";

interface CompanyVerificationBannerProps {
    companyIsVerified: boolean;
}

export default function CompanyVerificationBanner({
    companyIsVerified,
}: CompanyVerificationBannerProps) {
    if (companyIsVerified) return null;

    return (
        <div
            role="status"
            aria-label="Company verification pending"
            className="mt-10 mb-6 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4
                 dark:border-amber-800 dark:bg-amber-950"
        >
            <div className="flex items-start gap-3">
                {/* Icon */}
                <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center
                        rounded-full border border-amber-200 dark:border-amber-800">
                    <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                </div>

                <div className="min-w-0 flex-1">
                    {/* Title + badge row */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
                            Verification pending
                        </p>
                        <span className="inline-flex items-center gap-1.5 rounded-md
                             bg-amber-200 px-2.5 py-1 text-xs font-medium
                             text-amber-800 dark:bg-amber-800 dark:text-amber-100">
                            <Loader2 className="h-3 w-3 animate-spin" aria-hidden="true" />
                            In review
                        </span>
                    </div>

                    {/* Body */}
                    <p className="mt-1 text-sm leading-relaxed text-amber-700
                        dark:text-amber-300">
                        Your profile is under review. You can update your company info,
                        but job posts are paused until you're verified.
                    </p>

                    {/* Progress steps */}
                    <div className="mt-3 flex flex-wrap items-center gap-4 border-t
                          border-amber-200 pt-3 dark:border-amber-800">
                        <Step
                            icon={<CheckCircle className="h-3.5 w-3.5 text-emerald-600
                                            dark:text-emerald-400" />}
                            label="Profile submitted"
                            active
                        />
                        <Step
                            icon={<Clock className="h-3.5 w-3.5 text-amber-600
                                      dark:text-amber-400" />}
                            label="Review in progress"
                            active
                        />
                        <Step
                            icon={<CircleDashed className="h-3.5 w-3.5 text-amber-400
                                             opacity-50 dark:text-amber-600" />}
                            label="Verified — post jobs"
                            active={false}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

function Step({
    icon,
    label,
    active,
}: {
    icon: React.ReactNode;
    label: string;
    active: boolean;
}) {
    return (
        <div className={[
            "flex items-center gap-1.5 text-xs",
            active
                ? "text-amber-700 dark:text-amber-300"
                : "text-amber-400 opacity-50 dark:text-amber-600",
        ].join(" ")}>
            {icon}
            {label}
        </div>
    );
}