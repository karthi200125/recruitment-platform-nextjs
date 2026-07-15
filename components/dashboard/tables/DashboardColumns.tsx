"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import Image from "next/image";

import { JobApplicationWithUser, JobWithCompany, User } from "@/types";
import { ApplicationStatus } from "@prisma/client";

// NOTE: field paths below assume JobApplicationWithUser includes `user` and
// `job.company`, and JobWithCompany includes `company`. Adjust the accessor
// paths to match your actual type definitions in @/types if they differ.

const STATUS_STYLES: Record<ApplicationStatus, string> = {
    APPLIED: "bg-slate-100 text-slate-700",
    VIEWED: "bg-sky-50 text-sky-600",
    UNDER_REVIEW: "bg-amber-50 text-amber-600",
    SHORTLISTED: "bg-violet-50 text-violet-600",
    INTERVIEW_SCHEDULED: "bg-blue-50 text-blue-600",
    INTERVIEWED: "bg-indigo-50 text-indigo-600",
    HIRED: "bg-emerald-50 text-emerald-600",
    REJECTED: "bg-red-50 text-red-600",
    WITHDRAWN: "bg-slate-100 text-slate-500",
};

const StatusBadge = ({ status }: { status: ApplicationStatus }) => (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_STYLES[status]}`}>
        {status.replace(/_/g, " ")}
    </span>
);

const formatDate = (date: Date | string) =>
    new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

export const jobApplicationColumns: ColumnDef<JobApplicationWithUser>[] = [
    {
        id: "candidate",
        header: "Candidate",
        cell: ({ row }) => {
            const user = row.original.user;
            return (
                <div className="flex items-center gap-3">
                    {user?.profileImage ? (
                        <Image
                            src={user.profileImage}
                            alt={user.username ?? "candidate"}
                            width={32}
                            height={32}
                            className="h-8 w-8 rounded-full object-cover"
                        />
                    ) : (
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-500">
                            {user?.firstName?.[0] ?? user?.username?.[0] ?? "?"}
                        </div>
                    )}
                    <div>
                        <p className="text-sm font-medium text-slate-900">
                            {user?.firstName ? `${user.firstName} ${user.lastName ?? ""}` : user?.username}
                        </p>
                        <p className="text-xs text-slate-500">{row.original.candidateEmail}</p>
                    </div>
                </div>
            );
        },
    },
    {
        id: "job",
        header: "Job",
        cell: ({ row }) => (
            <div>
                <p className="text-sm font-medium text-slate-900">{row.original.job?.jobTitle}</p>
                <p className="text-xs text-slate-500">{row.original.job?.company?.companyName}</p>
            </div>
        ),
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
        accessorKey: "appliedAt",
        header: "Applied",
        cell: ({ row }) => <span className="text-sm text-slate-600">{formatDate(row.original.appliedAt)}</span>,
    },
    {
        id: "actions",
        header: "",
        cell: ({ row }) => (
            <Link href={`/applications/${row.original.id}`} className="text-sm font-medium text-blue-600 hover:underline">
                View
            </Link>
        ),
    },
];

export const jobColumns: ColumnDef<JobWithCompany>[] = [
    {
        id: "job",
        header: "Job",
        cell: ({ row }) => (
            <div className="flex items-center gap-3">
                {row.original.company?.companyImage ? (
                    <Image
                        src={row.original.company.companyImage}
                        alt={row.original.company.companyName}
                        width={36}
                        height={36}
                        className="h-9 w-9 rounded-lg object-cover"
                    />
                ) : (
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-xs font-semibold text-slate-500">
                        {row.original.company?.companyName?.[0] ?? "?"}
                    </div>
                )}
                <div>
                    <p className="text-sm font-medium text-slate-900">{row.original.jobTitle}</p>
                    <p className="text-xs text-slate-500">{row.original.company?.companyName}</p>
                </div>
            </div>
        ),
    },
    {
        id: "location",
        header: "Location",
        cell: ({ row }) => (
            <span className="text-sm text-slate-600">
                {row.original.city}, {row.original.state}
            </span>
        ),
    },
    {
        accessorKey: "type",
        header: "Type",
        cell: ({ row }) => <span className="text-sm capitalize text-slate-600">{row.original.type}</span>,
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
            <span
                className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${row.original.status === "ACTIVE" ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500"
                    }`}
            >
                {row.original.status}
            </span>
        ),
    },
    {
        accessorKey: "createdAt",
        header: "Posted",
        cell: ({ row }) => <span className="text-sm text-slate-600">{formatDate(row.original.createdAt)}</span>,
    },
    {
        id: "actions",
        header: "",
        cell: ({ row }) => (
            <Link href={`/jobs/${row.original.id}`} className="text-sm font-medium text-blue-600 hover:underline">
                View
            </Link>
        ),
    },
];

export const userColumns: ColumnDef<User>[] = [
    {
        id: "user",
        header: "User",
        cell: ({ row }) => (
            <div className="flex items-center gap-3">
                {row.original.profileImage ? (
                    <Image
                        src={row.original.profileImage}
                        alt={row.original.username}
                        width={32}
                        height={32}
                        className="h-8 w-8 rounded-full object-cover"
                    />
                ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-500">
                        {row.original.username?.[0] ?? "?"}
                    </div>
                )}
                <div>
                    <p className="text-sm font-medium text-slate-900">
                        {row.original.firstName ? `${row.original.firstName} ${row.original.lastName ?? ""}` : row.original.username}
                    </p>
                    <p className="text-xs text-slate-500">@{row.original.username}</p>
                </div>
            </div>
        ),
    },
    {
        accessorKey: "profession",
        header: "Profession",
        cell: ({ row }) => <span className="text-sm text-slate-600">{row.original.profession ?? "—"}</span>,
    },
    {
        id: "actions",
        header: "",
        cell: ({ row }) => (
            <Link href={`/profile/${row.original.username}`} className="text-sm font-medium text-blue-600 hover:underline">
                View Profile
            </Link>
        ),
    },
];