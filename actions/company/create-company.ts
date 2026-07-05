"use server";

import { getServerSession } from "next-auth";
import { Prisma } from "@prisma/client";
import * as z from "zod";

import { authOptions } from "@/lib/auth/authOptions";
import { db } from "@/lib/db";
import { CompanySchema } from "@/lib/SchemaTypes";

type CreateCompanyActionResult =
    | { success: string; data: Prisma.CompanyGetPayload<Record<string, never>> }
    | { error: string; issues?: z.ZodIssue[] };

export async function createCompanyAction(
    values: z.infer<typeof CompanySchema>,
    companyImage: string,
    companyImagePublicId: string,
    isEdit = false,
    companyId?: number
): Promise<CreateCompanyActionResult> {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return { error: "Unauthorized." };
        }

        if (session.user.role !== "ORGANIZATION") {
            return { error: "Only organizations can manage companies." };
        }

        const validatedFields = CompanySchema.safeParse(values);

        if (!validatedFields.success) {
            return {
                error: "Invalid fields.",
                issues: validatedFields.error.issues,
            };
        }

        const data = validatedFields.data;

        const imageFields =
            companyImage
                ? { companyImage, companyImagePublicId }
                : {};

        if (isEdit) {
            if (!companyId) {
                return { error: "Company ID is required." };
            }

            const existingCompany = await db.company.findUnique({
                where: { id: companyId },
                select: { id: true, userId: true },
            });

            if (!existingCompany) {
                return { error: "Company not found." };
            }

            if (existingCompany.userId !== session.user.id) {
                return { error: "Unauthorized." };
            }

            const updatedCompany = await db.company.update({
                where: { id: companyId },
                data: { ...data, ...imageFields },
            });

            return {
                success: "Company updated successfully.",
                data: updatedCompany,
            };
        }

        const userCompany = await db.company.findFirst({
            where: { userId: session.user.id },
            select: { id: true },
        });

        if (userCompany) {
            return {
                error:
                    "You already have a company. Edit your existing company from your profile.",
            };
        }

        const nameConflict = await db.company.findFirst({
            where: { companyName: data.companyName },
            select: { id: true },
        });

        if (nameConflict) {
            return {
                error:
                    "A company with this name already exists. Please choose a different name.",
            };
        }

        const company = await db.company.create({
            data: {
                ...data,
                ...imageFields,
                userId: session.user.id,
            },
        });

        return {
            success: "Company created successfully.",
            data: company,
        };
    } catch (error) {
        console.error("[CREATE_COMPANY_ACTION]", error);
        return { error: "Failed to process company. Please try again." };
    }
}