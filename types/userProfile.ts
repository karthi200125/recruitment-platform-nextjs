import { Prisma } from "@prisma/client";

export type EmployeeUser = {
    id: number;
    username: string;
    userImage: string | null;
    profileImage: string | null;
    firstName: string | null;
    lastName: string | null;
};

export type CandidateRecruiterProfile =
    Prisma.UserGetPayload<{
        include: {
            jobApplications: true;

            postedJobs: true;

            company: {
                include: {
                    jobs: {
                        orderBy: {
                            createdAt: "desc";
                        };
                        take: 6;
                    };
                };
            };

            educations: true;
            experiences: true;
            projects: true;

            followers: {
                select: {
                    id: true;
                };
            };

            following: {
                select: {
                    id: true;
                };
            };
        };
    }> & {
        userAbout: string | null;
    };

export type OrganizationProfile =
    Prisma.UserGetPayload<{
        include: {
            company: {
                include: {
                    jobs: {
                        orderBy: {
                            createdAt: "desc";
                        };
                        take: 6;
                    };

                    employees: {
                        where: {
                            status: "ACCEPTED";
                        };

                        include: {
                            user: {
                                select: {
                                    id: true;
                                    username: true;
                                    userImage: true;
                                    profileImage: true;
                                    firstName: true;
                                    lastName: true;
                                };
                            };
                        };
                    };
                };
            };

            followers: {
                select: {
                    id: true;
                };
            };

            following: {
                select: {
                    id: true;
                };
            };
        };
    }> & {
        userAbout: string | null;
        employeeUsers: EmployeeUser[];
    };

export type ProfileUser =
    | CandidateRecruiterProfile
    | OrganizationProfile;


export function isOrganizationProfile(
    profile: ProfileUser
): profile is OrganizationProfile {
    return profile.role === "ORGANIZATION";
}

export function isCandidateRecruiterProfile(
    profile: ProfileUser
): profile is CandidateRecruiterProfile {
    return profile.role !== "ORGANIZATION";
}    