import { authOptions } from "@/lib/auth/authOptions";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Briefcase, ArrowRight } from "lucide-react";
import Link from "next/link";
import StatusClient from "./StatusClient";

interface Props {
    searchParams?: { jobId?: string };
}

const MAX_APPLICATIONS = 100;

export default async function JobStatusPage({ searchParams }: Props) {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        redirect("/signin");
    }

    const userId = Number(session.user.id);

    if (!userId) {
        redirect("/signin");
    }

    const appliedJobs = await db.jobApplication.findMany({
        where: { userId },
        select: {
            id: true,
            jobId: true,
            status: true,
            createdAt: true,
            viewedAt: true,
            shortlistedAt: true,
            interviewScheduledAt: true,
            interviewedAt: true,
            hiredAt: true,
            rejectedAt: true,
            withdrawnAt: true,
            job: {
                select: {
                    jobTitle: true,
                    mode: true,
                    company: { select: { companyName: true, companyImage: true } },
                },
            },
            statusHistory: {
                select: { id: true, status: true, createdAt: true },
                orderBy: { createdAt: "asc" },
            },
        },
        orderBy: { createdAt: "desc" },
        take: MAX_APPLICATIONS,
    });

    if (appliedJobs.length === 0) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
                    <Briefcase className="h-7 w-7 text-slate-400" strokeWidth={1.5} />
                </div>
                <h2 className="mb-2 text-lg font-bold text-slate-800">No applications yet</h2>
                <p className="mb-6 max-w-xs text-sm leading-relaxed text-slate-400">
                    You haven&apos;t applied to any jobs yet. Start exploring opportunities and track them right here.
                </p>
                <Link
                    href="/jobs"
                    className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-indigo-200 transition-colors duration-200 hover:bg-indigo-500"
                >
                    Browse jobs
                    <ArrowRight className="h-4 w-4" />
                </Link>
            </div>
        );
    }
    
    const requestedJobId = searchParams?.jobId && !Number.isNaN(Number(searchParams.jobId)) ? Number(searchParams.jobId) : null;

    const selectedApplication =
        (requestedJobId ? appliedJobs.find((app) => app.jobId === requestedJobId) : null) ?? appliedJobs[0];

    return <StatusClient appliedJobs={appliedJobs} selectedApplication={selectedApplication} />;
}