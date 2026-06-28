"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import {
    ApplicationStatus,
} from "@prisma/client";
import DashboardStatusBadge from "@/components/dashboard/tables/DashboardStatusBadge";

interface ApplicantUser {
    username?: string | null;
    email?: string | null;
    userImage?: string | null;
}

interface ApplicantJob {
    jobTitle: string;
}

export interface ApplicantRow {
    id: number;

    status: ApplicationStatus;

    createdAt: Date;

    user: ApplicantUser;

    job: ApplicantJob;
}

// ─────────────────────────────────────────────
// Columns
// ─────────────────────────────────────────────

export const applicantsColumns: ColumnDef<ApplicantRow>[] =
    [
        {
            accessorKey: "user",

            header: "Candidate",

            cell: ({ row }) => {
                const user =
                    row.original.user;

                return (
                    <div className="flex items-center gap-3">
                        <img
                            src={
                                user?.userImage ??
                                "/placeholder.png"
                            }
                            alt="candidate"
                            className="h-10 w-10 rounded-full object-cover"
                        />

                        <div className="space-y-1">
                            <p className="font-semibold text-slate-900">
                                {user?.username ??
                                    "Unknown"}
                            </p>

                            <p className="text-sm text-slate-500">
                                {
                                    user?.email
                                }
                            </p>
                        </div>
                    </div>
                );
            },
        },

        {
            accessorKey: "job",

            header: "Applied Job",

            cell: ({ row }) => (
                <span className="font-medium text-slate-700">
                    {
                        row.original
                            .job
                            .jobTitle
                    }
                </span>
            ),
        },

        {
            accessorKey: "status",

            header: "Status",

            cell: ({ row }) => (
                <DashboardStatusBadge
                    status={
                        row.original
                            .status
                    }
                />
            ),
        },

        {
            accessorKey: "createdAt",

            header: "Applied",

            cell: ({ row }) => (
                <span className="whitespace-nowrap text-sm text-slate-600">
                    {format(
                        new Date(
                            row.original
                                .createdAt
                        ),
                        "dd MMM yyyy"
                    )}
                </span>
            ),
        },
    ];