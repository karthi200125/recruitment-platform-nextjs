"use server";

import { getServerSession } from "next-auth";
import { CompanyEmployeeStatus } from "@prisma/client";

import { authOptions } from "@/lib/authentication/authOptions";
import { db } from "@/lib/db";

export async function rejectCompanyInvitation(
    invitationId: number
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return {
                success: false,
                message: "Unauthorized.",
            };
        }

        const userId = Number(session.user.id);

        const invitation =
            await db.companyEmployee.findFirst({
                where: {
                    id: invitationId,
                    userId,
                    status:
                        CompanyEmployeeStatus.PENDING,
                },

                select: {
                    id: true,
                },
            });

        if (!invitation) {
            return {
                success: false,
                message:
                    "Invitation not found.",
            };
        }

        await db.companyEmployee.update({
            where: {
                id: invitation.id,
            },

            data: {
                status:
                    CompanyEmployeeStatus.REJECTED,
            },
        });

        return {
            success: true,
            message:
                "Invitation declined.",
        };
    } catch (error) {
        console.error(
            "[REJECT_COMPANY_INVITATION]",
            error
        );

        return {
            success: false,
            message:
                "Something went wrong.",
        };
    }
}