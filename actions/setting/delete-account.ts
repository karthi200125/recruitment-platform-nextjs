"use server";

import * as z from "zod";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth/authOptions";
import { db } from "@/lib/db";
import { DeleteAccountSchema } from "@/lib/SchemaTypes";
import { ActionResponse } from "@/types/settings";


export const deleteAccount = async (
    values: z.infer<typeof DeleteAccountSchema>
): Promise<ActionResponse> => {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return {
                error: "Unauthorized.",
            };
        }

        const validated = DeleteAccountSchema.safeParse(values);

        if (!validated.success) {
            return {
                error: 'Please type "DELETE ACCOUNT" correctly.',
            };
        }

        const user = await db.user.findUnique({
            where: {
                id: session.user.id,
            },
            select: {
                id: true,
            },
        });

        if (!user) {
            return {
                error: "User not found.",
            };
        }

        await db.user.delete({
            where: {
                id: user.id,
            },
        });

        return {
            success: "Account deleted successfully.",
        };
    } catch (error) {
        console.error("[DELETE_ACCOUNT]", error);

        return {
            error: "Unable to delete your account.",
        };
    }
};

export { DeleteAccountSchema };