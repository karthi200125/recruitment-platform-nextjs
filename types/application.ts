import { ApplicationStatus, Prisma } from "@prisma/client";

export type JobApplication = Prisma.JobApplicationGetPayload<{}>;

export type JobApplicationWithJob = Prisma.JobApplicationGetPayload<{
    include: {
        job: true;
    };
}>;

export type JobApplicationWithStatusHistory =
    Prisma.JobApplicationGetPayload<{
        include: {
            statusHistory: true;
        };
    }>;

export type JobApplicationWithUser = Prisma.JobApplicationGetPayload<{
    include: {
        user: true;
    };
}>;

export type JobApplicationWithUserAndJob = Prisma.JobApplicationGetPayload<{
    include: {
        user: true;
        job: {
            include: {
                company: true;
            };
        };
    };
}>;

export interface JobQuestionAnswer {
    id: string | number;
    question: string;
    answer: string;
}

export type UpdatableApplicationStatus = Extract<
    ApplicationStatus,
    | "VIEWED"
    | "UNDER_REVIEW"
    | "SHORTLISTED"
    | "INTERVIEW_SCHEDULED"
    | "INTERVIEWED"
    | "HIRED"
    | "REJECTED"
>;