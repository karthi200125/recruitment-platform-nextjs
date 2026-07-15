"use server";

import { Role } from "@prisma/client";

import { db } from "@/lib/db";
import { DashboardTab, DashboardPagination as PaginatedResult } from "@/types/dashboard";
import { JobApplicationWithUser, JobWithCompany, User } from "@/types";

import { getApplicationsPage } from "./queries/applicationsQuery";
import { getJobsPage, getSavedJobsPage } from "./queries/jobsQuery";
import { getFollowUsersPage, getEmployeesPage } from "./queries/usersQuery";
import { parseTableParams } from "./utils/parseTableParams";
import { buildApplicationOwnershipFilter, buildJobOwnershipFilter, buildOwnApplicationsFilter } from "./utils/buildOwnershipFilter";

type AnyTableData = JobApplicationWithUser | JobWithCompany | User;

interface GetDashboardTableArgs {
    userId: number;
    role: Role;
    tab: DashboardTab;
    pageParamKey: string;
    searchParams: Record<string, string | string[] | undefined>;
}

// resolves the company for ORGANIZATION role once — several tabs need companyId
const resolveCompanyId = async (userId: number, role: Role): Promise<number | null> => {
    if (role !== "ORGANIZATION") return null;
    const company = await db.company.findUnique({ where: { userId }, select: { id: true } });
    return company?.id ?? null;
};

// only fetches the ONE table the active tab needs — never builds all tabs' data at once
export const getDashboardTable = async ({
    userId,
    role,
    tab,
    pageParamKey,
    searchParams,
}: GetDashboardTableArgs): Promise<PaginatedResult<AnyTableData> | null> => {
    const params = parseTableParams(searchParams, pageParamKey);
    const companyId = await resolveCompanyId(userId, role);

    switch (tab) {
        case "applied":
            return getApplicationsPage({ baseWhere: buildOwnApplicationsFilter(userId), params });

        case "interviews":
            return getApplicationsPage({
                baseWhere: { ...buildOwnApplicationsFilter(userId), status: { in: ["INTERVIEW_SCHEDULED", "INTERVIEWED"] } },
                params,
            });

        case "saved":
            return getSavedJobsPage({ userId, params });

        case "followers":
            return getFollowUsersPage({ userId, direction: "followers", params });

        case "following":
            return getFollowUsersPage({ userId, direction: "following", params });

        case "postedJobs":
        case "jobs":
            return getJobsPage({ baseWhere: buildJobOwnershipFilter({ userId, role, companyId }), params });

        case "applicants":
            return getApplicationsPage({ baseWhere: buildApplicationOwnershipFilter({ userId, role, companyId }), params });

        case "hired":
            return getApplicationsPage({
                baseWhere: { ...buildApplicationOwnershipFilter({ userId, role, companyId }), status: "HIRED" },
                params,
            });

        case "employees":
            if (!companyId) return null;
            return getEmployeesPage({ companyId, params });

        default:
            return null;
    }
};