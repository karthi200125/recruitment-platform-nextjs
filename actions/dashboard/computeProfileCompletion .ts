"use server";

import { Role } from "@prisma/client";

import { db } from "@/lib/db";

interface CompletionItem {
    label: string;
    completed: boolean;
}

interface ProfileCompletionResult {
    percentage: number;
    items: CompletionItem[];
}

const calculatePercentage = (
    items: CompletionItem[]
): number => {
    const completedCount = items.reduce(
        (count, item) =>
            count + (item.completed ? 1 : 0),
        0
    );

    return Math.round(
        (completedCount / items.length) * 100
    );
};

export const computeProfileCompletion = async (
    userId: number,
    role: Role,
    companyId?: number | null
): Promise<ProfileCompletionResult | undefined> => {
    // ─────────────────────────────────────────────
    // CANDIDATE
    // ─────────────────────────────────────────────

    if (role === "CANDIDATE") {
        const user = await db.user.findUnique({
            where: {
                id: userId,
            },
            select: {
                userBio: true,
                resume: true,
                skills: true,
                profileImage: true,
                _count: {
                    select: {
                        educations: true,
                        experiences: true,
                        projects: true,
                    },
                },
            },
        });

        if (!user) {
            return undefined;
        }

        const items: CompletionItem[] = [
            {
                label: "Profile photo",
                completed: Boolean(user.profileImage),
            },
            {
                label: "Bio",
                completed: Boolean(user.userBio),
            },
            {
                label: "Resume uploaded",
                completed: Boolean(user.resume),
            },
            {
                label: "Skills added",
                completed: user.skills.length > 0,
            },
            {
                label: "Education added",
                completed:
                    user._count.educations > 0,
            },
            {
                label: "Experience added",
                completed:
                    user._count.experiences > 0,
            },
            {
                label: "Projects added",
                completed:
                    user._count.projects > 0,
            },
        ];

        return {
            percentage: calculatePercentage(items),
            items,
        };
    }

    // ─────────────────────────────────────────────
    // RECRUITER
    // ─────────────────────────────────────────────

    if (role === "RECRUITER") {
        const user = await db.user.findUnique({
            where: {
                id: userId,
            },
            select: {
                profileImage: true,
                userBio: true,
                phoneNo: true,
                profession: true,
                website: true,
                skills: true,
                _count: {
                    select: {
                        experiences: true,
                    },
                },
            },
        });

        if (!user) {
            return undefined;
        }

        const items: CompletionItem[] = [
            {
                label: "Profile photo",
                completed: Boolean(user.profileImage),
            },
            {
                label: "Bio",
                completed: Boolean(user.userBio),
            },
            {
                label: "Phone number",
                completed: Boolean(user.phoneNo),
            },
            {
                label: "Profession",
                completed: Boolean(user.profession),
            },
            {
                label: "Website",
                completed: Boolean(user.website),
            },
            {
                label: "Skills added",
                completed: user.skills.length > 0,
            },
            {
                label: "Experience added",
                completed:
                    user._count.experiences > 0,
            },
        ];

        return {
            percentage: calculatePercentage(items),
            items,
        };
    }

    // ─────────────────────────────────────────────
    // ORGANIZATION
    // ─────────────────────────────────────────────

    if (!companyId) {
        return undefined;
    }

    const company = await db.company.findUnique({
        where: {
            id: companyId,
        },
        select: {
            companyImage: true,
            companyName: true,
            companyBio: true,
            companyAbout: true,
            companyWebsite: true,
            companyAddress: true,
            companyCity: true,
            companyState: true,
            companyCountry: true,
            companyIsVerified: true,

            _count: {
                select: {
                    jobs: true,
                },
            },
        },
    });

    if (!company) {
        return undefined;
    }

    const items: CompletionItem[] = [
        {
            label: "Company logo",
            completed: Boolean(company.companyImage),
        },
        {
            label: "Company name",
            completed: Boolean(company.companyName),
        },
        {
            label: "Company bio",
            completed: Boolean(company.companyBio),
        },
        {
            label: "Company description",
            completed: Boolean(company.companyAbout),
        },
        {
            label: "Website added",
            completed: Boolean(company.companyWebsite),
        },
        {
            label: "Address added",
            completed:
                Boolean(company.companyAddress) &&
                Boolean(company.companyCity) &&
                Boolean(company.companyState) &&
                Boolean(company.companyCountry),
        },
        {
            label: "Company verified",
            completed:
                company.companyIsVerified,
        },
        {
            label: "First job posted",
            completed: company._count.jobs > 0,
        },
    ];

    return {
        percentage: calculatePercentage(items),
        items,
    };
};