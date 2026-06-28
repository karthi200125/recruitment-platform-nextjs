'use server';

import { Prisma } from "@prisma/client";

import { db } from "@/lib/db";

type GetUserProjectsResult =
    | {
        success: string;
        data: Prisma.ProjectGetPayload<{}>[];
    }
    | {
        error: string;
    };

export const getUserProjects = async (
    userId: number
): Promise<GetUserProjectsResult> => {
    try {
        const projects = await db.project.findMany({
            where: {
                userId,
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return {
            success: "",
            data: projects,
        };
    } catch (error) {
        console.error("[GET_USER_PROJECTS]", error);

        return {
            error: "Get user projects failed.",
        };
    }
};