"use client";

import { applyForJob } from "@/actions/job/apply-job";
import Button from "@/components/Button";
import { useCustomToast } from "@/lib/CustomToast";
import { closeModal } from "@/store/ModalSlice";
import { Job, JobQuestionAnswer, JobQuestionAnswerItem } from "@/types";
import { EasyApplyPayload, EasyApplyUser, Question } from "@/types/easyApply";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useDispatch } from "react-redux";


interface EasyApplySubmitProps {
    job: any;
    applicationData: EasyApplyPayload;
    user?: EasyApplyUser | null;
}

const EasyApplySubmit = ({
    job,
    applicationData,
    user,
}: EasyApplySubmitProps) => {
    const [isPending, startTransition] = useTransition();
    const dispatch = useDispatch();
    const { showSuccessToast, showErrorToast } = useCustomToast();

    const router = useRouter();

    const formattedAnswers: JobQuestionAnswer =
        (job.questions ?? []).map((question: any) => ({
            id: question.id,
            question: question.question,
            answer:
                applicationData.questionAnswers[
                question.id
                ] ?? "",
        }));

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
                resume: applicationData.resumeData,
                questionAndAnswers: formattedAnswers,
            });

            if ("error" in result) {
                showErrorToast(result.error || "Something went wrong.");
                return;
            }

            showSuccessToast(result.success);

            router.refresh();

            dispatch(closeModal("easyapplyModal"));
        });
    };

    const location = [user?.city, user?.state, user?.country]
        .filter(Boolean)
        .join(", ");

    return (
        <div className="w-full p-5 rounded-md border space-y-5">
            {/* Header */}
            <div>
                <h3 className="font-bold">Review your application</h3>
                <h6 className="text-[var(--lighttext)]">
                    The employer will also receive a copy of your profile.
                </h6>
            </div>

            {/* Contact Info */}
            <div className="space-y-2">
                <h3 className="font-semibold text-sm">Contact Info</h3>

                <div className="w-full border p-5 rounded-md flex flex-col md:flex-row gap-5">
                    <div className="h-[80px] w-[80px] relative">
                        <Image
                            src={user?.userImage || '/noProfile.webp'}
                            alt="User profile"
                            fill
                            className="rounded-md object-cover bg-neutral-200"
                        />
                    </div>

                    <div className="w-full flex flex-col md:flex-row justify-between gap-5">
                        <div className="space-y-1">
                            <h4 className="font-bold">{user?.username}</h4>
                            <h5 className="text-[var(--lighttext)]">
                                {location || "Location not set"}
                            </h5>
                        </div>

                        <div className="space-y-2">
                            <div>
                                <h6 className="text-[var(--lighttext)]">Email</h6>
                                <h4>{applicationData.contactInfo.email}</h4>
                            </div>

                            <div>
                                <h6 className="text-[var(--lighttext)]">Phone</h6>
                                <h4>{applicationData.contactInfo.phone}</h4>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Resume */}
            <div className="space-y-2">
                <h3 className="font-semibold text-sm">
                    Resume
                </h3>

                <div className="rounded-xl border border-slate-200 p-4">
                    <p className="font-medium text-slate-900">
                        {applicationData.resumeData.name}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                        This resume will be submitted with your application.
                    </p>
                </div>
            </div>

            {/* Questions */}
            {formattedAnswers.length > 0 && (
                <div className="space-y-2">
                    <h3 className="font-semibold text-sm">
                        Additional Questions
                    </h3>

                    <div className="space-y-3 border rounded-md p-5">
                        {formattedAnswers.map((q: JobQuestionAnswerItem) => (
                            <div key={q.id}>
                                <h6 className="text-[var(--lighttext)]">
                                    {q.question}
                                </h6>
                                <h4>{q.answer || "-"}</h4>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Submit */}
            <div className="flex justify-end">
                <Button
                    isLoading={isPending}
                    disabled={isPending}
                    onClick={handleSubmit}
                >
                    Submit Application
                </Button>
            </div>
        </div>
    );
};

export default EasyApplySubmit;