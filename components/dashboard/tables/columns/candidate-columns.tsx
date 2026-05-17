"use client";

import Link from "next/link";
import Image from "next/image";
import { ColumnDef } from "@tanstack/react-table";
import { Prisma } from "@prisma/client";
import {
    MoreHorizontal, ExternalLink, Trash2,
    Building2, MapPin, Clock, ArrowUpDown,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import DashboardStatusBadge from "../DashboardStatusBadge";

// ─── Types ────────────────────────────────────────────────────────────────────

type CandidateApplication = Prisma.JobApplicationGetPayload<{
    include: {
        job: { include: { company: true } };
        statusHistory: true;
    };
}>;

type SavedJobType = Prisma.SavedJobGetPayload<{
    include: {
        job: { include: { company: true } };
    };
}>;

// ─── Shared helpers ───────────────────────────────────────────────────────────

function CompanyLogo({ image, name }: { image?: string | null; name: string }) {
    if (image) {
        return (
            <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-slate-200 bg-slate-50 flex-shrink-0">
                <Image src={image} alt={name} fill className="object-cover" />
            </div>
        );
    }
    return (
        <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center flex-shrink-0">
            <Building2 className="w-4 h-4 text-slate-400" strokeWidth={1.75} />
        </div>
    );
}

function LocationCell({ city, country }: { city?: string | null; country?: string | null }) {
    const location = [city, country].filter(Boolean).join(", ");
    if (!location) return <span className="text-xs text-slate-400">—</span>;
    return (
        <div className="flex items-center gap-1.5 text-sm text-slate-600">
            <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" strokeWidth={2} />
            {location}
        </div>
    );
}

function TimeCell({ date }: { date: Date | string }) {
    return (
        <div className="flex items-center gap-1.5 text-sm text-slate-500">
            <Clock className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" strokeWidth={2} />
            {formatDistanceToNow(new Date(date), { addSuffix: true })}
        </div>
    );
}

// ─── Applied columns ──────────────────────────────────────────────────────────

export const candidateAppliedColumns: ColumnDef<CandidateApplication>[] = [
    {
        accessorKey: "job",
        header: ({ column }) => (
            <button
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wide hover:text-slate-700 transition-colors"
            >
                Job
                <ArrowUpDown className="w-3 h-3" strokeWidth={2} />
            </button>
        ),
        cell: ({ row }) => {
            const app = row.original;
            const company = app.job.company;
            return (
                <div className="flex items-start gap-3 min-w-[220px]">
                    <CompanyLogo image={company.companyImage} name={company.companyName} />
                    <div className="min-w-0 space-y-0.5">
                        <Link
                            href={`/jobs/${app.job.id}`}
                            className="block text-sm font-semibold text-slate-800 hover:text-indigo-600 line-clamp-1 transition-colors duration-150 capitalize"
                        >
                            {app.job.jobTitle}
                        </Link>
                        <p className="text-xs text-slate-500 line-clamp-1">{company.companyName}</p>

                        {/* Mobile inline meta */}
                        <div className="flex flex-wrap items-center gap-2 pt-1.5 lg:hidden">
                            <DashboardStatusBadge status={app.status} />
                            <span className="text-[11px] text-slate-400">
                                {formatDistanceToNow(new Date(app.appliedAt), { addSuffix: true })}
                            </span>
                        </div>
                    </div>
                </div>
            );
        },
    },
    {
        accessorKey: "location",
        header: () => (
            <span className="hidden lg:block text-xs font-semibold text-slate-500 uppercase tracking-wide">Location</span>
        ),
        cell: ({ row }) => (
            <div className="hidden lg:block">
                <LocationCell city={row.original.job.city} country={row.original.job.country} />
            </div>
        ),
    },
    {
        accessorKey: "appliedAt",
        header: ({ column }) => (
            <button
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                className="hidden lg:inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wide hover:text-slate-700 transition-colors"
            >
                Applied
                <ArrowUpDown className="w-3 h-3" strokeWidth={2} />
            </button>
        ),
        cell: ({ row }) => (
            <div className="hidden lg:block">
                <TimeCell date={row.original.appliedAt} />
            </div>
        ),
    },
    {
        accessorKey: "status",
        header: () => (
            <span className="hidden lg:block text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</span>
        ),
        cell: ({ row }) => (
            <div className="hidden lg:block">
                <DashboardStatusBadge status={row.original.status} />
            </div>
        ),
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const app = row.original;
            return (
                <div className="flex justify-end">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-xl hover:bg-slate-100 text-slate-500"
                            >
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 rounded-2xl border border-slate-200 shadow-lg p-1">
                            <DropdownMenuItem asChild>
                                <Link
                                    href={`/jobs/${app.job.id}`}
                                    className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-slate-700 cursor-pointer hover:bg-slate-50"
                                >
                                    <ExternalLink className="h-3.5 w-3.5 text-slate-400" strokeWidth={2} />
                                    View Job
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="my-1 bg-slate-100" />
                            <DropdownMenuItem className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-red-600 cursor-pointer hover:bg-red-50 focus:bg-red-50 focus:text-red-600">
                                <Trash2 className="h-3.5 w-3.5" strokeWidth={2} />
                                Withdraw Application
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            );
        },
    },
];

