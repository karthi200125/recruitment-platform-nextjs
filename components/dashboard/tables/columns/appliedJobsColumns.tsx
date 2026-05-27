"use client";

import { ColumnDef } from "@tanstack/react-table";

import { format } from "date-fns";

import DashboardStatusBadge from "@/components/dashboard/tables/DashboardStatusBadge";

export const appliedJobsColumns: ColumnDef<any>[] = [
    {
        accessorKey: "job",

        header: "Job",

        cell: ({ row }) => {
            const job = row.original.job;

            return (
                <div className="space-y-1">
                    <p className="font-semibold text-slate-900">
                        {job.jobTitle}
                    </p>

                    <p className="text-sm text-slate-500">
                        {
                            job.company
                                ?.companyName
                        }
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
                status={
                    row.original.status
                }
            />
        ),
    },

    {
        accessorKey: "salary",

        header: "Salary",

        cell: ({ row }) => (
            <span>
                {
                    row.original.job
                        .salary
                }
            </span>
        ),
    },

    {
        accessorKey: "appliedAt",

        header: "Applied",

        cell: ({ row }) => (
            <span>
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