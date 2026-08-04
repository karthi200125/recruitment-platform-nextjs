"use server";

import { getServerSession } from "next-auth";
import { CompanyEmployeeStatus } from "@prisma/client";

import { authOptions } from "@/lib/authentication/authOptions";
import { db } from "@/lib/db";

export async function getPendingCompanyInvitation() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return null;
    }

    const userId = Number(session.user.id);

    const invitation =
        await db.companyEmployee.findFirst({
            where: {
                userId,
                status:
                    CompanyEmployeeStatus.PENDING,
            },

            select: {
                id: true,
                role: true,
                status: true,
                createdAt: true,
                company: {
                    select: {
                        id: true,
                        companyName: true,
                        companyImage: true,
                        companyIsVerified: true,
                    },
                },

                invitedBy: {
                    select: {
                        id: true,
                        username: true,
                        firstName: true,
                        lastName: true,
                        profileImage: true,
                    },
                },
            },
        });

    return invitation;
}