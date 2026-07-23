"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth/authOptions";
import { db } from "@/lib/db";
import { isAdmin } from "@/lib/admin";

interface ApproveCompanyResponse {
    success: boolean;
    message: string;
}

export const approveCompany = async (
    companyId: number
): Promise<ApproveCompanyResponse> => {
    try {
        const session = await getServerSession(authOptions);

        if (!isAdmin(session?.user?.email)) {
            return {
                success: false,
                message: "Unauthorized.",
            };
        }

        const company = await db.company.findUnique({
            where: {
                id: companyId,
            },
            select: {
                id: true,
                companyIsVerified: true,
            },
        });

        if (!company) {
            return {
                success: false,
                message: "Company not found.",
            };
        }

        if (company.companyIsVerified) {
            return {
                success: false,
                message: "Company has already been approved.",
            };
        }

        await db.company.update({
            where: {
                id: companyId,
            },
            data: {
                companyIsVerified: true,
                // companyVerifiedAt: new Date(), // Uncomment if you add this field later.
            },
        });

        revalidatePath("/admin");
        revalidatePath("/companies");
        revalidatePath("/jobs");

        return {
            success: true,
            message: "Company approved successfully.",
        };
    } catch (error) {
        console.error("[APPROVE_COMPANY]", error);

        return {
            success: false,
            message: "Something went wrong. Please try again.",
        };
    }
};