import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { cache } from "react";

interface GetFilteredJobsParams {
    userId?: number;
    page?: number;
    q?: string;
    easyApply?: string;
    dateposted?: string;
    experiencelevel?: string;
    type?: string;
    location?: string;
    company?: string;
}

export type JobWithCompany = Prisma.JobGetPayload<{
    include: {
        company: {
            select: {
                id: true;
                companyName: true;
                companyImage: true;
            };
        };
        _count: {
            select: {
                jobApplications: true;
            };
        };
    };
}>;

const ITEM_PER_PAGE = 10;

export const getFilteredJobs = cache(
    async (
        params: GetFilteredJobsParams
    ): Promise<{
        jobs: JobWithCompany[];
        count: number;
    }> => {
        const {
            userId,
            page = 1,
            q,
            easyApply,
            dateposted,
            experiencelevel,
            type,
            location,
            company,
        } = params;


        const currentPage = Math.max(1, page);

        try {

            const where: Prisma.JobWhereInput = {};


            if (q) {
                where.jobTitle = {
                    contains: q,
                    mode: "insensitive",
                };
            }


            if (easyApply === "true") {
                where.isEasyApply = true;
            }


            if (company) {
                where.company = {
                    companyName: {
                        contains: company,
                        mode: "insensitive",
                    },
                };
            }


            if (dateposted) {
                const now = new Date();

                const dateMap: Record<string, number> = {
                    "Past 24 hours": 1,
                    "Past 3 days": 3,
                    "Past Week": 7,
                    "Past Month": 30,
                };

                const days = dateMap[dateposted];

                if (days) {
                    where.createdAt = {
                        gte: new Date(now.getTime() - days * 86400000),
                    };
                }
            }



            if (type) {
                where.mode = type;
            }


            if (experiencelevel) {
                where.experience = experiencelevel;
            }

            if (location) {
                where.OR = [
                    { city: { contains: location, mode: "insensitive" } },
                    { state: { contains: location, mode: "insensitive" } },
                    { country: { contains: location, mode: "insensitive" } },
                ];
            }


            if (userId !== undefined) {
                where.NOT = [
                    { userId },
                    {
                        company: {
                            userId,
                        },
                    },
                    {
                        jobApplications: {
                            some: { userId },
                        },
                    },
                ];
            }


            const totalCount = await db.job.count({ where });


            const jobs = await db.job.findMany({
                where,
                orderBy: {
                    createdAt: "desc",
                },
                take: ITEM_PER_PAGE,
                skip: (currentPage - 1) * ITEM_PER_PAGE,

                include: {
                    company: {
                        select: {
                            id: true,
                            companyName: true,
                            companyImage: true,
                        },
                    },
                    _count: {
                        select: {
                            jobApplications: true,
                        },
                    },
                },
            });

            return {
                jobs,
                count: totalCount,
            };
        } catch (error) {
            console.error("❌ getFilteredJobs error:", error);
            throw new Error("Failed to fetch jobs");
        }
    }
);