'use server';

import { db } from "@/lib/db";

// ✅ Shared type (keep consistent across app)
export interface Company {
    id: number;
    companyName: string;
    companyImage?: string | null;
    companyAbout: string;
    companyTotalEmployees: string;
    userId: number;
}

/**
 * ✅ Get company by companyId
 */
export async function getCompanyById(cId: number): Promise<Company> {
    if (!cId) {
        throw new Error("Company ID is required");
    }

    const company = await db.company.findUnique({
        where: { id: cId },
        select: {
            id: true,
            companyName: true,
            companyImage: true,
            companyAbout: true,
            companyTotalEmployees: true,
            userId: true,
        },
    });

    if (!company) {
        throw new Error("Company not found");
    }

    return company;
}

/**
 * ✅ Get company by userId (company owner)
 */
export async function getCompanyByUserId(userId: number) {
    if (!userId) throw new Error("User ID required");

    return db.company.findFirst({
        where: { userId },
        select: {
            id: true,
            companyName: true,
            companyImage: true,
            companyAbout: true,
            companyTotalEmployees: true,
            userId: true,
        },
    });
}