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
            educations: true;
            experiences: true;
            projects: true;

            _count: {
                select: {
                    followers: true;
                    following: true;
                };
            };
        };
    }> & {
        userAbout: string | null;
    };

export type OrganizationProfile =
    Prisma.UserGetPayload<{
        include: {
            company: true;

            _count: {
                select: {
                    followers: true;
                    following: true;
                };
            };
        };
    }> & {
        userAbout: string | null;
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