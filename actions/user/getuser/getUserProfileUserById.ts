"use server";

import { db } from "@/lib/db";
import {
    CandidateRecruiterProfile,
    EmployeeUser,
    OrganizationProfile,
    ProfileUser,
} from "@/types/userProfile";

interface ActionResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}

const getCandidateRecruiterProfile = (
    id: number
) =>
    db.user.findUnique({
        where: {
            id,
        },

        include: {
            jobApplications: true,

            postedJobs: true,

            company: {
                include: {
                    jobs: {
                        orderBy: {
                            createdAt: "desc",
                        },
                        take: 6,
                    },
                },
            },

            educations: true,

            experiences: true,

            projects: true,

            followers: {
                select: {
                    id: true,
                    createdAt: true,
                    followerId: true,
                    followingId: true,
                },
            },

            following: {
                select: {
                    id: true,
                    createdAt: true,
                    followerId: true,
                    followingId: true,
                },
            },
        },
    });

const getOrganizationProfile = (
    id: number
) =>
    db.user.findUnique({
        where: {
            id,
        },

        include: {
            company: {
                include: {                    
                    jobs: {
                        orderBy: {
                            createdAt: "desc",
                        },
                        take: 6,
                    },

                    employees: {
                        where: {
                            status: "ACCEPTED",
                        },

                        include: {
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

            followers: {
                select: {
                    id: true,
                    createdAt: true,
                    followerId: true,
                    followingId: true,
                },
            },

            following: {
                select: {
                    id: true,
                    createdAt: true,
                    followerId: true,
                    followingId: true,
                },
            },
        },
    });

export const getUserProfileUserById = async (
    id: number
): Promise<ActionResponse<ProfileUser>> => {
    try {        
        if (
            !Number.isInteger(id) ||
            id <= 0
        ) {
            return {
                success: false,
                error: "Invalid user ID",
            };
        }
        
        const roleCheck =
            await db.user.findUnique({
                where: {
                    id,
                },

                select: {
                    role: true,
                },
            });

        if (!roleCheck) {
            return {
                success: false,
                error: "User not found",
            };
        }
        
        if (
            roleCheck.role ===
            "ORGANIZATION"
        ) {
            const user =
                await getOrganizationProfile(
                    id
                );

            if (!user) {
                return {
                    success: false,
                    error: "User not found",
                };
            }
            
            const employeeUsers: EmployeeUser[] =
                user.company?.employees.map(
                    (employee) =>
                        employee.user
                ) ?? [];
            
            const userAbout =
                typeof user.userAbout ===
                    "string"
                    ? user.userAbout
                    : user.userAbout
                        ? JSON.stringify(
                            user.userAbout
                        )
                        : null;

            const formattedUser: OrganizationProfile =
            {
                ...user,
                userAbout,
                employeeUsers,
            };

            return {
                success: true,
                data: formattedUser,
            };
        }
        
        const user =
            await getCandidateRecruiterProfile(
                id
            );

        if (!user) {
            return {
                success: false,
                error: "User not found",
            };
        }
        
        const userAbout =
            typeof user.userAbout ===
                "string"
                ? user.userAbout
                : user.userAbout
                    ? JSON.stringify(
                        user.userAbout
                    )
                    : null;

        const formattedUser: CandidateRecruiterProfile =
        {
            ...user,
            userAbout,
        };

        return {
            success: true,
            data: formattedUser,
        };
    } catch (error) {
        console.error(
            "[getUserProfileUserById]",
            error
        );

        return {
            success: false,
            error:
                "Something went wrong while fetching user",
        };
    }
};