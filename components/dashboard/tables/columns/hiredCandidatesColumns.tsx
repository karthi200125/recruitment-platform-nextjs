"use client";

import { ColumnDef } from "@tanstack/react-table";

import { format } from "date-fns";
import Image from "next/image";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

interface HiredUser {
    username?: string | null;

    email?: string | null;

    userImage?: string | null;
}

interface HiredJob {
    jobTitle: string;
}

export interface HiredCandidateRow {
    id: number;

    updatedAt: Date;

    user: HiredUser;

    job: HiredJob;
}

// ─────────────────────────────────────────────
// Columns
// ─────────────────────────────────────────────

export const hiredCandidatesColumns: ColumnDef<HiredCandidateRow>[] =
    [
        {
            accessorKey: "user",

            header: "Candidate",

            cell: ({ row }) => {
                const user =
                    row.original.user;

                return (
                    <div className="flex items-center gap-3">
                        <Image
                            src={
                                user?.userImage ??
                                "/placeholder.png"
                            }
                            alt="candidate"
                            className="h-10 w-10 rounded-full object-cover"
                            fill
                            sizes="40px"
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

            header: "Hired For",

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
            accessorKey: "updatedAt",

            header: "Hired Date",

            cell: ({ row }) => (
                <span className="whitespace-nowrap text-sm text-slate-600">
                    {format(
                        new Date(
                            row.original
                                .updatedAt
                        ),
                        "dd MMM yyyy"
                    )}
                </span>
            ),
        },
    ];