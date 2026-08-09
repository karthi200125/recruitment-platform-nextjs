"use client";

import { useEffect, useState } from "react";

import BottomDrawer from "@/components/BottomDrawer";
import { CandidateApplication } from "@/types/candidate-application";

import JobStatusList from "./JobStatusList";
import JobStatusDetails from "./JobStatusDetails";

interface StatusClientProps {
    appliedJobs: CandidateApplication[];
    selectedApplication: CandidateApplication | null;
}

export default function StatusClient({
    appliedJobs,
    selectedApplication,
}: StatusClientProps) {
    const [selectedId, setSelectedId] = useState<number | null>(
        selectedApplication?.id ?? null
    );

    const [isMobileDetailsOpen, setIsMobileDetailsOpen] =
        useState(false);

    /*
     * Keep local selection synchronized with
     * the server-provided selected application.
     */
    useEffect(() => {
        setSelectedId(selectedApplication?.id ?? null);
    }, [selectedApplication]);

    /*
     * Find the currently selected application.
     */
    const currentApplication =
        appliedJobs.find(
            (application) => application.id === selectedId
        ) ?? null;

    /*
     * Select an application.
     *
     * Desktop:
     * updates the right-side details panel.
     *
     * Mobile/tablet:
     * also opens the bottom drawer.
     */
    const handleSelectApplication = (id: number) => {
        setSelectedId(id);
        setIsMobileDetailsOpen(true);
    };

    /*
     * Handle drawer open / close.
     */
    const handleDrawerChange = (open: boolean) => {
        setIsMobileDetailsOpen(open);
    };

    return (
        <div className="mt-3 flex h-[calc(100vh-78px)] w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            {/* =====================================================
                LEFT — APPLICATION LIST
            ====================================================== */}

            <div className="flex w-full min-w-0 flex-shrink-0 flex-col border-r border-slate-100 md:w-[320px] lg:w-[380px]">

                {/* Header */}
                <div className="flex-shrink-0 border-b border-slate-100 px-4 py-4">
                    <h1 className="text-sm font-bold text-slate-800">
                        My Applications
                    </h1>

                    <p className="mt-1 text-xs text-slate-400">
                        {appliedJobs.length}{" "}
                        {appliedJobs.length === 1
                            ? "application"
                            : "applications"}
                    </p>
                </div>

                {/* Application list */}
                <div className="min-h-0 flex-1 overflow-y-auto">
                    <JobStatusList
                        jobs={appliedJobs}
                        selectedApplicationId={
                            currentApplication?.id ?? null
                        }
                        onSelectApplication={
                            handleSelectApplication
                        }
                    />
                </div>
            </div>

            {/* =====================================================
                RIGHT — DESKTOP DETAILS
            ====================================================== */}

            <div className="hidden min-w-0 flex-1 flex-col overflow-y-auto bg-slate-50/50 md:flex">
                <JobStatusDetails
                    application={currentApplication}
                />
            </div>

            {/* =====================================================
                MOBILE / TABLET — BOTTOM DRAWER
            ====================================================== */}

            <div className="md:hidden">
                <BottomDrawer
                    open={
                        isMobileDetailsOpen &&
                        !!currentApplication
                    }
                    onOpenChange={
                        handleDrawerChange
                    }
                    title={
                        currentApplication ? (
                            <p className="truncate text-sm font-semibold text-slate-900">
                                Application details
                            </p>
                        ) : undefined
                    }
                >
                    {currentApplication && (
                        <JobStatusDetails
                            application={
                                currentApplication
                            }
                        />
                    )}
                </BottomDrawer>
            </div>
        </div>
    );
}