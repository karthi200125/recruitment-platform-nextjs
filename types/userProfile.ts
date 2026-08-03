import { Prisma } from "@prisma/client";

export type ProfileUser = Prisma.UserGetPayload<{
    include: {
        jobApplications: true;
        postedJobs: true;
        company: {
            include: {
                jobs: true;
            };
        };
        educations: true;
        experiences: true;
        projects: true;
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
    };
}>;
