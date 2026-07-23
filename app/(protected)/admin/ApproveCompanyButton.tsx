"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

import Button from "@/components/Button";
import { useCustomToast } from "@/lib/CustomToast";
import { approveCompany } from "@/actions/admin/approve-company";


interface ApproveCompanyButtonProps {
    companyId: number;
}

const ApproveCompanyButton = ({
    companyId,
}: ApproveCompanyButtonProps) => {
    const router = useRouter();

    const { showSuccessToast, showErrorToast } =
        useCustomToast();

    const [isPending, startTransition] =
        useTransition();

    const handleApprove = () => {
        startTransition(async () => {
            try {
                const result =
                    await approveCompany(companyId);

                if (!result.success) {
                    showErrorToast(
                        result.message ??
                        "Failed to approve company."
                    );

                    return;
                }

                showSuccessToast(
                    "Company approved successfully."
                );

                router.refresh();
            } catch {
                showErrorToast(
                    "Something went wrong. Please try again."
                );
            }
        });
    };

    return (
        <Button
            onClick={handleApprove}
            disabled={isPending}
            isLoading={isPending}
            variant="border" 
        >
            Approve
        </Button>
    );
};

export default ApproveCompanyButton;