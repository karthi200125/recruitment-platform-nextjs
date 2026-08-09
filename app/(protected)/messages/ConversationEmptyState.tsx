"use client";

import { MessageCircle, Users, UserPlus } from "lucide-react";


const ConversationEmptyState = () => {
    return (
        <div className="flex h-full min-h-0 flex-1 flex-col items-center justify-center px-6 py-10 text-center">
            {/* Illustration */}
            <div className="relative mb-7 flex h-36 w-52 items-center justify-center">
                {/* Soft background circle */}
                <div className="absolute right-5 top-0 h-28 w-28 rounded-full bg-indigo-50" />

                {/* Back message bubble */}
                <div className="absolute right-8 top-12 h-14 w-14 rounded-xl border-2 border-indigo-200 bg-white">
                    <div className="absolute bottom-[-8px] left-5 h-4 w-4 rotate-45 border-b-2 border-r-2 border-indigo-200 bg-white" />
                </div>

                {/* Main message bubble */}
                <div className="absolute left-8 top-8 h-16 w-28 rounded-xl border-[3px] border-indigo-300 bg-white">
                    {/* Bubble tail */}
                    <div className="absolute -bottom-3 left-7 h-6 w-6 rotate-45 border-b-[3px] border-r-[3px] border-indigo-300 bg-white" />

                    {/* Dots */}
                    <div className="absolute inset-0 flex items-center justify-center gap-2">
                        <span className="h-3 w-3 rounded-full bg-indigo-300" />
                        <span className="h-3 w-3 rounded-full bg-indigo-300" />
                        <span className="h-3 w-3 rounded-full bg-indigo-300" />
                    </div>
                </div>

                {/* Decorative dots / lines */}
                <span className="absolute left-1 top-16 h-4 w-4 rounded-full border-[3px] border-indigo-300" />

                <span className="absolute left-8 top-3 h-3 w-[3px] rotate-[-45deg] rounded-full bg-indigo-300" />

                <span className="absolute left-14 top-1 h-2 w-[3px] rounded-full bg-indigo-300" />

                <span className="absolute right-1 top-16 h-2 w-3 rounded-full bg-indigo-300" />

                <span className="absolute right-3 top-10 h-2 w-[3px] rounded-full bg-indigo-300" />
            </div>

            {/* Heading */}
            <h3 className="text-[21px] font-semibold tracking-[-0.02em] text-slate-900">
                Find people and start a conversation
            </h3>

            {/* Description */}
            <p className="mt-3 max-w-md text-[15px] leading-6 text-slate-500">
                Search for candidates, recruiters, or companies
                <br className="hidden sm:block" />
                and connect with them on Jobify.
            </p>                                    
        </div>
    );
};

export default ConversationEmptyState;