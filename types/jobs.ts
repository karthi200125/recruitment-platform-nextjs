import { Prisma } from "@prisma/client";

export type Job = Prisma.JobGetPayload<{}>;

export type JobWithCompany = Prisma.JobGetPayload<{
    include: {
        company: true;
        jobApplications: true;
    };
}>;

export type JobWithApplications = Prisma.JobGetPayload<{
    include: {
        jobApplications: true;
    };
}>;

export type JobWithSavedUsers = Prisma.JobGetPayload<{
    include: {
        savedBy: true;
    };
}>;

export interface JobQuestionType {
    id: string;
    question: string;
    required: boolean;
    type: "text";
}

export type JobWithCompanyAndCount =
    Prisma.JobGetPayload<{
        include: {
            company: true;
            _count: {
                select: {
                    jobApplications: true;
                };
            };
        };
    }>;