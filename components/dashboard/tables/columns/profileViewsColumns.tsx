"use client";

import { ColumnDef } from "@tanstack/react-table";

export const profileViewsColumns: ColumnDef<any>[] = [
    {
        accessorKey: "viewer",

        header: "Viewer",

        cell: ({ row }) => {
            const viewer =
                row.original.viewer;

            return (
                <div className="flex items-center gap-3">
                    <img
                        src={
                            viewer?.userImage
                        }
                        alt="viewer"
                        className="h-10 w-10 rounded-full object-cover"
                    />

                    <div>
                        <p className="font-semibold text-slate-900">
                            {
                                viewer?.username
                            }
                        </p>

                        <p className="text-sm text-slate-500">
                            {
                                viewer?.email
                            }
                        </p>
                    </div>
                </div>
            );
        },
    },

    {
        accessorKey: "createdAt",

        header: "Viewed At",

        cell: ({ row }) => (
            <span>
                {new Date(
                    row.original.createdAt
                ).toLocaleDateString()}
            </span>
        ),
    },
];