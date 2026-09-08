"use server";

import { Role } from "@prisma/client";

import { db } from "@/lib/db";
import {
    DashboardOverviewData,
    DashboardStatsMap,
} from "@/types/dashboard";

import { buildActivityChartData } from "./buildActivityChartData";
import { computeProfileCompletion } from "./computeProfileCompletion ";
import { getProfileViews } from "./getProfileviews";
import { getRecentActivities } from "./getRecentActivities";
import { buildRollingStat } from "./queries/statsQuery";
import {
    buildApplicationOwnershipFilter,
    buildJobOwnershipFilter,
    buildOwnApplicationsFilter,
} from "./utils/buildOwnershipFilter";

const ACTIVITY_WINDOW_DAYS = 14;

const resolveCompanyId = async (
    userId: number,
    role: Role
): Promise<number | null> => {
    if (role !== "ORGANIZATION") {
        return null;
    }

    const company = await db.company.findUnique({
        where: { userId },
        select: { id: true },
    });

    return company?.id ?? null;
};

/**
 * Fetch createdAt timestamps only once for each metric.
 *
 * buildRollingStat is responsible for:
 * - current 30-day count
 * - previous 30-day count
 * - growth percentage
 * - daily chart buckets
 */
const candidateStats = async (
    userId: number
): Promise<DashboardStatsMap> => {
    const appliedJobsWhere = {
        userId,
    };

    const savedJobsWhere = {
        userId,
    };

    const interviewsWhere = {
        userId,
        status: {
            in: [
                "INTERVIEW_SCHEDULED",
                "INTERVIEWED",
            ],
        },
    };

    const profileViewsWhere = {
        profileUserId: userId,
    };

    const [
        appliedJobs,
        savedJobs,
        interviews,
        profileViews,
    ] = await Promise.all([
        buildRollingStat(
            appliedJobsWhere,
            (where) =>
                db.jobApplication
                    .findMany({
                        where,
                        select: {
                            createdAt: true,
                        },
                    })
                    .then((rows) =>
                        rows.map(
                            (row) => row.createdAt
                        )
                    )
        ),

        buildRollingStat(
            savedJobsWhere,
            (where) =>
                db.savedJob
                    .findMany({
                        where,
                        select: {
                            createdAt: true,
                        },
                    })
                    .then((rows) =>
                        rows.map(
                            (row) => row.createdAt
                        )
                    )
        ),

        buildRollingStat(
            interviewsWhere,
            (where) =>
                db.jobApplication
                    .findMany({
                        where,
                        select: {
                            createdAt: true,
                        },
                    })
                    .then((rows) =>
                        rows.map(
                            (row) => row.createdAt
                        )
                    )
        ),

        buildRollingStat(
            profileViewsWhere,
            (where) =>
                db.profileView
                    .findMany({
                        where,
                        select: {
                            createdAt: true,
                        },
                    })
                    .then((rows) =>
                        rows.map(
                            (row) => row.createdAt
                        )
                    )
        ),
    ]);

    return {
        appliedJobs,
        savedJobs,
        interviews,
        profileViews,
    };
};

/**
 * Recruiter dashboard statistics.
 */
const recruiterStats = async (
    userId: number
): Promise<DashboardStatsMap> => {
    const jobFilter =
        buildJobOwnershipFilter({
            userId,
            role: "RECRUITER",
        });

    const applicationFilter =
        buildApplicationOwnershipFilter({
            userId,
            role: "RECRUITER",
        });

    const postedJobsWhere = jobFilter;

    const applicantsWhere = applicationFilter;

    const interviewsWhere = {
        ...applicationFilter,
        status: {
            in: [
                "INTERVIEW_SCHEDULED",
                "INTERVIEWED",
            ],
        },
    };

    const hiredCandidatesWhere = {
        ...applicationFilter,
        status: "HIRED",
    };

    const [
        postedJobs,
        applicants,
        interviews,
        hiredCandidates,
    ] = await Promise.all([
        buildRollingStat(
            postedJobsWhere,
            (where) =>
                db.job
                    .findMany({
                        where,
                        select: {
                            createdAt: true,
                        },
                    })
                    .then((rows) =>
                        rows.map(
                            (row) => row.createdAt
                        )
                    )
        ),

        buildRollingStat(
            applicantsWhere,
            (where) =>
                db.jobApplication
                    .findMany({
                        where,
                        select: {
                            createdAt: true,
                        },
                    })
                    .then((rows) =>
                        rows.map(
                            (row) => row.createdAt
                        )
                    )
        ),

        buildRollingStat(
            interviewsWhere,
            (where) =>
                db.jobApplication
                    .findMany({
                        where,
                        select: {
                            createdAt: true,
                        },
                    })
                    .then((rows) =>
                        rows.map(
                            (row) => row.createdAt
                        )
                    )
        ),

        buildRollingStat(
            hiredCandidatesWhere,
            (where) =>
                db.jobApplication
                    .findMany({
                        where,
                        select: {
                            createdAt: true,
                        },
                    })
                    .then((rows) =>
                        rows.map(
                            (row) => row.createdAt
                        )
                    )
        ),
    ]);

    return {
        postedJobs,
        applicants,
        interviews,
        hiredCandidates,
    };
};

/**
 * Organization dashboard statistics.
 */
