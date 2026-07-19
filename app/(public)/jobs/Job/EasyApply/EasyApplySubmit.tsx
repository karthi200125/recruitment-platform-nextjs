"use client";

import { useMemo, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";

import { applyForJob } from "@/actions/job/apply-job";
import Button from "@/components/Button";
import { useCustomToast } from "@/lib/CustomToast";
import { closeModal } from "@/store/ModalSlice";
import { JobQuestionAnswer, JobQuestionAnswerItem } from "@/types";
import { EasyApplyJob, EasyApplyPayload, EasyApplyUser } from "@/types/easyApply";

import noProfile from "../../../../../public/noProfile.webp";

interface EasyApplySubmitProps {
    job: EasyApplyJob;
    applicationData: EasyApplyPayload;
    user?: EasyApplyUser | null;
    currentStep?: number;
    onBack?: (step: number) => void;
    onSubmitted?: () => void;
}

const EasyApplySubmit = ({ job, applicationData, user, currentStep = 0, onBack, onSubmitted }: EasyApplySubmitProps) => {
    const [isPending, startTransition] = useTransition();
    const dispatch = useDispatch();
    const { showSuccessToast, showErrorToast } = useCustomToast();
    const router = useRouter();

    const formattedAnswers: JobQuestionAnswer = useMemo(
        () =>
            (job.questions ?? []).map((question) => ({
                id: question.id,
                question: question.question,
                answer: applicationData.questionAnswers[question.id] ?? "",
            })),
        [job.questions, applicationData.questionAnswers]
    );

    const displayName = user?.firstName || user?.lastName ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() : user?.username ?? "User";
    const location = [user?.city, user?.state, user?.country].filter(Boolean).join(", ");

    const handleSubmit = () => {
        if (isPending) return;

        if (!applicationData.contactInfo.email.trim()) {
            showErrorToast("Email is required.");
            return;
        }

        if (!applicationData.contactInfo.phone.trim()) {
            showErrorToast("Phone number is required.");
            return;
        }

        if (!applicationData.resumeData.url) {
            showErrorToast("Please upload a resume.");
            return;
        }

        startTransition(async () => {            
            const result = await applyForJob({
                jobId: job.id,
                candidateEmail: applicationData.contactInfo.email,
                candidateMobile: applicationData.contactInfo.phone,
                resume: {
                    name: applicationData.resumeData.name,
                    url: applicationData.resumeData.url,
                    publicId: applicationData.resumeData.publicId,
                },
                questionAndAnswers: formattedAnswers,
            });

            if ("error" in result) {
                showErrorToast(result.error || "Something went wrong.");
                return;
            }

            showSuccessToast(result.success);
            onSubmitted?.();
            router.refresh();
            dispatch(closeModal("easyapplyModal"));
        });
    };

    return (
        <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6">
            <div>
                <h2 className="text-lg font-semibold text-slate-900">Review your application</h2>
                <p className="mt-1 text-sm text-slate-500">The employer will also receive a copy of your profile.</p>
            </div>

            <div className="space-y-2">
                <h3 className="text-sm font-semibold text-slate-900">Contact Info</h3>

                <div className="flex w-full flex-col gap-5 rounded-xl border border-slate-200 p-5 md:flex-row">
                    <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-slate-100">
                        <Image src={user?.profileImage || noProfile} alt={displayName} fill className="object-cover" />
                    </div>

                    <div className="flex w-full flex-col justify-between gap-4 md:flex-row">
                        <div className="space-y-1">
                            <p className="font-semibold text-slate-900">{displayName}</p>
                            <p className="text-sm text-slate-500">{location || "Location not set"}</p>
                        </div>

                        <div className="space-y-2 text-sm">
                            <div>
                                <p className="text-slate-500">Email</p>
                                <p className="font-medium text-slate-900">{applicationData.contactInfo.email}</p>
                            </div>

                            <div>
                                <p className="text-slate-500">Phone</p>
                                <p className="font-medium text-slate-900">{applicationData.contactInfo.phone}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <h3 className="text-sm font-semibold text-slate-900">Resume</h3>

                <div className="rounded-xl border border-slate-200 p-4">
                    <p className="font-medium text-slate-900">{applicationData.resumeData.name}</p>
                    <p className="mt-1 text-xs text-slate-500">This resume will be submitted with your application.</p>
                </div>
            </div>

            {formattedAnswers.length > 0 && (
                <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-slate-900">Additional Questions</h3>

                    <div className="space-y-3 rounded-xl border border-slate-200 p-5">
                        {formattedAnswers.map((q: JobQuestionAnswerItem) => (
                            <div key={q.id}>
                                <p className="text-sm text-slate-500">{q.question}</p>
                                <p className="font-medium text-slate-900">{q.answer || "-"}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="flex items-center justify-between border-t border-slate-200 pt-6">
                <Button variant="border" onClick={() => onBack?.(currentStep - 1)} disabled={isPending}>
                    Back
                </Button>

                <Button isLoading={isPending} disabled={isPending} onClick={handleSubmit}>
                    Submit Application
                </Button>
            </div>
        </div>
    );
};

export default EasyApplySubmit;