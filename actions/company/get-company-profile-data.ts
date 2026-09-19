"use server";

import { cache } from "react";
import { db } from "@/lib/db";

export const getCompanyProfileData = cache(
    async (userId: number) => {
        return db.user.findUnique({
            where: {
                id: userId,
                role: "ORGANIZATION",
            },

            select: {
                company: {
                    select: {
                        id: true,
                        companyName: true,
                        companyImage: true,
                        companyAbout: true,
                        companyTotalEmployees: true,
                        companyIsVerified: true,

                        jobs: {
                            orderBy: {
                                createdAt: "desc",
                            },

                            take: 6,

                            select: {
                                id: true,
                                jobTitle: true,
                                jobDesc: true,
                                city: true,
                                state: true,
                                country: true,
                                type: true,
                                mode: true,
                                experience: true,
                                skills: true,
                                isEasyApply: true,
                                applyLink: true,
                                createdAt: true,
                            },
                        },

                        employees: {
                            where: {
                                status: "ACCEPTED",
                            },

                            select: {
                                id: true,
                                user: {
                                    select: {
                                        id: true,
                                        username: true,
                                        userImage: true,
                                        profileImage: true,
                                        firstName: true,
                                        lastName: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });
    }
);