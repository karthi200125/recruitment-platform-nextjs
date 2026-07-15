import { Prisma, Role } from "@prisma/client";

interface OwnershipContext {
    userId: number;
    role: Role;
    companyId?: number | null;
}

// jobs a user can act on as a "poster" — recruiter owns jobs directly,
// organization owns jobs through their company. candidate has no poster access.
export const buildJobOwnershipFilter = ({ userId, role, companyId }: OwnershipContext): Prisma.JobWhereInput => {
    if (role === "ORGANIZATION") {
        if (!companyId) return { id: -1 }; // no company yet -> guaranteed empty result, not an error
        return { companyId };
    }

    if (role === "RECRUITER") {
        return { userId };
    }

    return { id: -1 }; // candidates never own jobs
};

// applications on jobs owned by this user/company — used for applicants/hired tabs
export const buildApplicationOwnershipFilter = (
    ctx: OwnershipContext
): Prisma.JobApplicationWhereInput => ({
    job: buildJobOwnershipFilter(ctx),
});

// applications submitted BY this user — used for applied/interviews tabs
// every role can have these since recruiters can also apply to jobs
export const buildOwnApplicationsFilter = (userId: number): Prisma.JobApplicationWhereInput => ({
    userId,
});