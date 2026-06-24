'use server';

import { db } from "@/lib/db";

export const getCompaniesEmployees = async (ids: number[]) => {
    try {
        const employees: any = await db.user.findMany({
            where: {
                id: {
                    in: ids,
                },
            },
        });
        return employees;
    } catch (error) {
        return { error: "Failed to fetch employees" };
    }
};
