"use server";

import { cache } from "react";
import { db } from "@/lib/db";
import { Company } from "@/types";

export const getUserCompany = cache(
    async (userId: number): Promise<Company | null> => {
        try {
            return await db.company.findFirst({
                where: {
                    userId,
                },
            });
        } catch (error) {
            console.error("[GET_USER_COMPANY]", error);
            return null;
        }
    }
);