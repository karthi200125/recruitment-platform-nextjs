"use client";

import { useState } from "react";

import FilterNavbar from "@/components/FilterNavbar";
import BottomDrawer from "@/components/BottomDrawer";

import type { FilteredJob } from "@/actions/job/get-filter-all-jobs";
import type { JobSearchParams } from "@/types";

import JobDetails from "../../../components/Job/JobDetails";
import JobLists from "../../../components/Job/JobLists/JobLists";

interface Props {
    jobs: FilteredJob[];
    job: FilteredJob | null;
    isPending: boolean;
    onSelectedJob: (id: number) => void;
    count: number;
    currentPage: number;
    safeSearchParams: JobSearchParams;
}

function NoJobSelected() {
    return (
        <div className="flex h-full flex-col items-center justify-center px-6 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
                <svg
                    className="h-6 w-6 text-slate-400"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <rect
                        x="3"
                        y="4"
                        width="18"
                        height="16"
                        rx="2"
                    />
                    <path d="M8 4V2" />
                    <path d="M16 4V2" />
                    <path d="M3 9h18" />
                </svg>
            </div>

            <p className="mt-4 text-sm font-semibold text-slate-700">
                Select a job
            </p>

            <p className="mt-1 max-w-sm text-xs leading-5 text-slate-400">
                Click any listing on the left to view full job
                details, description, and apply.
            </p>
        </div>
    );
}

const Jobb = ({
    jobs,
    job,
    count,
    currentPage,
    isPending,
    onSelectedJob,
    safeSearchParams,
}: Props) => {
    const [
        isMobileDetailsOpen,
        setIsMobileDetailsOpen,
    ] = useState(false);
    
    const handleSelectJob = (id: number) => {
        onSelectedJob(id);
        setIsMobileDetailsOpen(true);
    };

    return (
        <div className="flex h-full w-full flex-col overflow-hidden">
            
            <div className="z-20 flex-shrink-0 border-b border-slate-100 bg-white">
                <FilterNavbar />
            </div>            

            <div className="flex min-h-0 flex-1 overflow-hidden">                

                <div className="flex w-full min-w-0 flex-shrink-0 flex-col overflow-hidden border-r border-slate-100 bg-white lg:w-[420px]">

                    <JobLists
                        jobs={jobs}
                        isLoading={isPending}
                        onSelectedJob={
                            handleSelectJob
                        }
                        count={count}
                        currentPage={
                            currentPage
                        }
                        selectedJobId={
                            job?.id ?? null
                        }
                    />

                </div>                

                <div className="hidden min-w-0 flex-1 flex-col overflow-hidden lg:flex">

                    {job ? (
                        <JobDetails
                            job={job}
                            safeSearchParams={
                                safeSearchParams
                            }
                        />
                    ) : (
                        <NoJobSelected />
                    )}

                </div>
            </div>            

            <div className="lg:hidden">
                <BottomDrawer
                    open={
                        isMobileDetailsOpen &&
                        !!job
                    }
                    onOpenChange={
                        setIsMobileDetailsOpen
                    }
                    title={
                        job ? (
                            <p className="truncate text-sm font-semibold text-slate-900">
                                {job.jobTitle}
                            </p>
                        ) : undefined
                    }
                >
                    {job && (
                        <JobDetails
                            job={job}
                            safeSearchParams={
                                safeSearchParams
                            }
                        />
                    )}
                </BottomDrawer>
            </div>

        </div>
    );
};

export default Jobb;