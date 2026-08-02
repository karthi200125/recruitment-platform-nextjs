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

export type JobWithCompanyAndCount = Prisma.JobGetPayload<{
    include: {
        company: true;
        _count: {
            select: {
                jobApplications: true;
            };
        };
    };
}>;

export interface JobQuestionType {
    id: string;
    question: string;
    required: boolean;
    type: "text";
}

export interface JobSearchParams {
    userId?: number;
    q?: string;
    location?: string;
    type?: string;
    experiencelevel?: string;
    dateposted?: string;
    easyApply?: string;
    company?: string;
    page: number;
}
