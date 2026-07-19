import { CandidateApplication } from "@/types/candidate-application";
import { ApplicationStatus } from "@prisma/client";

export interface TimelineStep {
    status: ApplicationStatus;
    date: Date | null;
    done: boolean;
}

const TERMINAL_STATUSES: ApplicationStatus[] = ["HIRED", "REJECTED", "WITHDRAWN"];

export const buildTimelineSteps = (application: CandidateApplication): TimelineStep[] => {
    if (application.statusHistory.length > 0) {
        const steps = application.statusHistory
            .slice()
            .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
            .map((entry) => ({ status: entry.status, date: entry.createdAt, done: true }));

        // ensure "Applied" always anchors the start even if history doesn't include it
        if (steps[0]?.status !== "APPLIED") {
            steps.unshift({ status: "APPLIED", date: application.createdAt, done: true });
        }

        return steps;
    }

    const fallback: { status: ApplicationStatus; date: Date | null }[] = [
        { status: "APPLIED", date: application.createdAt },
        { status: "VIEWED", date: application.viewedAt },
        { status: "SHORTLISTED", date: application.shortlistedAt },
        { status: "INTERVIEW_SCHEDULED", date: application.interviewScheduledAt },
        { status: "INTERVIEWED", date: application.interviewedAt },
        { status: "HIRED", date: application.hiredAt },
        { status: "REJECTED", date: application.rejectedAt },
        { status: "WITHDRAWN", date: application.withdrawnAt },
    ];

    const steps = fallback
        .filter((step) => step.date !== null)
        .map((step) => ({ ...step, done: true }));
    
    const alreadyShown = steps.some((step) => step.status === application.status);
    if (!alreadyShown && !TERMINAL_STATUSES.includes(application.status)) {
        steps.push({ status: application.status, date: null, done: false });
    }

    return steps;
};