// ─── Saved columns ────────────────────────────────────────────────────────────

export const candidateSavedColumns: ColumnDef<SavedJobType>[] = [
    {
        accessorKey: "job",
        header: () => (
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Job</span>
        ),
        cell: ({ row }) => {
            const saved = row.original;
            const company = saved.job.company;
            return (
                <div className="flex items-start gap-3 min-w-[220px]">
                    <CompanyLogo image={company.companyImage} name={company.companyName} />
                    <div className="min-w-0 space-y-0.5">
                        <Link
                            href={`/jobs/${saved.job.id}`}
                            className="block text-sm font-semibold text-slate-800 hover:text-indigo-600 line-clamp-1 transition-colors duration-150 capitalize"
                        >
                            {saved.job.jobTitle}
                        </Link>
                        <p className="text-xs text-slate-500 line-clamp-1">{company.companyName}</p>
                        <p className="pt-1 text-[11px] text-slate-400 lg:hidden">
                            Saved {formatDistanceToNow(new Date(saved.createdAt), { addSuffix: true })}
                        </p>
                    </div>
                </div>
            );
        },
    },
    {
        accessorKey: "location",
        header: () => (
            <span className="hidden lg:block text-xs font-semibold text-slate-500 uppercase tracking-wide">Location</span>
        ),
        cell: ({ row }) => (
            <div className="hidden lg:block">
                <LocationCell city={row.original.job.city} country={row.original.job.country} />
            </div>
        ),
    },
    {
        accessorKey: "createdAt",
        header: ({ column }) => (
            <button
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                className="hidden lg:inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wide hover:text-slate-700 transition-colors"
            >
                Saved
                <ArrowUpDown className="w-3 h-3" strokeWidth={2} />
            </button>
        ),
        cell: ({ row }) => (
            <div className="hidden lg:block">
                <TimeCell date={row.original.createdAt} />
            </div>
        ),
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const saved = row.original;
            return (
                <div className="flex justify-end">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-xl hover:bg-slate-100 text-slate-500"
                            >
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 rounded-2xl border border-slate-200 shadow-lg p-1">
                            <DropdownMenuItem asChild>
                                <Link
                                    href={`/jobs/${saved.job.id}`}
                                    className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-slate-700 cursor-pointer hover:bg-slate-50"
                                >
                                    <ExternalLink className="h-3.5 w-3.5 text-slate-400" strokeWidth={2} />
                                    View Job
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="my-1 bg-slate-100" />
                            <DropdownMenuItem className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-red-600 cursor-pointer hover:bg-red-50 focus:bg-red-50 focus:text-red-600">
                                <Trash2 className="h-3.5 w-3.5" strokeWidth={2} />
                                Remove Saved Job
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            );
        },
    },
];