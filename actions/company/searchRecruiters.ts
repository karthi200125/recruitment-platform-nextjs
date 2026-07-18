"use server";

import { Role, CompanyEmployeeStatus } from "@prisma/client";

import { db } from "@/lib/db";
import { RecruiterSearchResult } from "@/types/company-employee";

export async function searchRecruiters(
    search: string
): Promise<RecruiterSearchResult[]> {
    const keyword = search.trim();

    if (keyword.length < 2) {
        return [];
    }

    const recruiters = await db.user.findMany({
        where: {
            role: Role.RECRUITER,

            OR: [
                {
                    username: {
                        contains: keyword,
                        mode: "insensitive",
                    },
                },
                {
                    email: {
                        contains: keyword,
                        mode: "insensitive",
                    },
                },
                {
                    firstName: {
                        contains: keyword,
                        mode: "insensitive",
                    },
                },
                {
                    lastName: {
                        contains: keyword,
                        mode: "insensitive",
                    },
                },
            ],

            companyMemberships: {
                none: {
                    status: CompanyEmployeeStatus.ACCEPTED,
                },
            },
        },

        select: {
            id: true,
            username: true,
            email: true,
            firstName: true,
            lastName: true,
            profession: true,
            profileImage: true,
        },

        orderBy: [
            {
                firstName: "asc",
            },
            {
                username: "asc",
            },
        ],

        take: 10,
    });

    return recruiters;
}