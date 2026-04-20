import { authOptions } from "@/lib/authOptions";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Briefcase, ArrowRight } from "lucide-react";
import Link from "next/link";
import StatusClient from "./StatusClient";

interface Props {
    searchParams: {
        jobId?: string;
    };
}

export default async function JobStatusPage({ searchParams }: Props) {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        redirect("/signin");
    }

    const userId = Number(session.user.id);

    const appliedJobs = await db.jobApplication.findMany({
        where: { userId },
        include: {
            job: {
                include: {
                    company: true,
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    // ── Empty state ────────────────────────────────────────────────────────────
    if (appliedJobs.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
                <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-5">
                    <Briefcase className="w-7 h-7 text-slate-400" strokeWidth={1.5} />
                </div>
                <h2 className="text-lg font-bold text-slate-800 mb-2">No applications yet</h2>
                <p className="text-sm text-slate-400 max-w-xs leading-relaxed mb-6">
                    You haven't applied to any jobs yet. Start exploring opportunities and track them right here.
                </p>
                <Link
                    href="/jobs"
                    className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors duration-200 shadow-sm shadow-indigo-200"
                >
                    Browse jobs
                    <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        );
    }

    // ── Resolve selected job ───────────────────────────────────────────────────
    const selectedJobId =
        searchParams.jobId && !isNaN(Number(searchParams.jobId))
            ? Number(searchParams.jobId)
            : appliedJobs[0].jobId;

    const selectedApplication = await db.jobApplication.findFirst({
        where: { userId, jobId: selectedJobId },
        include: {
            job: {
                include: {
                    company: true,
                },
            },
        },
    });

    // ── Not found state ────────────────────────────────────────────────────────
    if (!selectedApplication) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
                <div className="w-16 h-16 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center mb-5">
                    <Briefcase className="w-7 h-7 text-red-400" strokeWidth={1.5} />
                </div>
                <h2 className="text-lg font-bold text-slate-800 mb-2">Application not found</h2>
                <p className="text-sm text-slate-400 max-w-xs leading-relaxed mb-6">
                    We couldn't find that application. It may have been removed or the link is invalid.
                </p>
                <Link
                    href="/dashboard/jobStatus"
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors duration-200"
                >
                    View all applications
                </Link>
            </div>
        );
    }

    // ── Main view ──────────────────────────────────────────────────────────────
    return (
        <StatusClient
            appliedJobs={appliedJobs}
            selectedApplication={selectedApplication}
        />
    );
}