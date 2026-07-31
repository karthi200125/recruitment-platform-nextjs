"use client";

import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { ArrowUpRight, Briefcase } from "lucide-react";
import type { JobApplicationWithUser } from "@/types";
import { getStatusColor } from "@/lib/dashboard/statusColor";
import { ApplicationStatus } from "@prisma/client";

interface RecentApplicationsCardProps {
    applications: JobApplicationWithUser[];
    isLoading?: boolean;
}

function formatStatus(status: ApplicationStatus): string {
    return status
        .replaceAll("_", " ")
        .toLowerCase()
        .replace(/\b\w/g, (c) => c.toUpperCase());
}

function CardHeader() {
    return (
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
            <h2 className="text-base font-semibold text-slate-900">Recent Applications</h2>
            <Link
                href="/dashboard?tab=applications"
                className="text-sm font-medium text-blue-600 transition-colors hover:text-blue-700"
            >
                View all
            </Link>
        </div>
    );
}

function CompanyLogo({ src, name }: { src: string | null; name: string }) {
    return (
        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
            <Image
                src={src ?? "/noImage.webp"}
                alt={`${name} logo`}
                fill
                sizes="40px"
                className="object-cover"
            />
        </div>
    );
}

function StatusBadge({ status }: { status: ApplicationStatus }) {
    return (
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(status)}`}>
            {formatStatus(status)}
        </span>
    );
}

function SkeletonRows({ count }: { count: number }) {
    return (
        <>
            {Array.from({ length: count }).map((_, i) => (
                <tr key={i} className="border-b border-slate-100 last:border-0" aria-hidden="true">
                    <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 shrink-0 animate-pulse rounded-lg bg-slate-100" />
                            <div className="space-y-1.5">
                                <div className="h-3.5 w-32 animate-pulse rounded bg-slate-100" />
                                <div className="h-3 w-20 animate-pulse rounded bg-slate-100" />
                            </div>
                        </div>
                    </td>
                    <td className="px-6 py-4"><div className="h-3.5 w-28 animate-pulse rounded bg-slate-100" /></td>
                    <td className="px-6 py-4"><div className="h-5 w-20 animate-pulse rounded-full bg-slate-100" /></td>
                    <td className="px-6 py-4"><div className="h-3.5 w-24 animate-pulse rounded bg-slate-100" /></td>
                    <td className="px-6 py-4"><div className="h-3.5 w-14 animate-pulse rounded bg-slate-100" /></td>
                </tr>
            ))}
        </>
    );
}

function MobileSkeletonCards({ count }: { count: number }) {
    return (
        <div className="space-y-3 p-4">
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="rounded-xl border border-slate-100 p-4 animate-pulse" aria-hidden="true">
                    <div className="flex items-start gap-3">
                        <div className="h-10 w-10 shrink-0 rounded-lg bg-slate-100" />
                        <div className="flex-1 space-y-2">
                            <div className="h-3.5 w-2/3 rounded bg-slate-100" />
                            <div className="h-3 w-1/3 rounded bg-slate-100" />
                            <div className="flex gap-2 pt-1">
                                <div className="h-5 w-20 rounded-full bg-slate-100" />
                                <div className="h-5 w-16 rounded bg-slate-100" />
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}


function EmptyState() {
    return (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 py-14">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100">
                <Briefcase className="h-6 w-6 text-slate-400" />
            </div>
            <div className="text-center">
                <p className="text-sm font-medium text-slate-700">No applications yet</p>
                <p className="mt-0.5 text-sm text-slate-400">Jobs you apply to will appear here.</p>
            </div>
            <Link
                href="/jobs"
                className="mt-1 inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700"
            >
                Browse jobs <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
        </div>
    );
}

export default function RecentApplicationsCard({
    applications,
    isLoading = false,
}: RecentApplicationsCardProps) {
    return (
        <section className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <CardHeader />

            {/* ── Desktop table ── */}
            <div className="hidden lg:block">
                {isLoading ? (
                    <table className="w-full border-collapse">
                        <thead>
                            <TableHead />
                        </thead>
                        <tbody>
                            <SkeletonRows count={5} />
                        </tbody>
                    </table>
                ) : applications.length === 0 ? (
                    <EmptyState />
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <TableHead />
                            </thead>
                            <tbody>
                                {applications.map((application) => {
                                    const { job } = application;
                                    const { company } = job;
                                    return (
                                        <tr
                                            key={application.id}
                                            className="border-b border-slate-100 transition-colors hover:bg-slate-50/60 last:border-0"
                                        >
                                            {/* Job */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <CompanyLogo src={company.companyImage} name={company.companyName} />
                                                    <div className="min-w-0">
                                                        <p className="truncate text-sm font-semibold text-slate-900">{job.jobTitle}</p>
                                                        {/* Fixed: use job.type + job.mode (NOT jobType which doesn't exist) */}
                                                        <p className="truncate text-xs text-slate-400">{job.type} · {job.mode}</p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Company */}
                                            <td className="px-6 py-4">
                                                <p className="truncate text-sm font-medium text-slate-700">{company.companyName}</p>
                                                {/* Fixed: use companyCity/companyCountry (NOT city/country) */}
                                                <p className="truncate text-xs text-slate-400">{company.companyCity}, {company.companyCountry}</p>
                                            </td>

                                            {/* Status */}
                                            <td className="px-6 py-4">
                                                <StatusBadge status={application.status} />
                                            </td>

                                            {/* Date */}
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">
                                                {format(application.createdAt, "dd MMM yyyy")}
                                            </td>

                                            {/* Action — replaced the no-op MoreVertical with a real link */}
                                            <td className="px-6 py-4 text-right">
                                                <Link
                                                    href={`/jobs/${job.id}`}
                                                    className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 transition-colors hover:text-blue-700"
                                                    aria-label={`View ${job.jobTitle} job posting`}
                                                >
                                                    View <ArrowUpRight className="h-3 w-3" />
                                                </Link>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* ── Mobile cards ── */}
            <div className="lg:hidden">
                {isLoading ? (
                    <MobileSkeletonCards count={3} />
                ) : applications.length === 0 ? (
                    <EmptyState />
                ) : (
                    <div className="space-y-3 p-4">
                        {applications.map((application) => {
                            const { job } = application;
                            const { company } = job;
                            return (
                                <Link
                                    key={application.id}
                                    href={`/jobs/${job.id}`}
                                    className="flex items-start gap-3 rounded-xl border border-slate-100 p-4 transition-colors hover:bg-slate-50/60"
                                    aria-label={`${job.jobTitle} at ${company.companyName}`}
                                >
                                    <CompanyLogo src={company.companyImage} name={company.companyName} />
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-semibold text-slate-900">{job.jobTitle}</p>
                                                <p className="truncate text-xs text-slate-400">{company.companyName} · {company.companyCity}</p>
                                            </div>
                                            <ArrowUpRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-300" aria-hidden="true" />
                                        </div>
                                        <div className="mt-2.5 flex flex-wrap items-center gap-2">
                                            <StatusBadge status={application.status} />
                                            <span className="text-xs text-slate-400">{format(application.createdAt, "dd MMM yyyy")}</span>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </section>
    );
}

function TableHead() {
    return (
        <tr className="border-b border-slate-100">
            {["Job", "Company", "Status", "Applied", ""].map((col, i) => (
                <th
                    key={i}
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-400"
                >
                    {col}
                </th>
            ))}
        </tr>
    );
}