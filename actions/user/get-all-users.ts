"use server";

import { Prisma } from "@prisma/client";

import { db } from "@/lib/db";

type GetAllUsersResult = Prisma.UserGetPayload<{}>[];

export const getAllUsers = async (): Promise<GetAllUsersResult> => {
    try {
        return await db.user.findMany();
    } catch (error) {
        console.error("[GET_ALL_USERS]", error);

        throw new Error("Failed to fetch users");
    }
};