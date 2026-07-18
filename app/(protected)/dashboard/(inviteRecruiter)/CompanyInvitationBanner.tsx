"use client";

import { useState } from "react";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { Building2, User2 } from "lucide-react";
import { PendingCompanyInvitation } from "@/types/company-employee";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";


import { acceptCompanyInvitation } from "@/actions/company/acceptCompanyInvitation";
import { rejectCompanyInvitation } from "@/actions/company/rejectCompanyInvitation";
import { useCustomToast } from "@/lib/CustomToast";

interface CompanyInvitationBannerProps {
    invitation: PendingCompanyInvitation;
}

const CompanyInvitationBanner = ({
    invitation,
}: CompanyInvitationBannerProps) => {
    const {
        id: invitationId,
        company,
        role,
        invitedBy,
        createdAt,
    } = invitation;

    const router = useRouter();
    const { update } = useSession();
    const { showErrorToast, showSuccessToast } = useCustomToast()

    const companyName = company.companyName;
    const companyImage = company.companyImage;

    const invitedByName =
        invitedBy
            ? `${invitedBy.firstName ?? ""} ${invitedBy.lastName ?? ""}`.trim() ||
            invitedBy.username
            : "Unknown";

    const [isAccepting, setIsAccepting] = useState(false);
    const [isRejecting, setIsRejecting] = useState(false);

    const handleAcceptInvitation = async () => {
        try {
            setIsAccepting(true);

            const result =
                await acceptCompanyInvitation(invitationId);
            if (!result.success) {
                showErrorToast(result.message);
                return;
            }
            showSuccessToast(result.message);
            await Promise.all([
                update(),
                router.refresh(),
            ]);
        } catch (error) {
            console.error(
                "[COMPANY_INVITATION]",
                error
            );
            showErrorToast("Something went wrong."
            );
        } finally {
            setIsAccepting(false);
        }
    }

    const handleRejectInvitation = async () => {
        try {
            setIsRejecting(true);

            const result =
                await rejectCompanyInvitation(
                    invitationId
                );

            if (!result.success) {
                showErrorToast(result.message);
                return;
            }
            showSuccessToast(result.message);
            await Promise.all([
                update(),
                router.refresh(),
            ]);
        } catch (error) {
            console.error(
                "[COMPANY_INVITATION]",
                error
            );
            showErrorToast("Something went wrong.");
        } finally {
            setIsRejecting(false);
        }
    }

    const isLoading = isAccepting || isRejecting;

    return (
        <section className="overflow-hidden rounded-3xl border border-sky-200 bg-gradient-to-r from-sky-50 via-white to-indigo-50 shadow-sm mt-2">
            {/* Header */}
            <div className="border-b border-sky-100 px-8 py-6">
                <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100">
                        <Building2 className="h-6 w-6 text-sky-700" />
                    </div>

                    <div>
                        <h2 className="text-xl font-bold text-slate-900">
                            Company Invitation
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            You have been invited to join a company.
                        </p>
                    </div>
                </div>
            </div>

            {/* Body */}
            <div className="flex flex-col gap-8 px-8 py-8 lg:flex-row lg:items-center lg:justify-between">

                {/* Left */}
                <div className="flex min-w-0 items-center gap-5">

                    {/* Company Logo */}
                    <div className="relative h-20 w-20 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                        {companyImage ? (
                            <Image
                                src={companyImage}
                                alt={companyName}
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center bg-slate-100">
                                <Building2 className="h-9 w-9 text-slate-400" />
                            </div>
                        )}
                    </div>

                    {/* Information */}
                    <div className="min-w-0">

                        <h3 className="truncate text-2xl font-bold text-slate-900">
                            {companyName}
                        </h3>

                        <p className="mt-2 text-[15px] leading-7 text-slate-600">
                            invited you to join as
                            <span className="ml-2 font-semibold text-slate-900">
                                {role}
                            </span>
                        </p>

                        <div className="mt-5 flex flex-wrap items-center gap-5 text-sm text-slate-500">

                            <div className="flex items-center gap-2">
                                <User2 className="h-4 w-4" />

                                <span>
                                    Invited by{" "}
                                    <span className="font-medium text-slate-700">
                                        {invitedByName}
                                    </span>
                                </span>
                            </div>

                            <span className="hidden h-1 w-1 rounded-full bg-slate-300 md:block" />

                            <span>
                                {formatDistanceToNow(
                                    createdAt,
                                    {
                                        addSuffix: true,
                                    }
                                )}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Right Buttons */}

                <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
                    <button
                        type="button"
                        disabled={isLoading}
                        onClick={handleAcceptInvitation}
                        className="inline-flex h-12 min-w-[170px] items-center justify-center rounded-xl bg-sky-600 px-6 text-sm font-semibold text-white transition-colors hover:bg-sky-700 disabled:pointer-events-none disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {isAccepting
                            ? "Accepting..."
                            : "Accept Invitation"}
                    </button>

                    <button
                        type="button"
                        disabled={isLoading}
                        onClick={handleRejectInvitation}
                        className="inline-flex h-12 min-w-[150px] items-center justify-center rounded-xl border border-slate-200 bg-white px-6 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:pointer-events-none disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {isRejecting
                            ? "Declining..."
                            : "Decline"}
                    </button>
                </div>
            </div>
        </section>
    );
};

export default CompanyInvitationBanner;