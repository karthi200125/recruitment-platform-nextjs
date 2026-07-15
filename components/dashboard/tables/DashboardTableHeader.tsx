"use client";

import { ReactNode } from "react";

interface DashboardTableHeaderProps {
    title: string;
    description?: string;
    action?: ReactNode;
    className?: string;
}

const DashboardTableHeader = ({
    title,
    description,
    action,
    className,
}: DashboardTableHeaderProps) => {
    return (
        <div
            className={`flex flex-col gap-4 border-b border-slate-200 px-6 py-5 lg:flex-row lg:items-center lg:justify-between ${className ?? ""}`}
        >
            {/* Left */}
            <div className="space-y-1">
                <h2 className="text-[22px] font-semibold tracking-tight text-slate-900">
                    {title}
                </h2>

                {description && (
                    <p className="text-sm text-slate-500">
                        {description}
                    </p>
                )}
            </div>

            {/* Right */}
            {action && (
                <div className="flex flex-shrink-0 items-center gap-3">
                    {action}
                </div>
            )}
        </div>
    );
};

export default DashboardTableHeader;