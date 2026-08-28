"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Rocket, X } from "lucide-react";
import { useCurrentUser } from "@/hooks/useCurrentUser";

interface ProfileCompletionBannerProps {
    percentage: number;
    onImprove?: () => void;
}

const DISMISS_KEY = "jobify:dismiss-profile-tip";

const ProfileCompletionBanner = ({ percentage, onImprove }: ProfileCompletionBannerProps) => {
    const router = useRouter();
    const [dismissed, setDismissed] = useState(true);
    const { user } = useCurrentUser()

    useEffect(() => {
        setDismissed(localStorage.getItem(DISMISS_KEY) === "true");
    }, []);

    const handleDismiss = () => {
        localStorage.setItem(DISMISS_KEY, "true");
        setDismissed(true);
    };

    const handleImprove = () => {
        if (onImprove) {
            onImprove();
            return;
        }
        router.push(`/userProfile/${user?.id}`);
    };

    if (dismissed || percentage >= 100) {
        return null;
    }

    return (
        <div className="flex flex-col items-start gap-4 rounded-2xl border border-emerald-100 bg-emerald-50 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                    <Rocket className="h-5 w-5" strokeWidth={1.75} />
                </div>
                <div>
                    <p className="font-semibold text-slate-900">Tip: Complete your profile</p>
                    <p className="mt-0.5 text-sm text-slate-600">
                        Profiles 100% complete get 3x more profile views and 2x more interview requests.
                    </p>
                </div>
            </div>

            <div className="flex w-full flex-shrink-0 items-center gap-3 sm:w-auto">
                <button
                    type="button"
                    onClick={handleImprove}
                    className="flex-1 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-500 sm:flex-none"
                >
                    Improve Now
                </button>

                <button
                    type="button"
                    onClick={handleDismiss}
                    aria-label="Dismiss tip"
                    className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-emerald-100 hover:text-slate-600"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
};

export default ProfileCompletionBanner;