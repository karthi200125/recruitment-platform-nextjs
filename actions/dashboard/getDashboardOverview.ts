"use server";

import { Role } from "@prisma/client";

import { db } from "@/lib/db";
import { DashboardOverviewData, DashboardStatsMap } from "@/types/dashboard";

import { buildJobOwnershipFilter, buildApplicationOwnershipFilter, buildOwnApplicationsFilter } from "./utils/buildOwnershipFilter";
import { bucketTimestampsByDay, buildRollingStat } from "./queries/statsQuery";

const ACTIVITY_WINDOW_DAYS = 14;

const resolveCompanyId = async (userId: number, role: Role): Promise<number | null> => {
    if (role !== "ORGANIZATION") return null;
    const company = await db.company.findUnique({ where: { userId }, select: { id: true } });
    return company?.id ?? null;
};

const candidateStats = async (userId: number): Promise<DashboardStatsMap> => {
    const [appliedJobs, savedJobs, interviews, profileViews] = await Promise.all([
        buildRollingStat(
            { userId },
            (where) => db.jobApplication.count({ where }),
            (where) => db.jobApplication.findMany({ where, select: { createdAt: true } }).then((r) => r.map((x) => x.createdAt))
        ),
        buildRollingStat(
            { userId },
            (where) => db.savedJob.count({ where }),
            (where) => db.savedJob.findMany({ where, select: { createdAt: true } }).then((r) => r.map((x) => x.createdAt))
        ),
        buildRollingStat(
            { userId, status: { in: ["INTERVIEW_SCHEDULED", "INTERVIEWED"] } },
            (where) => db.jobApplication.count({ where }),
            (where) => db.jobApplication.findMany({ where, select: { createdAt: true } }).then((r) => r.map((x) => x.createdAt))
        ),
        buildRollingStat(
            { profileUserId: userId },
            (where) => db.profileView.count({ where }),
            (where) => db.profileView.findMany({ where, select: { createdAt: true } }).then((r) => r.map((x) => x.createdAt))
        ),
    ]);

    return { appliedJobs, savedJobs, interviews, profileViews };
};

const recruiterStats = async (userId: number): Promise<DashboardStatsMap> => {
    const jobFilter = buildJobOwnershipFilter({ userId, role: "RECRUITER" });
    const applicationFilter = buildApplicationOwnershipFilter({ userId, role: "RECRUITER" });

    const [postedJobs, applicants, interviews, hiredCandidates] = await Promise.all([
        buildRollingStat(
            jobFilter,
            (where) => db.job.count({ where }),
            (where) => db.job.findMany({ where, select: { createdAt: true } }).then((r) => r.map((x) => x.createdAt))
        ),
        buildRollingStat(
            applicationFilter,
            (where) => db.jobApplication.count({ where }),
            (where) => db.jobApplication.findMany({ where, select: { createdAt: true } }).then((r) => r.map((x) => x.createdAt))
        ),
        buildRollingStat(
            { ...applicationFilter, status: { in: ["INTERVIEW_SCHEDULED", "INTERVIEWED"] } },
            (where) => db.jobApplication.count({ where }),
            (where) => db.jobApplication.findMany({ where, select: { createdAt: true } }).then((r) => r.map((x) => x.createdAt))
        ),
        buildRollingStat(
            { ...applicationFilter, status: "HIRED" },
            (where) => db.jobApplication.count({ where }),
            (where) => db.jobApplication.findMany({ where, select: { createdAt: true } }).then((r) => r.map((x) => x.createdAt))
        ),
    ]);

    return { postedJobs, applicants, interviews, hiredCandidates };
};

const organizationStats = async (companyId: number | null): Promise<DashboardStatsMap> => {
    if (!companyId) {
        return {};
    }

    const jobFilter = { companyId };
    const applicationFilter = { job: { companyId } };

    const [employees, jobs, applicants, hiredCandidates] = await Promise.all([
        buildRollingStat(
            { companyId, status: "ACCEPTED" },
            (where) => db.companyEmployee.count({ where }),
            (where) => db.companyEmployee.findMany({ where, select: { createdAt: true } }).then((r) => r.map((x) => x.createdAt))
        ),
        buildRollingStat(
            jobFilter,
            (where) => db.job.count({ where }),
            (where) => db.job.findMany({ where, select: { createdAt: true } }).then((r) => r.map((x) => x.createdAt))
        ),
        buildRollingStat(
            applicationFilter,
            (where) => db.jobApplication.count({ where }),
            (where) => db.jobApplication.findMany({ where, select: { createdAt: true } }).then((r) => r.map((x) => x.createdAt))
        ),
        buildRollingStat(
            { ...applicationFilter, status: "HIRED" },
            (where) => db.jobApplication.count({ where }),
            (where) => db.jobApplication.findMany({ where, select: { createdAt: true } }).then((r) => r.map((x) => x.createdAt))
        ),
    ]);

    return { employees, jobs, applicants, hiredCandidates };
};

