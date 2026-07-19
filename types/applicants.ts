import { ApplicationStatus } from "@prisma/client";

export interface ApplicantStatusHistoryEntry {
    id: number;
    status: ApplicationStatus;
    createdAt: Date;
}

export interface ApplicantCandidate {
    id: number;
    username: string;
    firstName: string | null;
    lastName: string | null;
    profileImage: string | null;
    profession: string | null;
    city: string | null;
    skills: string[];
}

export interface ApplicantApplication {
    id: number;
    jobId: number;
    status: ApplicationStatus;
    appliedAt: Date;
    candidateEmail: string;
    candidateMobile: string;
    candidateResume: string;
    questionAndAnswers: { id: number; question: string; answer: string }[] | null;
    user: ApplicantCandidate;
    statusHistory: ApplicantStatusHistoryEntry[];
    matchedSkillsCount: number;
    matchPercent: number;
}