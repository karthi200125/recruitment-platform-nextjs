import { Prisma } from "@prisma/client";

export type Company = Prisma.CompanyGetPayload<{}>;

export type CompanyWithOwner = Prisma.CompanyGetPayload<{
    include: {
        user: true;
    };
}>;

export type CompanyWithJobs = Prisma.CompanyGetPayload<{
    include: {
        jobs: {
            include: {
                company: true;
                jobApplications: true;
            };
        };
    };
}>;

export type CompanyCard = Prisma.CompanyGetPayload<{
    select: {
        id: true;
        companyName: true;
        companyImage: true;
        companyCity: true;
        companyCountry: true;
        companyBio: true;
        companyIsVerified: true;
    };
}>;

export type CompanySummary = Prisma.CompanyGetPayload<{
    select: {
        id: true;
        companyName: true;
        companyImage: true;
        companyIsVerified: true;
        companyTotalEmployees: true;
    };
}>;

export type CompanyDashboard = Prisma.CompanyGetPayload<{
    include: {
        user: true;
        jobs: true;
        _count: {
            select: {
                jobs: true;
            };
        };
    };
}>;