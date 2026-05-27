"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ApplicationStatus } from "@prisma/client";
import DashboardStatusBadge from "@/components/dashboard/tables/DashboardStatusBadge";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

interface InterviewJob {
    jobTitle: string;
    company?: {
        companyName?: string | null;
    } | null;
}

export interface InterviewRow {
    id: number;
    status: ApplicationStatus;
    interviewScheduledAt?: Date | null;
    job: InterviewJob;
}

// ─────────────────────────────────────────────
// Columns
// ─────────────────────────────────────────────

export const interviewsColumns: ColumnDef<InterviewRow>[] = [
    {
        accessorKey: "job",
        header: "Job",

        cell: ({ row }) => {
            const { job } = row.original;

            return (
                <div className="space-y-1" >
                    <p className="font-semibold text-slate-900" >
                        {job?.jobTitle || "Untitled Job"
                        }
                    </p>

                    < p className="text-sm text-slate-500" >
                        {job?.company?.companyName ??
                            "Unknown Company"}
                    </p>
                </div>
            );
        },
    },

    {
        accessorKey: "status",
        header: "Status",

        cell: ({ row }) => (
            <DashboardStatusBadge
                status={row.original.status}
            />
        ),
    },

    {
        accessorKey: "interviewScheduledAt",
        header: "Interview Date",

        cell: ({ row }) => {
            const interviewDate =
                row.original.interviewScheduledAt;

            return (
                <span className="whitespace-nowrap text-sm text-slate-600" >
                    {
                        interviewDate
                            ? format(
                                new Date(interviewDate),
                                "dd MMM yyyy"
                            )
                            : "Pending"
                    }
                </span>
            );
        },
    },
];