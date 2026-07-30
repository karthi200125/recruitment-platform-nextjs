import { db } from "@/lib/db";
import { Role } from "@prisma/client";

export const computeProfileCompletion = async (
    userId: number,
    role: Role,
    companyId?: number | null
) => {

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

        if (!user) return undefined;

        const items = [
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
                completed: user._count.educations > 0,
            },
            {
                label: "Experience added",
                completed: user._count.experiences > 0,
            },
            {
                label: "Projects added",
                completed: user._count.projects > 0,
            },
        ];

        const percentage = Math.round(
            (items.filter((item) => item.completed).length /
                items.length) *
            100
        );

        return {
            percentage,
            items,
        };
    }


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

        if (!user) return undefined;

        const items = [
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
                completed: user._count.experiences > 0,
            },
        ];

        const percentage = Math.round(
            (items.filter((item) => item.completed).length / items.length) * 100
        );

        return {
            percentage,
            items,
        };
    }


    if (!companyId) {
        return undefined;
    }

    const company = await db.company.findUnique({
        where: {
            id: companyId,
        },
        include: {
            jobs: {
                select: {
                    id: true,
                },
                take: 1,
            },
        },
    });

    if (!company) {
        return undefined;
    }

    const items = [
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
            completed: company.companyIsVerified,
        },
        {
            label: "First job posted",
            completed: company.jobs.length > 0,
        },
    ];

    const percentage = Math.round(
        (items.filter((item) => item.completed).length /
            items.length) *
        100
    );

    return {
        percentage,
        items,
    };
};