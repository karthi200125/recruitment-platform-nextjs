"use client";

import { memo, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, XCircle, Loader2, Crown } from "lucide-react";

import { employeeAccept, employeeReject } from "@/actions/company/employeeAction";
import { useCustomToast } from "@/lib/CustomToast";
import Batch from "@/components/Batch";
import noAvatar from "../../../../public/noImage.webp";

interface EmployeeUser {
    id: number;
    username: string;
    userImage?: string | null;
    profession?: string | null;
    isPro?: boolean;
}

interface EmployeeProps {
    user: EmployeeUser;
    currentUserId?: number;
    isVerify?: boolean;
    onSuccess?: () => void;
}

const Employee = ({ user, currentUserId, isVerify = false, onSuccess }: EmployeeProps) => {
    const [isAcceptPending, startAcceptTransition] = useTransition();
    const [isRejectPending, startRejectTransition] = useTransition();
    const { showErrorToast, showSuccessToast } = useCustomToast();

    const handleAccept = () => {
        if (!user?.id || !currentUserId) return;
        startAcceptTransition(async () => {
            try {
                const res = await employeeAccept(user.id, currentUserId);
                if (res?.success) { showSuccessToast(res.message || "Employee accepted"); onSuccess?.(); }
                else showErrorToast(res?.error || "Failed to accept employee");
            } catch { showErrorToast("Something went wrong"); }
        });
    };

    const handleReject = () => {
        if (!user?.id || !currentUserId) return;
        startRejectTransition(async () => {
            try {
                const res = await employeeReject(user.id, currentUserId);
                if (res?.success) { showSuccessToast(res.message || "Employee removed"); onSuccess?.(); }
                else showErrorToast(res?.error || "Failed to reject employee");
            } catch { showErrorToast("Something went wrong"); }
        });
    };

    return (
        <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 hover:border-indigo-200 hover:shadow-sm transition-all duration-200">
            {/* Avatar */}
            <Link href={`/userProfile/${user.id}`} className="flex-shrink-0">
                <div className="relative">
                    <div className="w-11 h-11 rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                        <Image src={user.userImage || noAvatar.src} alt={user.username || "User"} width={44} height={44} className="w-full h-full object-cover" />
                    </div>
                    {user.isPro && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-amber-400 border border-white flex items-center justify-center">
                            <Crown className="w-2 h-2 text-white" strokeWidth={3} />
                        </div>
                    )}
                </div>
            </Link>

            {/* Info + actions */}
            <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                            <Link href={`/userProfile/${user.id}`} className="text-sm font-semibold text-slate-800 hover:text-indigo-600 transition-colors duration-200 truncate capitalize">
                                {user.username}
                            </Link>
                            {user.isPro && <Batch type="premium" />}
                        </div>
                        {user.profession && <p className="text-xs text-slate-500 mt-0.5 truncate">{user.profession}</p>}
                    </div>

                    {isVerify && (
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                            <button onClick={handleAccept} disabled={isAcceptPending || isRejectPending}
                                className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 border border-emerald-200 px-2.5 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200">
                                {isAcceptPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle2 className="w-3 h-3" strokeWidth={2.5} />}
                                Accept
                            </button>
                            <button onClick={handleReject} disabled={isAcceptPending || isRejectPending}
                                className="inline-flex items-center gap-1 rounded-lg bg-red-50 border border-red-200 px-2.5 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200">
                                {isRejectPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <XCircle className="w-3 h-3" strokeWidth={2.5} />}
                                Reject
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default memo(Employee);