const organizationStats = async (
    companyId: number | null
): Promise<DashboardStatsMap> => {
    if (!companyId) {
        return {};
    }

    const jobsWhere = {
        companyId,
    };

    const employeesWhere = {
        companyId,
        status: "ACCEPTED",
    };

    const applicantsWhere = {
        job: {
            companyId,
        },
    };

    const hiredCandidatesWhere = {
        job: {
            companyId,
        },
        status: "HIRED",
    };

    const [
        employees,
        jobs,
        applicants,
        hiredCandidates,
    ] = await Promise.all([
        buildRollingStat(
            employeesWhere,
            (where) =>
                db.companyEmployee
                    .findMany({
                        where,
                        select: {
                            createdAt: true,
                        },
                    })
                    .then((rows) =>
                        rows.map(
                            (row) => row.createdAt
                        )
                    )
        ),

        buildRollingStat(
            jobsWhere,
            (where) =>
                db.job
                    .findMany({
                        where,
                        select: {
                            createdAt: true,
                        },
                    })
                    .then((rows) =>
                        rows.map(
                            (row) => row.createdAt
                        )
                    )
        ),

        buildRollingStat(
            applicantsWhere,
            (where) =>
                db.jobApplication
                    .findMany({
                        where,
                        select: {
                            createdAt: true,
                        },
                    })
                    .then((rows) =>
                        rows.map(
                            (row) => row.createdAt
                        )
                    )
        ),

        buildRollingStat(
            hiredCandidatesWhere,
            (where) =>
                db.jobApplication
                    .findMany({
                        where,
                        select: {
                            createdAt: true,
                        },
                    })
                    .then((rows) =>
                        rows.map(
                            (row) => row.createdAt
                        )
                    )
        ),
    ]);

    return {
        employees,
        jobs,
        applicants,
        hiredCandidates,
    };
};

/**
 * Application status breakdown.
 */
const getStatusChart = async (
    where: Record<string, unknown>
) => {
    const grouped =
        await db.jobApplication.groupBy({
            by: ["status"],
            where,
            _count: true,
        });

    const STATUS_COLORS: Record<
        string,
        string
    > = {
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

    const data = grouped.map((group) => ({
        label: group.status.replace(
            /_/g,
            " "
        ),
        value: group._count,
        color:
            STATUS_COLORS[group.status] ??
            "#94a3b8",
    }));

    return {
        title: "Application Status",
        total: data.reduce(
            (sum, item) =>
                sum + item.value,
            0
        ),
        data,
    };
};

/**
 * Main dashboard overview loader.
 *
 * Important:
 * - All independent database operations run in parallel.
 * - No AI work is performed here.
 * - Only overview data is loaded.
 * - Other dashboard tabs should load their own data separately.
 */
export const getDashboardOverview = async (
    userId: number,
    role: Role
): Promise<DashboardOverviewData> => {
    /**
     * Only ORGANIZATION users need a company lookup.
     */
    const companyId =
        role === "ORGANIZATION"
            ? await resolveCompanyId(
                userId,
                role
            )
            : null;

    /**
     * Build the application ownership filter once.
     */
    const chartFilter =
        role === "CANDIDATE"
            ? buildOwnApplicationsFilter(
                userId
            )
            : role === "RECRUITER"
                ? buildApplicationOwnershipFilter(
                    {
                        userId,
                        role,
                    }
                )
                : {
                    job: {
                        companyId:
                            companyId ?? -1,
                    },
                };

    /**
     * Stats and status chart are independent.
     * Run them concurrently.
     */
    const [
        stats,
        statusChart,
    ] = await Promise.all([
        role === "CANDIDATE"
            ? candidateStats(userId)
            : role === "RECRUITER"
                ? recruiterStats(userId)
                : organizationStats(
                    companyId
                ),

        getStatusChart(
            chartFilter
        ),
    ]);

    /**
     * These four operations are also independent.
     * Run all of them concurrently.
     */
    const [
        profileViews,
        recentApplications,
        profileCompletion,
        recentActivity,
    ] = await Promise.all([
        getProfileViews(
            userId,
            role,
            companyId
        ),

        db.jobApplication.findMany({
            where: chartFilter,

            select: {
                id: true,
                status: true,
                createdAt: true,

                user: {
                    select: {
                        id: true,
                        username: true,
                        firstName: true,
                        lastName: true,
                        profileImage: true,
                    },
                },

                job: {
                    select: {
                        id: true,
                        jobTitle: true,

                        company: {
                            select: {
                                id: true,
                                companyName: true,
                                companyImage: true,
                            },
                        },
                    },
                },
            },

            orderBy: {
                createdAt: "desc",
            },

            take: 5,
        }),

        computeProfileCompletion(
            userId,
            role,
            companyId
        ),

        getRecentActivities(
            userId,
            role,
            companyId
        ),
    ]);

    /**
     * Build activity chart from the already
     * fetched recent activity data.
     */
    const activityChart = {
        title: `Activity (last ${ACTIVITY_WINDOW_DAYS} days)`,

        data: buildActivityChartData(
            recentActivity,
            ACTIVITY_WINDOW_DAYS
        ),
    };

    return {
        stats,

        charts: {
            statusChart,
            activityChart,
        },

        profileCompletion,

        profileViews:
            profileViews as any,

        recentApplications:
            recentApplications as any,

        recentActivity,
    };
};