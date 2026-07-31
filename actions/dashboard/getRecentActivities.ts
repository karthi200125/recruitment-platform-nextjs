"use server";

import {
    ApplicationStatus,
    CompanyEmployeeStatus,
    Prisma,
    Role,
} from "@prisma/client";

import { db } from "@/lib/db";

export type ActivityType =
    | "APPLICATION"
    | "PROFILE_VIEW"
    | "SHORTLISTED"
    | "UNDER_REVIEW"
    | "INTERVIEW_SCHEDULED"
    | "INTERVIEWED"
    | "HIRED"
    | "REJECTED"
    | "WITHDRAWN"
    | "COMPANY_VERIFIED"
    | "EMPLOYEE_JOINED";

export interface RecentActivity {
    id: string;
    type: ActivityType;

    title: string;
    description?: string;

    createdAt: Date;

    href?: string;

    user?: {
        id: number;
        name: string;
        image?: string | null;
    };
}

const MAX_ACTIVITIES = 10;

const pushActivity = (
    activities: RecentActivity[],
    activity: RecentActivity | null | undefined
) => {
    if (!activity) return;

    activities.push(activity);
};

const createApplicationActivity = (
    applicationId: number,
    type: ActivityType,
    title: string,
    createdAt: Date | null | undefined,
    href: string,
    user?: {
        id: number;
        name: string;
        image?: string | null;
    }
): RecentActivity | null => {
    if (!createdAt) return null;

    return {
        id: `${type}-${applicationId}-${createdAt.getTime()}`,
        type,
        title,
        createdAt,
        href,
        user,
    };
};

const sortActivities = (activities: RecentActivity[]) => {
    return activities
        .sort(
            (a, b) =>
                b.createdAt.getTime() -
                a.createdAt.getTime()
        )
        .slice(0, MAX_ACTIVITIES);
};

const applicationInclude =
    Prisma.validator<Prisma.JobApplicationDefaultArgs>()({
        include: {
            user: {
                select: {
                    id: true,
                    username: true,
                    profileImage: true,
                },
            },
            job: {
                select: {
                    id: true,
                    jobTitle: true,
                    company: {
                        select: {
                            id: true,
                            companyName: true,
                            companyIsVerified: true,
                        },
                    },
                },
            },
        },
    });

type ApplicationWithRelations =
    Prisma.JobApplicationGetPayload<
        typeof applicationInclude
    >;

const buildCandidateActivities = (
    application: ApplicationWithRelations
): RecentActivity[] => {
    const activities: RecentActivity[] = [];

    pushActivity(
        activities,
        createApplicationActivity(
            application.id,
            "APPLICATION",
            `Applied to ${application.job.jobTitle}`,
            application.appliedAt,
            `/applications/${application.id}`
        )
    );

    pushActivity(
        activities,
        createApplicationActivity(
            application.id,
            "UNDER_REVIEW",
            `${application.job.jobTitle} is under review`,
            application.viewedAt,
            `/applications/${application.id}`
        )
    );

    pushActivity(
        activities,
        createApplicationActivity(
            application.id,
            "SHORTLISTED",
            `Shortlisted for ${application.job.jobTitle}`,
            application.shortlistedAt,
            `/applications/${application.id}`
        )
    );

    pushActivity(
        activities,
        createApplicationActivity(
            application.id,
            "INTERVIEW_SCHEDULED",
            `Interview scheduled for ${application.job.jobTitle}`,
            application.interviewScheduledAt,
            `/applications/${application.id}`
        )
    );

    pushActivity(
        activities,
        createApplicationActivity(
            application.id,
            "INTERVIEWED",
            `Interview completed for ${application.job.jobTitle}`,
            application.interviewedAt,
            `/applications/${application.id}`
        )
    );

    pushActivity(
        activities,
        createApplicationActivity(
            application.id,
            "HIRED",
            `Congratulations! You were hired for ${application.job.jobTitle}`,
            application.hiredAt,
            `/applications/${application.id}`
        )
    );

    pushActivity(
        activities,
        createApplicationActivity(
            application.id,
            "REJECTED",
            `Application rejected for ${application.job.jobTitle}`,
            application.rejectedAt,
            `/applications/${application.id}`
        )
    );

    pushActivity(
        activities,
        createApplicationActivity(
            application.id,
            "WITHDRAWN",
            `You withdrew your application for ${application.job.jobTitle}`,
            application.withdrawnAt,
            `/applications/${application.id}`
        )
    );

    return activities;
};

