'use server';

import { Prisma } from "@prisma/client";
import * as z from "zod";

import { db } from "@/lib/db";
import { UserProjectSchema } from "@/lib/SchemaTypes";

type UserProjectActionResult =
    | {
        success: string;
        data: Prisma.ProjectGetPayload<{}>;
    }
    | {
        error: string;
        issues?: z.ZodIssue[];
    };

export const userProjectAction = async (
    values: z.infer<typeof UserProjectSchema>,
    userId: number,
    proImage: string,
    isEdit = false,
    proId?: number
): Promise<UserProjectActionResult> => {
    try {
        const validatedFields = UserProjectSchema.safeParse(values);

        if (!validatedFields.success) {
            return {
                error: "Invalid fields",
                issues: validatedFields.error.issues,
            };
        }

        if (isEdit && !proId) {
            return {
                error: "Project ID is required.",
            };
        }

        const data = validatedFields.data;

        const project = isEdit
            ? await db.project.update({
                where: {
                    id: proId,
                },
                data: {
                    ...data,
                    userId,
                    proImage,
                },
            })
            : await db.project.create({
                data: {
                    ...data,
                    userId,
                    proImage,
                },
            });

        return {
            success: isEdit
                ? `${project.proName} has been edited successfully.`
                : `${project.proName} has been created successfully.`,
            data: project,
        };
    } catch (error) {
        console.error("[USER_PROJECT_ACTION]", error);

        return {
            error: "User project processing failed.",
        };
    }
};