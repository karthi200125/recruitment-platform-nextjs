"use server";

import { unstable_cache } from "next/cache";
import { subDays } from "date-fns";
import { db } from "@/lib/db";
import { calculateGrowth } from "./calculate-growth";

interface Props {
    companyId: number;
    jobsPage?: number;
    applicantsPage?: number;
    hiredPage?: number;
    limit?: number;
}

export const getOrganizationDashboardData = ({
    companyId,
    jobsPage = 1,
    applicantsPage = 1,
    hiredPage = 1,
    limit = 10,
}: Props) =>    
    unstable_cache(
        async () => {
            const now = new Date();
            const current30 = subDays(now, 30);
            const previous30 = subDays(now, 60);
            const jobsSkip = (jobsPage - 1) * limit;
            const applicantsSkip = (applicantsPage - 1) * limit;
            const hiredSkip = (hiredPage - 1) * limit;
            
            const [
                currentJobsCount, previousJobsCount,
                currentApplicantsCount, previousApplicantsCount,
                currentActiveJobsCount, previousActiveJobsCount,
                currentHiredCount, previousHiredCount,
                allTimeJobsCount, allTimeApplicantsCount, allTimeHiredCount,
                jobs, jobsTotal,
                applicants, applicantsTotal,
                hiredCandidates, hiredCandidatesTotal,
            ] = await Promise.all([
                db.job.count({ where: { companyId, createdAt: { gte: current30 } } }),
                db.job.count({ where: { companyId, createdAt: { gte: previous30, lt: current30 } } }),

                db.jobApplication.count({ where: { job: { companyId }, createdAt: { gte: current30 } } }),
                db.jobApplication.count({ where: { job: { companyId }, createdAt: { gte: previous30, lt: current30 } } }),

                // Active jobs replaces the broken "recruiters" query.
                db.job.count({ where: { companyId, status: "ACTIVE", createdAt: { gte: current30 } } }),
                db.job.count({ where: { companyId, status: "ACTIVE", createdAt: { gte: previous30, lt: current30 } } }),

                db.jobApplication.count({ where: { job: { companyId }, status: "HIRED", createdAt: { gte: current30 } } }),
                db.jobApplication.count({ where: { job: { companyId }, status: "HIRED", createdAt: { gte: previous30, lt: current30 } } }),

                // ── All-time totals (shown alongside period growth on KPI cards) ──
                db.job.count({ where: { companyId } }),
                db.jobApplication.count({ where: { job: { companyId } } }),
                db.jobApplication.count({ where: { job: { companyId }, status: "HIRED" } }),

                // ── Paginated table data ──────────────────────────────────────────
                db.job.findMany({
                    where: { companyId },
                    include: { company: true, _count: { select: { jobApplications: true } } },
                    orderBy: { createdAt: "desc" },
                    skip: jobsSkip,
                    take: limit,
                }),
                db.job.count({ where: { companyId } }),

                db.jobApplication.findMany({
                    where: { job: { companyId } },
                    include: { user: true, job: true },
                    orderBy: { createdAt: "desc" },
                    skip: applicantsSkip,
                    take: limit,
                }),
                db.jobApplication.count({ where: { job: { companyId } } }),

                db.jobApplication.findMany({
                    where: { job: { companyId }, status: "HIRED" },
                    include: { user: true, job: true },
                    orderBy: { updatedAt: "desc" },
                    skip: hiredSkip,
                    take: limit,
                }),
                db.jobApplication.count({ where: { job: { companyId }, status: "HIRED" } }),
            ]);

            const jobsGrowth = calculateGrowth(currentJobsCount, previousJobsCount);
            const applicantsGrowth = calculateGrowth(currentApplicantsCount, previousApplicantsCount);
            const activeJobsGrowth = calculateGrowth(currentActiveJobsCount, previousActiveJobsCount);
            const hiredGrowth = calculateGrowth(currentHiredCount, previousHiredCount);

            return {
                stats: {
                    jobs: {
                        total: allTimeJobsCount,
                        period: currentJobsCount,
                        growth: jobsGrowth.growth,
                        isPositive: jobsGrowth.isPositive,
                    },
                    applicants: {
                        total: allTimeApplicantsCount,
                        period: currentApplicantsCount,
                        growth: applicantsGrowth.growth,
                        isPositive: applicantsGrowth.isPositive,
                    },
                    // "Active jobs" — replaces broken "recruiters" KPI.
                    activeJobs: {
                        total: currentActiveJobsCount,
                        period: currentActiveJobsCount,
                        growth: activeJobsGrowth.growth,
                        isPositive: activeJobsGrowth.isPositive,
                    },
                    hired: {
                        total: allTimeHiredCount,
                        period: currentHiredCount,
                        growth: hiredGrowth.growth,
                        isPositive: hiredGrowth.isPositive,
                    },
                },

                // recentApplicants: last 5 new applicants for the overview panel
                recentApplicants: applicants.slice(0, 5),
                // recentActivity: last 5 hires — more meaningful than duplicating applicants
                recentActivity: hiredCandidates.slice(0, 5),

                jobs: {
                    data: jobs,
                    total: jobsTotal,
                    page: jobsPage,
                    totalPages: Math.ceil(jobsTotal / limit),
                },

                applicants: {
                    data: applicants,
                    total: applicantsTotal,
                    page: applicantsPage,
                    totalPages: Math.ceil(applicantsTotal / limit),
                },

                hiredCandidates: {
                    data: hiredCandidates,
                    total: hiredCandidatesTotal,
                    page: hiredPage,
                    totalPages: Math.ceil(hiredCandidatesTotal / limit),
                },
            };
        },
        [`org-dashboard-${companyId}-j${jobsPage}-a${applicantsPage}-h${hiredPage}`],
        { revalidate: 60, tags: ["organization-dashboard"] },
    )();