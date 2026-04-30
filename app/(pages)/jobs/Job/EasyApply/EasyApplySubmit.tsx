"use client";

import { applyForJob } from "@/actions/job/ApplyJob";
import { closeModal } from "@/app/Redux/ModalSlice";
import Button from "@/components/Button";
import { useCustomToast } from "@/lib/CustomToast";
import { EasyApplyPayload, EasyApplyUser, Question } from "@/types/easyApply";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useDispatch } from "react-redux";
import noProfile from "../../../../../public/noProfile.webp";


interface EasyApplySubmitProps {
    job: {
        id: number;
        questions?: Question[];
    };
    applicationData: EasyApplyPayload;
    safeSearchParams?: Record<string, string>;
    user?: EasyApplyUser | null;
}

/* ================= COMPONENT ================= */

const EasyApplySubmit = ({
    job,
    applicationData,
    safeSearchParams,
    user,
}: EasyApplySubmitProps) => {
    const [isPending, startTransition] = useTransition();    
    const dispatch = useDispatch();
    const { showSuccessToast, showErrorToast } = useCustomToast();

    const router = useRouter();

    /* ================= DERIVED DATA ================= */

    const formattedAnswers =
        job?.questions?.map((q) => ({
            id: q.id,
            question: q.question,
            answer: applicationData.questionAnswers[q.id] || "",
        })) ?? [];

    /* ================= HANDLER ================= */

    const handleSubmit = () => {
        if (!applicationData.resumeData.url) {
            return showErrorToast("Resume is required");
        }

        startTransition(async () => {
            const result = await applyForJob(
                job.id,
                applicationData.contactInfo.email,
                applicationData.contactInfo.phone,
                applicationData.resumeData.url,
                formattedAnswers
            );

            if (result?.success) {
                showSuccessToast(result.success);

                router.refresh();
                
                dispatch(closeModal("easyapplyModal"));
            }

            if (result?.error) {
                showErrorToast(result.error);
            }
        });
    };

    /* ================= UI ================= */

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
                            src={user?.userImage || noProfile}
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
                <h3 className="font-semibold text-sm">Resume</h3>

                <div className="border rounded-md p-5">
                    {applicationData.resumeData.name || "No resume"}
                </div>
            </div>

            {/* Questions */}
            {formattedAnswers.length > 0 && (
                <div className="space-y-2">
                    <h3 className="font-semibold text-sm">
                        Additional Questions
                    </h3>

                    <div className="space-y-3 border rounded-md p-5">
                        {formattedAnswers.map((q) => (
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
                <Button isLoading={isPending} onClick={handleSubmit}>
                    Submit Application
                </Button>
            </div>
        </div>
    );
};

export default EasyApplySubmit;