import { ApplicationStatus, Prisma } from "@prisma/client";

import { db } from "@/lib/db";
import { DashboardPagination as PaginatedResult } from "@/types/dashboard";
import { JobApplicationWithUser } from "@/types";
import { getPaginationArgs, buildPaginationMeta } from "../utils/paginate";
import { ParsedTableParams } from "../utils/parseTableParams";

const APPLICATION_INCLUDE = {
    user: { select: { id: true, username: true, firstName: true, lastName: true, profileImage: true } },
    job: { select: { id: true, jobTitle: true, company: { select: { id: true, companyName: true } } } },
} satisfies Prisma.JobApplicationInclude;

interface GetApplicationsArgs {
    baseWhere: Prisma.JobApplicationWhereInput;
    params: ParsedTableParams;
}

// search matches candidate email or job title; "status" filter maps directly
// to ApplicationStatus if present in params.filters
export const getApplicationsPage = async ({
    baseWhere,
    params,
}: GetApplicationsArgs): Promise<PaginatedResult<JobApplicationWithUser>> => {
    const where: Prisma.JobApplicationWhereInput = {
        ...baseWhere,
        ...(params.search && {
            OR: [
                { candidateEmail: { contains: params.search, mode: "insensitive" } },
                { job: { jobTitle: { contains: params.search, mode: "insensitive" } } },
            ],
        }),
        ...(params.filters.status && { status: params.filters.status as ApplicationStatus }),
    };

    const { skip, take } = getPaginationArgs({ page: params.page, limit: params.limit });

    const [data, total] = await Promise.all([
        db.jobApplication.findMany({
            where,
            include: APPLICATION_INCLUDE,
            orderBy: { createdAt: "desc" },
            skip,
            take,
        }),
        db.jobApplication.count({ where }),
    ]);

    return {
        data: data as unknown as JobApplicationWithUser[],
        pagination: buildPaginationMeta(params.page, params.limit, total),
    };
};