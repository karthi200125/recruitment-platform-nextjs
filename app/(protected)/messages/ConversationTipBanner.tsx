"use client";

import { Lightbulb } from "lucide-react";

const ConversationTipBanner = () => {
    return (
        <div className="mx-4 mb-4 flex items-center gap-4 rounded-xl border border-indigo-200 bg-indigo-50/40 px-5 py-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
                <Lightbulb
                    className="h-6 w-6 text-indigo-500"
                    strokeWidth={1.7}
                />
            </div>

            <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-700">
                    Tip: You can also start a conversation from a user's profile
                </p>

                <p className="mt-1 text-sm leading-5 text-slate-500">
                    Just visit any candidate, recruiter, or company profile and
                    click the Message button.
                </p>
            </div>
        </div>
    );
};

export default ConversationTipBanner;