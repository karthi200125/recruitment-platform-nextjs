"use server";

import { db } from "@/lib/db";

export const getAllUsers = async () => {
    try {
        const users: any = await db.user.findMany();
        return users;
    } catch (error) {
        console.error("Error fetching users:", error);
        throw new Error("Failed to fetch users");
    }
};
