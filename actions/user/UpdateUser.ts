"use server";

import { db } from "@/lib/db";
import { UserInfoSchema } from "@/lib/SchemaTypes";
import { Prisma } from "@prisma/client";
import * as z from "zod";

interface ActionResponse<T = unknown> {
    success?: string;
    error?: string;
    data?: T;
}

export const UserUpdate = async (
    values: z.infer<typeof UserInfoSchema>,
    id: number,
    userAbout?: string
): Promise<ActionResponse> => {
    try {
        // ✅ validate ID
        if (!Number.isInteger(id) || id <= 0) {
            return { error: "Invalid user ID" };
        }

        // ✅ validate form
        const parsed = UserInfoSchema.safeParse(values);
        if (!parsed.success) {
            return { error: "Invalid form fields" };
        }

        const data = parsed.data;

        /* ────────────────────────────────────────────────
           HANDLE COMPANY VERIFICATION (RECRUITER)
        ──────────────────────────────────────────────── */
        if (data.currentCompany) {
            const company = await db.company.findUnique({
                where: { companyName: data.currentCompany },
                select: { userId: true },
            });

            if (company?.userId) {
                const existingUser = await db.user.findUnique({
                    where: { id: company.userId },
                    select: { employees: true },
                });

                if (
                    existingUser &&
                    !existingUser.employees?.includes(id)
                ) {
                    await db.user.update({
                        where: { id: company.userId },
                        data: {
                            verifyEmps: { push: id },
                        },
                    });
                }
            }
        }

        /* ────────────────────────────────────────────────
           UPDATE USER
        ──────────────────────────────────────────────── */
        const updatedUser = await db.user.update({
            where: { id },
            data: {
                ...data,
                userAbout:
                    userAbout !== undefined
                        ? userAbout
                        : Prisma.JsonNull,
            },
        });

        return {
            success: "User updated successfully",
            data: updatedUser,
        };
    } catch (error) {
        console.error("[UserUpdate]", error);
        return { error: "User update failed" };
    }
};