const buildRecruiterActivities = (
    application: ApplicationWithRelations
): RecentActivity[] => {
    const activities: RecentActivity[] = [];

    const candidate = {
        id: application.user.id,
        name: application.user.username,
        image: application.user.profileImage,
    };

    pushActivity(
        activities,
        createApplicationActivity(
            application.id,
            "APPLICATION",
            `${candidate.name} applied for ${application.job.jobTitle}`,
            application.appliedAt,
            `/applications/${application.id}`,
            candidate
        )
    );

    pushActivity(
        activities,
        createApplicationActivity(
            application.id,
            "UNDER_REVIEW",
            `${candidate.name}'s application is under review`,
            application.viewedAt,
            `/applications/${application.id}`,
            candidate
        )
    );

    pushActivity(
        activities,
        createApplicationActivity(
            application.id,
            "SHORTLISTED",
            `${candidate.name} was shortlisted`,
            application.shortlistedAt,
            `/applications/${application.id}`,
            candidate
        )
    );

    pushActivity(
        activities,
        createApplicationActivity(
            application.id,
            "INTERVIEW_SCHEDULED",
            `Interview scheduled with ${candidate.name}`,
            application.interviewScheduledAt,
            `/applications/${application.id}`,
            candidate
        )
    );

    pushActivity(
        activities,
        createApplicationActivity(
            application.id,
            "INTERVIEWED",
            `${candidate.name} completed the interview`,
            application.interviewedAt,
            `/applications/${application.id}`,
            candidate
        )
    );

    pushActivity(
        activities,
        createApplicationActivity(
            application.id,
            "HIRED",
            `${candidate.name} was hired`,
            application.hiredAt,
            `/applications/${application.id}`,
            candidate
        )
    );

    pushActivity(
        activities,
        createApplicationActivity(
            application.id,
            "REJECTED",
            `${candidate.name} was rejected`,
            application.rejectedAt,
            `/applications/${application.id}`,
            candidate
        )
    );

    pushActivity(
        activities,
        createApplicationActivity(
            application.id,
            "WITHDRAWN",
            `${candidate.name} withdrew the application`,
            application.withdrawnAt,
            `/applications/${application.id}`,
            candidate
        )
    );

    return activities;
};

const buildOrganizationActivities = (
    application: ApplicationWithRelations
): RecentActivity[] => {
    return buildRecruiterActivities(application);
};

const buildProfileViewActivities = async (
    userId: number
): Promise<RecentActivity[]> => {
    const profileViews = await db.profileView.findMany({
        where: {
            profileUserId: userId,
        },
        include: {
            viewer: {
                select: {
                    id: true,
                    username: true,
                    profileImage: true,
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return profileViews.map((view) => ({
        id: `PROFILE_VIEW-${view.id}`,
        type: "PROFILE_VIEW",
        title: view.viewer
            ? `${view.viewer.username} viewed your profile`
            : "Someone viewed your profile",
        createdAt: view.createdAt,
        href: "/profile",
        user: view.viewer
            ? {
                id: view.viewer.id,
                name: view.viewer.username,
                image: view.viewer.profileImage,
            }
            : undefined,
    }));
};

const buildEmployeeActivities = async (
    companyId: number
): Promise<RecentActivity[]> => {
    const employees = await db.companyEmployee.findMany({
        where: {
            companyId,
            status: CompanyEmployeeStatus.ACCEPTED,
            joinedAt: {
                not: null,
            },
        },
        include: {
            user: {
                select: {
                    id: true,
                    username: true,
                    profileImage: true,
                },
            },
        },
        orderBy: {
            joinedAt: "desc",
        },
    });

    return employees.map((employee) => ({
        id: `EMPLOYEE-${employee.id}`,
        type: "EMPLOYEE_JOINED",
        title: `${employee.user.username} joined your company`,
        createdAt: employee.joinedAt!,
        href: "/organization/employees",
        user: {
            id: employee.user.id,
            name: employee.user.username,
            image: employee.user.profileImage,
        },
    }));
};

const buildCompanyVerificationActivity = async (
    companyId: number
): Promise<RecentActivity[]> => {
    const company = await db.company.findUnique({
        where: {
            id: companyId,
        },
        select: {
            id: true,
            companyName: true,
            companyIsVerified: true,
            updatedAt: true,
        },
    });

    if (!company?.companyIsVerified) {
        return [];
    }

    return [
        {
            id: `COMPANY_VERIFIED-${company.id}`,
            type: "COMPANY_VERIFIED",
            title: `${company.companyName} has been verified`,
            createdAt: company.updatedAt,
            href: "/organization/company",
        },
    ];
};

const mergeActivities = (
    ...activityGroups: RecentActivity[][]
): RecentActivity[] => {
    return sortActivities(activityGroups.flat());
};



export const getRecentActivities = async (
    userId: number,
    role: Role,
    companyId?: number | null
): Promise<RecentActivity[]> => {
    const activities: RecentActivity[] = [];

    if (role === Role.CANDIDATE) {
        const [applications, profileActivities] = await Promise.all([
            db.jobApplication.findMany({
                where: {
                    userId,
                },
                ...applicationInclude,
                orderBy: {
                    createdAt: "desc",
                },
            }),
            buildProfileViewActivities(userId),
        ]);

        applications.forEach((application) => {
            activities.push(...buildCandidateActivities(application));
        });

        activities.push(...profileActivities);
    }

    if (role === Role.RECRUITER) {
        const applications = await db.jobApplication.findMany({
            where: {
                job: {
                    userId,
                },
            },
            ...applicationInclude,
            orderBy: {
                createdAt: "desc",
            },
        });

        applications.forEach((application) => {
            activities.push(...buildRecruiterActivities(application));
        });
    }

    if (role === Role.ORGANIZATION && companyId) {
        const [applications, employeeActivities, companyActivities] =
            await Promise.all([
                db.jobApplication.findMany({
                    where: {
                        job: {
                            companyId,
                        },
                    },
                    ...applicationInclude,
                    orderBy: {
                        createdAt: "desc",
                    },
                }),
                buildEmployeeActivities(companyId),
                buildCompanyVerificationActivity(companyId),
            ]);

        applications.forEach((application) => {
            activities.push(...buildOrganizationActivities(application));
        });

        activities.push(...employeeActivities);
        activities.push(...companyActivities);
    }

    return mergeActivities(activities);
};