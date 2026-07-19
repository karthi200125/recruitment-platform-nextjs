import { ApplicationStatus } from "@prisma/client";

export interface ApplicationStatusHistoryEntry {
    id: number;
    status: ApplicationStatus;
    createdAt: Date;
}

export interface ApplicationJobCompany {
    companyName: string;
    companyImage: string | null;
}

export interface ApplicationJob {
    jobTitle: string;
    mode: string;
    company: ApplicationJobCompany;
}

export interface CandidateApplication {
    id: number;
    jobId: number;
    status: ApplicationStatus;
    createdAt: Date;
    viewedAt: Date | null;
    shortlistedAt: Date | null;
    interviewScheduledAt: Date | null;
    interviewedAt: Date | null;
    hiredAt: Date | null;
    rejectedAt: Date | null;
    withdrawnAt: Date | null;
    job: ApplicationJob;
    statusHistory: ApplicationStatusHistoryEntry[];
}