'use server';

import { db } from "@/lib/db";

export const getWhoViewedYourProfile = async (ids: number[]) => {
    try {
        const users: any = await db.user.findMany({
            where: {
                id: {
                    in: ids
                }
            },
        });
        return users;
    } catch (error) {
        console.error("Error fetching profile viewers:", error);
        return { error: "Failed to fetch profile viewers" };
    }
};
