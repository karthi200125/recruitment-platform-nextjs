"use server";

import { Prisma } from "@prisma/client";

import { db } from "@/lib/db";

type GetCompaniesEmployeesResult = Prisma.UserGetPayload<{}>[];

export const getCompaniesEmployees = async (
    ids: number[]
): Promise<GetCompaniesEmployeesResult> => {
    try {
        if (ids.length === 0) {
            return [];
        }

        return await db.user.findMany({
            where: {
                id: {
                    in: ids,
                },
            },
        });
    } catch (error) {
        console.error("[GET_COMPANIES_EMPLOYEES]", error);

        throw new Error("Failed to fetch employees.");
    }
};