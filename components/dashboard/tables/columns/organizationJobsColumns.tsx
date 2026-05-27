"use client";

import { ColumnDef } from "@tanstack/react-table";

import { format } from "date-fns";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

interface Recruiter {
    username?: string | null;

    email?: string | null;
}

export interface OrganizationJobRow {
    id: number;

    jobTitle: string;

    jobType: string;

    salary?: string | null;

    city?: string | null;

    country?: string | null;

    createdAt: Date;

    user?: Recruiter | null;

    _count: {
        jobApplications: number;
    };
}

// ─────────────────────────────────────────────
// Columns
// ─────────────────────────────────────────────

export const organizationJobsColumns: ColumnDef<OrganizationJobRow>[] =
    [
        {
            accessorKey: "jobTitle",

            header: "Job",

            cell: ({ row }) => {
                const job =
                    row.original;

                return (
                    <div className="space-y-1">
                        <p className="font-semibold text-slate-900">
                            {
                                job.jobTitle
                            }
                        </p>

                        <p className="text-sm text-slate-500">
                            {job.city}
                            {job.country &&
                                `, ${job.country}`}
                        </p>
                    </div>
                );
            },
        },

        {
            accessorKey: "user",

            header: "Recruiter",

            cell: ({ row }) => {
                const recruiter =
                    row.original.user;

                return (
                    <div className="space-y-1">
                        <p className="font-medium text-slate-800">
                            {recruiter?.username ??
                                "Unknown"}
                        </p>

                        <p className="text-sm text-slate-500">
                            {
                                recruiter?.email
                            }
                        </p>
                    </div>
                );
            },
        },

        {
            accessorKey: "jobType",

            header: "Type",

            cell: ({ row }) => (
                <span className="text-sm text-slate-600">
                    {
                        row.original
                            .jobType
                    }
                </span>
            ),
        },

        {
            accessorKey: "salary",

            header: "Salary",

            cell: ({ row }) => (
                <span className="text-sm text-slate-600">
                    {row.original
                        .salary ??
                        "Not specified"}
                </span>
            ),
        },

        {
            accessorKey:
                "_count.jobApplications",

            header: "Applicants",

            cell: ({ row }) => (
                <span className="font-medium text-slate-700">
                    {
                        row.original
                            ._count
                            .jobApplications
                    }
                </span>
            ),
        },

        {
            accessorKey: "createdAt",

            header: "Posted",

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