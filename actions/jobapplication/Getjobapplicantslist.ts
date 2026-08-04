"use server";

import { Role } from "@prisma/client";
import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";

import { authOptions } from "@/lib/authentication/authOptions";
import { db } from "@/lib/db";
import { resolveCompanyId } from "./updateApplicationStatus";
import { ApplicantApplication } from "@/types/applicants";
import { markApplicationViewedIfNeeded } from "./Markapplicationviewed";

export type AppliedWithinFilter = "today" | "yesterday" | "3days" | "week" | "older" | null;
export type SortOption = "newest" | "match";

interface GetJobApplicantsListParams {
    jobId: number;
    applicantId?: number;
    search?: string;
    status?: string;
    appliedWithin?: AppliedWithinFilter;
    sort?: SortOption;
}

interface JobApplicantsListResult {
    job: { id: number; jobTitle: string; status: string; skills: string[] };
    applicants: ApplicantApplication[];
    selected: ApplicantApplication | null;
}

const normalizeSkill = (skill: string) => skill.trim().toLowerCase();

const computeMatch = (jobSkills: string[], candidateSkills: string[]) => {
    if (jobSkills.length === 0) return { matchedSkillsCount: 0, matchPercent: 0 };

    const candidateSet = new Set(candidateSkills.map(normalizeSkill));
    const matchedSkillsCount = jobSkills.filter((skill) => candidateSet.has(normalizeSkill(skill))).length;

    return {
        matchedSkillsCount,
        matchPercent: Math.round((matchedSkillsCount / jobSkills.length) * 100),
    };
};

const isWithinBucket = (appliedAt: Date, bucket: AppliedWithinFilter): boolean => {
    if (!bucket) return true;

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const ageMs = startOfToday.getTime() - new Date(appliedAt.getFullYear(), appliedAt.getMonth(), appliedAt.getDate()).getTime();
    const ageDays = Math.round(ageMs / (24 * 60 * 60 * 1000));

    switch (bucket) {
        case "today":
            return ageDays === 0;
        case "yesterday":
            return ageDays === 1;
        case "3days":
            return ageDays >= 2 && ageDays <= 3;
        case "week":
            return ageDays >= 4 && ageDays <= 7;
        case "older":
            return ageDays > 7;
        default:
            return true;
    }
};

export const getJobApplicantsList = async ({
    jobId,
    applicantId,
    search = "",
    status,
    appliedWithin = null,
    sort = "newest",
}: GetJobApplicantsListParams): Promise<JobApplicantsListResult> => {
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

    const job = await db.job.findFirst({
        where: {
            id: jobId,
            ...(role === "ORGANIZATION" ? { companyId: companyId ?? -1 } : { userId }),
        },
        select: { id: true, jobTitle: true, status: true, skills: true },
    });

    if (!job) {
        notFound();
    }

    const rows = await db.jobApplication.findMany({
        where: { jobId: job.id },
        include: {
            user: {
                select: {
                    id: true,
                    username: true,
                    firstName: true,
                    lastName: true,
                    profileImage: true,
                    profession: true,
                    city: true,
                    skills: true,
                },
            },
            statusHistory: { select: { id: true, status: true, createdAt: true }, orderBy: { createdAt: "asc" } },
        },
        orderBy: { createdAt: "desc" },
    });

    let applicants: ApplicantApplication[] = rows.map((row) => {
        const { matchedSkillsCount, matchPercent } = computeMatch(job.skills, row.user.skills);

        return {
            id: row.id,
            jobId: row.jobId,
            status: row.status,
            appliedAt: row.appliedAt,
            candidateEmail: row.candidateEmail,
            candidateMobile: row.candidateMobile,
            candidateResume: row.candidateResume,
            questionAndAnswers: row.questionAndAnswers as ApplicantApplication["questionAndAnswers"],
            user: row.user,
            statusHistory: row.statusHistory,
            matchedSkillsCount,
            matchPercent,
        };
    });

    if (status) {
        applicants = applicants.filter((a) => a.status === status);
    }

    if (appliedWithin) {
        applicants = applicants.filter((a) => isWithinBucket(a.appliedAt, appliedWithin));
    }

    if (search.trim()) {
        const term = search.trim().toLowerCase();
        applicants = applicants.filter((a) => {
            const name = `${a.user.firstName ?? ""} ${a.user.lastName ?? ""} ${a.user.username}`.toLowerCase();
            return name.includes(term) || a.candidateEmail.toLowerCase().includes(term);
        });
    }

    if (sort === "match") {
        applicants = applicants.slice().sort((a, b) => b.matchPercent - a.matchPercent);
    }

    const selected =
        (applicantId ? applicants.find((a) => a.id === applicantId) : null) ?? applicants[0] ?? null;

    if (selected) {
        const wasApplied = selected.status === "APPLIED";
        await markApplicationViewedIfNeeded(selected.id);

        if (wasApplied) {
            selected.status = "VIEWED";
            selected.statusHistory = [...selected.statusHistory, { id: -1, status: "VIEWED", createdAt: new Date() }];
        }
    }

    return { job, applicants, selected };
};