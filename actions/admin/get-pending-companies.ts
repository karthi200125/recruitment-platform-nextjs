"use server";

import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/authentication/authOptions";
import { ADMIN_EMAIL } from "@/lib/admin";
import { db } from "@/lib/db";

export const getPendingCompanies = async () => {
    try {
        const session = await getServerSession(authOptions);

        if (
            !session?.user?.email ||
            session.user.email.toLowerCase() !== ADMIN_EMAIL.toLowerCase()
        ) {
            return [];
        }

        const companies = await db.company.findMany({
            where: {
                companyIsVerified: false,
            },
            orderBy: {
                createdAt: "desc",
            },
            select: {
                id: true,
                companyName: true,
                companyImage: true,
                companyCity: true,
                companyState: true,
                companyCountry: true,
                companyWebsite: true,
                companyTotalEmployees: true,
                createdAt: true,

                user: {
                    select: {
                        id: true,
                        username: true,
                        email: true,
                    },
                },
            },
        });

        return companies;
    } catch (error) {
        console.error("[GET_PENDING_COMPANIES]", error);

        return [];
    }
};