// status breakdown pie/bar — application statuses scoped to whichever filter applies to this viewer
const getStatusChart = async (where: Record<string, unknown>) => {
    const grouped = await db.jobApplication.groupBy({
        by: ["status"],
        where,
        _count: true,
    });

    const STATUS_COLORS: Record<string, string> = {
        APPLIED: "#94a3b8",
        VIEWED: "#38bdf8",
        UNDER_REVIEW: "#fbbf24",
        SHORTLISTED: "#a78bfa",
        INTERVIEW_SCHEDULED: "#60a5fa",
        INTERVIEWED: "#818cf8",
        HIRED: "#34d399",
        REJECTED: "#f87171",
        WITHDRAWN: "#cbd5e1",
    };

    const data = grouped.map((g) => ({
        label: g.status.replace(/_/g, " "),
        value: g._count,
        color: STATUS_COLORS[g.status] ?? "#94a3b8",
    }));

    return {
        title: "Application Status",
        total: data.reduce((sum, d) => sum + d.value, 0),
        data,
    };
};

const getActivityChart = async (where: Record<string, unknown>) => {
    const start = new Date(Date.now() - ACTIVITY_WINDOW_DAYS * 24 * 60 * 60 * 1000);
    const rows = await db.jobApplication.findMany({
        where: { ...where, createdAt: { gte: start } },
        select: { createdAt: true },
    });

    const bucketed = bucketTimestampsByDay(
        rows.map((r) => r.createdAt),
        start,
        new Date()
    );

    return {
        title: "Activity (last 14 days)",
        data: bucketed.map((b) => ({ name: b.label.slice(5), value: b.value })),
    };
};

export const getDashboardOverview = async (userId: number, role: Role): Promise<DashboardOverviewData> => {
    const companyId = await resolveCompanyId(userId, role);

    const chartFilter =
        role === "CANDIDATE"
            ? buildOwnApplicationsFilter(userId)
            : role === "RECRUITER"
                ? buildApplicationOwnershipFilter({ userId, role })
                : { job: { companyId: companyId ?? -1 } };

    const [stats, statusChart, activityChart] = await Promise.all([
        role === "CANDIDATE"
            ? candidateStats(userId)
            : role === "RECRUITER"
                ? recruiterStats(userId)
                : organizationStats(companyId),
        getStatusChart(chartFilter),
        getActivityChart(chartFilter),
    ]);

    const [profileViews, recentApplications, profileCompletion] = await Promise.all([
        role === "CANDIDATE"
            ? db.profileView.findMany({
                where: { profileUserId: userId },
                include: { viewer: { select: { id: true, username: true, profileImage: true, profession: true } } },
                orderBy: { createdAt: "desc" },
                take: 5,
            })
            : Promise.resolve(undefined),
        db.jobApplication.findMany({
            where: chartFilter,
            include: {
                user: { select: { id: true, username: true, firstName: true, lastName: true, profileImage: true } },
                job: { select: { id: true, jobTitle: true, company: { select: { id: true, companyName: true } } } },
            },
            orderBy: { createdAt: "desc" },
            take: 5,
        }),
        role === "CANDIDATE" ? computeProfileCompletion(userId) : Promise.resolve(undefined),
    ]);

    const recentActivity = recentApplications.map((app) => ({
        id: app.id,
        title: role === "CANDIDATE" ? `Applied to ${app.job?.jobTitle ?? "a job"}` : `${app.user?.username} applied to ${app.job?.jobTitle ?? "a job"}`,
        type: "application" as const,
        createdAt: app.createdAt,
        href: `/applications/${app.id}`,
    }));

    return {
        stats,
        charts: { statusChart, activityChart },
        profileCompletion,
        profileViews: profileViews as any,
        recentApplications: recentApplications as any,
        recentActivity,
    };
};

const computeProfileCompletion = async (userId: number) => {
    const user = await db.user.findUnique({
        where: { id: userId },
        select: {
            userBio: true,
            resume: true,
            skills: true,
            profileImage: true,
            _count: { select: { educations: true, experiences: true, projects: true } },
        },
    });

    if (!user) return undefined;

    const items = [
        { label: "Profile photo", completed: Boolean(user.profileImage) },
        { label: "Bio", completed: Boolean(user.userBio) },
        { label: "Resume uploaded", completed: Boolean(user.resume) },
        { label: "Skills added", completed: user.skills.length > 0 },
        { label: "Education added", completed: user._count.educations > 0 },
        { label: "Experience added", completed: user._count.experiences > 0 },
        { label: "Projects added", completed: user._count.projects > 0 },
    ];

    const percentage = Math.round((items.filter((i) => i.completed).length / items.length) * 100);

    return { percentage, items };
};