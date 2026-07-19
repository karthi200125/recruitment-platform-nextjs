"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

export interface PostedJobRow {
    id: number;
    jobTitle: string;
    jobType: string;
    city?: string | null;
    country?: string | null;
    createdAt: Date;
    salary?: string | null;
    _count: {
        jobApplications: number;
    };
}

export const postedJobsColumns: ColumnDef<PostedJobRow>[] =
    [
        {
            accessorKey: "jobTitle",
            header: "Job",

            cell: ({ row }) => (
                <div className="space-y-1">
                    <p className="font-semibold text-slate-900">
                        {
                            row.original
                                .jobTitle
                        }
                    </p>

                    <p className="text-sm text-slate-500">
                        {row.original.city}
                        {row.original.country && `, ${row.original.country}`}
                    </p>
                </div>
            ),
        },

        {
            accessorKey: "jobType",
            header: "Type",

            cell: ({ row }) => (
                <span className="text-sm text-slate-600">
                    {row.original.jobType}
                </span>
            ),
        },

        {
            accessorKey: "salary",
            header: "Salary",

            cell: ({ row }) => (
                <span className="text-sm text-slate-600">
                    {row.original.salary ?? "Not specified"}
                </span>
            ),
        },

        {
            accessorKey: "_count.jobApplications",
            header: "Applicants",

            cell: ({ row }) => (
                <span className="font-medium text-slate-700">
                    {row.original._count.jobApplications}
                </span>
            ),
        },

        {
            accessorKey: "createdAt",
            header: "Posted",

            cell: ({ row }) => (
                <span className="whitespace-nowrap text-sm text-slate-600">
                    {format(new Date(row.original.createdAt), "dd MMM yyyy")}
                </span>
            ),
        },
    ];