
export type User = Prisma.UserGetPayload<{}>;

export type UserWithSubscription = Prisma.UserGetPayload<{
    include: {
        subscription: true;
    };
}>;

export type UserWithCompany = Prisma.UserGetPayload<{
    include: {
        company: true;
    };
}>;

export type UserWithEducations = Prisma.UserGetPayload<{
    include: {
        educations: true;
    };
}>;

export type UserWithExperiences = Prisma.UserGetPayload<{
    include: {
        experiences: true;
    };
}>;

export type UserWithProjects = Prisma.UserGetPayload<{
    include: {
        projects: true;
    };
}>;

export type UserWithSavedJobs = Prisma.UserGetPayload<{
    include: {
        savedJobs: true;
    };
}>;

export type UserWithProfileViews = Prisma.UserGetPayload<{
    include: {
        profileViewsReceived: {
            include: {
                viewer: true;
            };
        };
    };
}>;

export type UserProfile = Prisma.UserGetPayload<{
    include: {
        followers: true;
        following: true;
    };    
}>;

export type SessionUser = Pick<
    User,
    "id" | "username" | "role" | "isPro" | "profileImage"
>;