"use server";

import { CompanyEmployeeStatus } from "@prisma/client";
import { db } from "@/lib/db";

export async function getAcceptedCompanyMembership(
    userId: number
) {
    return db.companyEmployee.findFirst({
        where: {
            userId,
            status: CompanyEmployeeStatus.ACCEPTED,
        },

        select: {
            id: true,
            role: true,

            company: {
                select: {
                    id: true,
                    companyName: true,
                    companyImage: true,
                    companyIsVerified: true,
                },
            },
        },
    });
}