import { Prisma } from "@prisma/client";

import { db } from "@/lib/db";
import { DashboardPagination as PaginatedResult } from "@/types/dashboard";
import { JobWithCompany } from "@/types";
import { ParsedTableParams } from "../dashboard/utils/parseTableParams";
import { buildPaginationMeta, getPaginationArgs } from "../dashboard/utils/paginate";

const JOB_INCLUDE = {
    company: { select: { id: true, companyName: true, companyImage: true } },
    _count: { select: { jobApplications: true } },
} satisfies Prisma.JobInclude;

interface GetJobsArgs {
    baseWhere: Prisma.JobWhereInput;
    params: ParsedTableParams;
}

export const getJobsPage = async ({ baseWhere, params }: GetJobsArgs): Promise<PaginatedResult<JobWithCompany>> => {
    const where: Prisma.JobWhereInput = {
        ...baseWhere,
        ...(params.search && {
            OR: [
                { jobTitle: { contains: params.search, mode: "insensitive" } },
                { company: { companyName: { contains: params.search, mode: "insensitive" } } },
            ],
        }),
        ...(params.filters.status && { status: params.filters.status }),
        ...(params.filters.type && { type: params.filters.type }),
    };

    const { skip, take } = getPaginationArgs({ page: params.page, limit: params.limit });

    const [data, total] = await Promise.all([
        db.job.findMany({ where, include: JOB_INCLUDE, orderBy: { createdAt: "desc" }, skip, take }),
        db.job.count({ where }),
    ]);

    return {
        data: data as unknown as JobWithCompany[],
        pagination: buildPaginationMeta(params.page, params.limit, total),
    };
};

interface GetSavedJobsArgs {
    userId: number;
    params: ParsedTableParams;
}

export const getSavedJobsPage = async ({ userId, params }: GetSavedJobsArgs): Promise<PaginatedResult<JobWithCompany>> => {
    const where: Prisma.SavedJobWhereInput = {
        userId,
        ...(params.search && {
            job: {
                OR: [
                    { jobTitle: { contains: params.search, mode: "insensitive" } },
                    { company: { companyName: { contains: params.search, mode: "insensitive" } } },
                ],
            },
        }),
    };

    const { skip, take } = getPaginationArgs({ page: params.page, limit: params.limit });

    const [saved, total] = await Promise.all([
        db.savedJob.findMany({
            where,
            include: { job: { include: JOB_INCLUDE } },
            orderBy: { createdAt: "desc" },
            skip,
            take,
        }),
        db.savedJob.count({ where }),
    ]);

    return {
        data: saved.map((s) => s.job) as unknown as JobWithCompany[],
        pagination: buildPaginationMeta(params.page, params.limit, total),
    };
};