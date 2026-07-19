"use client";

import { useTransition } from "react";
import { ApplicationStatus } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useCustomToast } from "@/lib/CustomToast";
import { getStatusConfig } from "@/lib/dashboard/application-status";
import { updateApplicationStatus } from "@/actions/jobapplication/updateApplicationStatus";


const STATUS_OPTIONS: ApplicationStatus[] = [
    "APPLIED",
    "VIEWED",
    "UNDER_REVIEW",
    "SHORTLISTED",
    "INTERVIEW_SCHEDULED",
    "INTERVIEWED",
    "HIRED",
    "REJECTED",
    "WITHDRAWN",
];

interface ApplicantStatusDropdownProps {
    applicationId: number;
    currentStatus: ApplicationStatus;
}

export function ApplicantStatusDropdown({ applicationId, currentStatus }: ApplicantStatusDropdownProps) {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();
    const { showSuccessToast, showErrorToast } = useCustomToast();

    const config = getStatusConfig(currentStatus);

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = event.target.value as ApplicationStatus;
        if (newStatus === currentStatus) return;

        startTransition(async () => {
            const result = await updateApplicationStatus(applicationId, newStatus);

            if (result.error) {
                showErrorToast(result.error);
                return;
            }

            showSuccessToast("Status updated.");
            router.refresh();
        });
    };

    return (
        <select
            value={currentStatus}
            onChange={handleChange}
            disabled={isPending}
            className={`h-8 rounded-lg border px-2 text-xs font-semibold outline-none transition disabled:opacity-50 ${config.bg} ${config.text} ${config.border}`}
        >
            {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                    {getStatusConfig(status).label}
                </option>
            ))}
        </select>
    );
}