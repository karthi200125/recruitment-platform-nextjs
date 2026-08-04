"use server";

import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/authentication/authOptions";
import { db } from "@/lib/db";

import type { InviteRecruiterInput, InviteRecruiterResponse } from "@/types/company-employee";
import { CompanyEmployeeRole, CompanyEmployeeStatus, Role } from "@prisma/client";

export async function inviteRecruiter({
    recruiterId,
}: InviteRecruiterInput): Promise<InviteRecruiterResponse> {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return {
                success: false,
                message: "Unauthorized.",
            };
        }

        const userId = session.user.id;

        const company = await db.company.findUnique({
            where: {
                userId,
            },
            select: {
                id: true,
            },
        });

        if (!company) {
            return {
                success: false,
                message: "Company not found.",
            };
        }
        
        const recruiter = await db.user.findUnique({
            where: {
                id: recruiterId,
            },
            select: {
                id: true,
                role: true,
            },
        });

        if (!recruiter || recruiter.role !== Role.RECRUITER) {
            return {
                success: false,
                message: "Recruiter not found.",
            };
        }
        
        const existing = await db.companyEmployee.findFirst({
            where: {
                userId: recruiterId,
                status: {
                    in: [
                        CompanyEmployeeStatus.PENDING,
                        CompanyEmployeeStatus.ACCEPTED,
                    ],
                },
            },
            select: {
                id: true,
            },
        });

        if (existing) {
            return {
                success: false,
                message:
                    "Recruiter already belongs to a company or has a pending invitation.",
            };
        }
        
        await db.companyEmployee.create({
            data: {
                companyId: company.id,
                userId: recruiterId,
                invitedById: userId,
                role: CompanyEmployeeRole.RECRUITER,
                status: CompanyEmployeeStatus.PENDING,
            },
        });

        return {
            success: true,
            message: "Invitation sent successfully.",
        };
    } catch (error) {
        console.error("[INVITE_RECRUITER]", error);

        return {
            success: false,
            message: "Something went wrong.",
        };
    }
}