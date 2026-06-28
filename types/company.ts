import { Prisma } from "@prisma/client";

export type Company = Prisma.CompanyGetPayload<{}>;

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

export type CompanyWithOwner = Prisma.CompanyGetPayload<{
    include: {
        user: true;
    };
}>;