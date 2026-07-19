"use server";

import { Role } from "@prisma/client";
import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";

import { authOptions } from "@/lib/auth/authOptions";
import { db } from "@/lib/db";
import { DashboardPagination as PaginatedResult } from "@/types/dashboard";
import { JobApplicationWithUser } from "@/types";
import { parseTableParams } from "../dashboard/utils/parseTableParams";
import { getApplicationsPage } from "../dashboard/queries/applicationsQuery";

const resolveCompanyId = async (userId: number, role: Role): Promise<number | null> => {
    if (role !== "ORGANIZATION") return null;
    const company = await db.company.findUnique({ where: { userId }, select: { id: true } });
    return company?.id ?? null;
};

interface JobApplicantsResult {
    job: { id: number; jobTitle: string; status: string };
    applicants: PaginatedResult<JobApplicationWithUser>;
}

export const getJobApplicantsPage = async (
    jobId: number,
    searchParams: Record<string, string | string[] | undefined>
): Promise<JobApplicantsResult> => {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        redirect("/signin");
    }

    const userId = Number(session.user.id);
    const role = (session.user.role as Role | null) ?? Role.CANDIDATE;

    if (role !== "RECRUITER" && role !== "ORGANIZATION") {
        notFound();
    }

    const companyId = await resolveCompanyId(userId, role);

    // ownership is enforced through the job lookup itself — if this job
    // doesn't belong to this recruiter/company, it simply won't be found
    const job = await db.job.findFirst({
        where: {
            id: jobId,
            ...(role === "ORGANIZATION" ? { companyId: companyId ?? -1 } : { userId }),
        },
        select: { id: true, jobTitle: true, status: true },
    });

    if (!job) {
        notFound();
    }

    const params = parseTableParams(searchParams, "page");

    const applicants = await getApplicationsPage({
        baseWhere: { jobId: job.id },
        params,
    });

    return { job, applicants };
};