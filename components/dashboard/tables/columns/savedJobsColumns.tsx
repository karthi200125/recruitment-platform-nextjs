"use client";

import { ColumnDef } from "@tanstack/react-table";

export const savedJobsColumns: ColumnDef<any>[] = [
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
        accessorKey: "location",

        header: "Location",

        cell: ({ row }) => (
            <span>
                {
                    row.original.job
                        .city
                }
                ,
                {
                    row.original.job
                        .country
                }
            </span>
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
];