'use server';

import { db } from "@/lib/db";

export const getCompanyVerifyEmployees = async (ids: number[]) => {
    try {
        const verifyEmployees:any = await db.user.findMany({
            where: {
                id: {
                    in: ids,
                },
            },
        });

        return verifyEmployees;
    } catch (err) {
        return { error: "Failed to fetch company verify employees", details: err };
    }
};
