"use client";

import { memo, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";

import { FaCheckCircle } from "react-icons/fa";
import { MdCancel } from "react-icons/md";

import { employeeAccept, employeeReject } from "@/actions/company/employeeAction";
import { useCustomToast } from "@/lib/CustomToast";

import Button from "@/components/Button";
import Batch from "@/components/Batch";

import noAvatar from "../../../../public/noImage.webp";

/* ────────────────────────────────────────────────
   Types
──────────────────────────────────────────────── */
interface EmployeeUser {
    id: number;
    username: string;
    userImage?: string | null;
    profession?: string | null;
    isPro?: boolean;
}

interface EmployeeProps {
    user: EmployeeUser;
    currentUserId?: number; // company/admin id
    isVerify?: boolean;
    onSuccess?: () => void;
}

/* ────────────────────────────────────────────────
   Component
──────────────────────────────────────────────── */
const Employee = ({
    user,
    currentUserId,
    isVerify = false,
    onSuccess,
}: EmployeeProps) => {
    const [isAcceptPending, startAcceptTransition] = useTransition();
    const [isRejectPending, startRejectTransition] = useTransition();

    const { showErrorToast, showSuccessToast } = useCustomToast();

    /* ────────────────────────────────────────────────
       Handlers
    ──────────────────────────────────────────────── */
    const handleAccept = () => {
        if (!user?.id || !currentUserId) return;

        startAcceptTransition(async () => {
            try {
                const res = await employeeAccept(user.id, currentUserId);

                if (res?.success) {
                    showSuccessToast(res.message || "Employee accepted");
                    onSuccess?.();
                } else {
                    showErrorToast(res?.error || "Failed to accept employee");
                }
            } catch (err) {
                console.error("[employeeAccept]", err);
                showErrorToast("Something went wrong");
            }
        });
    };

    const handleReject = () => {
        if (!user?.id || !currentUserId) return;

        startRejectTransition(async () => {
            try {
                const res = await employeeReject(user.id, currentUserId);

                if (res?.success) {
                    showSuccessToast(res.message || "Employee rejected");
                    onSuccess?.();
                } else {
                    showErrorToast(res?.error || "Failed to reject employee");
                }
            } catch (err) {
                console.error("[employeeReject]", err);
                showErrorToast("Something went wrong");
            }
        });
    };

    /* ────────────────────────────────────────────────
       Render
    ──────────────────────────────────────────────── */
    return (
        <div className="flex items-start gap-4 p-4 rounded-2xl border bg-white/70 backdrop-blur-sm hover:shadow-md transition">

            {/* AVATAR */}
            <Image
                src={user.userImage || noAvatar.src}
                alt={user.username || "User"}
                width={50}
                height={50}
                className="rounded-xl object-cover bg-neutral-200"
            />

            {/* CONTENT */}
            <div className="flex flex-col md:flex-row md:items-center justify-between w-full gap-4">

                {/* USER INFO */}
                <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                        <Link
                            href={`/userProfile/${user.id}`}
                            className="font-semibold hover:underline"
                        >
                            {user.username}
                        </Link>

                        {user.isPro && <Batch type="premium" />}
                    </div>

                    {user.profession && (
                        <p className="text-sm text-neutral-500">
                            {user.profession}
                        </p>
                    )}
                </div>

                {/* ACTIONS */}
                {isVerify && (
                    <div className="flex items-center gap-2 flex-wrap">

                        <Button
                            variant="border"
                            icon={<FaCheckCircle size={14} className="text-green-500" />}
                            className="!h-[32px] !px-3 text-green-600 border-green-400 hover:bg-green-50"
                            onClick={handleAccept}
                            isLoading={isAcceptPending}
                        >
                            Accept
                        </Button>

                        <Button
                            variant="border"
                            icon={<MdCancel size={14} className="text-red-500" />}
                            className="!h-[32px] !px-3 text-red-600 border-red-400 hover:bg-red-50"
                            onClick={handleReject}
                            isLoading={isRejectPending}
                        >
                            Reject
                        </Button>

                    </div>
                )}
            </div>
        </div>
    );
};

export default memo(Employee);