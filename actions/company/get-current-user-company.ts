"use server";

import { cache } from "react";
import { CompanyEmployeeStatus } from "@prisma/client";

import { db } from "@/lib/db";
import type { Company } from "@/types";

export const getCurrentUserCompany = cache(
    async (
        userId: number
    ): Promise<Company | null> => {
        try {
            const ownedCompany =
                await db.company.findUnique({
                    where: {
                        userId,
                    },
                });

            if (ownedCompany) {
                return ownedCompany;
            }

            const membership =
                await db.companyEmployee.findFirst({
                    where: {
                        userId,
                        status:
                            CompanyEmployeeStatus.ACCEPTED,
                    },

                    include: {
                        company: true,
                    },
                });

            return membership?.company ?? null;
        } catch (error) {
            console.error(
                "[GET_CURRENT_USER_COMPANY]",
                error
            );

            return null;
        }
    }
);