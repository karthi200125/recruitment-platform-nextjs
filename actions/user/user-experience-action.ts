'use server';

import { Prisma } from "@prisma/client";
import * as z from "zod";

import { UserExperienceSchema } from "@/lib/SchemaTypes";
import { db } from "@/lib/db";

type UserExperienceActionResult =
    | {
        success: string;
        data: Prisma.ExperienceGetPayload<{}>;
    }
    | {
        error: string;
        issues?: z.ZodIssue[];
    };

export const userExperienceAction = async (
    values: z.infer<typeof UserExperienceSchema>,
    userId: number,
    isEdit = false,
    expId?: number
): Promise<UserExperienceActionResult> => {
    try {
        const validatedFields = UserExperienceSchema.safeParse(values);

        if (!validatedFields.success) {
            return {
                error: "Invalid fields",
                issues: validatedFields.error.issues,
            };
        }

        if (isEdit && !expId) {
            return {
                error: "Experience ID is required.",
            };
        }

        const data = validatedFields.data;

        const experience = isEdit
            ? await db.experience.update({
                where: {
                    id: expId,
                },
                data: {
                    ...data,
                    userId,
                },
            })
            : await db.experience.create({
                data: {
                    ...data,
                    userId,
                },
            });

        return {
            success: isEdit
                ? "User Experience Edited Successfully"
                : "User Experience Created Successfully",
            data: experience,
        };
    } catch (error) {
        console.error("[USER_EXPERIENCE_ACTION]", error);

        return {
            error: isEdit
                ? "User Experience Edited failed"
                : "User Experience Created failed",
        };
    }
};