"use client";

import { Search, Loader2, X } from "lucide-react";

interface InviteRecruiterSearchInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    isLoading?: boolean;
    disabled?: boolean;
    className?: string;
}

const InviteRecruiterSearchInput = ({
    value,
    onChange,
    placeholder = "Search by username or email...",
    isLoading = false,
    disabled = false,
    className,
}: InviteRecruiterSearchInputProps) => {
    return (
        <div className={className}>
            <div className="relative">
                {/* Left Icon */}
                <Search
                    className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
                    strokeWidth={2}
                />

                {/* Input */}
                <input
                    type="text"
                    value={value}
                    disabled={disabled}
                    placeholder={placeholder}
                    onChange={(e) =>
                        onChange(e.target.value)
                    }
                    className="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-12 pr-12 text-[15px] text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50"
                />

                {/* Right Side */}
                <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center">
                    {isLoading ? (
                        <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                    ) : (
                        value && (
                            <button
                                type="button"
                                onClick={() => onChange("")}
                                className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                            >
                                <X
                                    className="h-4 w-4"
                                    strokeWidth={2.5}
                                />
                            </button>
                        )
                    )}
                </div>
            </div>

            {/* Helper Text */}
            <p className="mt-2 text-sm text-slate-500">
                Search recruiters using their username or email address.
            </p>
        </div>
    );
};

export default InviteRecruiterSearchInput;