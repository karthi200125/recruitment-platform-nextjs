'use server';

import { Prisma } from "@prisma/client";
import * as z from "zod";

import { UserEducationSchema } from "@/lib/SchemaTypes";
import { db } from "@/lib/db";

type UserEducationActionResult =
    | {
        success: string;
        data: Prisma.EducationGetPayload<{}>;
    }
    | {
        error: string;
        issues?: z.ZodIssue[];
    };

export const userEducationAction = async (
    values: z.infer<typeof UserEducationSchema>,
    userId: number,
    isEdit = false,
    eduId?: number
): Promise<UserEducationActionResult> => {
    try {
        const validatedFields = UserEducationSchema.safeParse(values);

        if (!validatedFields.success) {
            return {
                error: "Invalid fields",
                issues: validatedFields.error.issues,
            };
        }

        if (isEdit && !eduId) {
            return {
                error: "Education ID is required.",
            };
        }

        const data = validatedFields.data;

        const education = isEdit
            ? await db.education.update({
                where: {
                    id: eduId,
                },
                data: {
                    ...data,
                    userId,
                },
            })
            : await db.education.create({
                data: {
                    ...data,
                    userId,
                },
            });

        return {
            success: isEdit
                ? "User Education Edited Successfully"
                : "User Education Created Successfully",
            data: education,
        };
    } catch (error) {
        console.error("[USER_EDUCATION_ACTION]", error);

        return {
            error: isEdit
                ? "User Education Edited failed"
                : "User Education Created failed",
        };
    }
};