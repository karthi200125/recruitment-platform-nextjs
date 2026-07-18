"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle } from "lucide-react";

import { getEasyApplyUser } from "@/actions/user/getuser/getEasyApplyUser";

import { Progress } from "@/components/ui/progress";

import EasyApplyUserInfo from "./EasyApplyUserInfo";
import EasyApplyResume from "./EasyApplyResume";
import EasyApplyQuestions from "./EasyApplyQuestions";
import EasyApplySubmit from "./EasyApplySubmit";

import type {
    ContactInfo,
    EasyApplyProps,
    EasyApplyUser,
    QuestionAnswers,
    ResumeData,
} from "@/types/easyApply";

import EasyApplySkeleton from "@/components/skeletons/EasyApplySkeleton";

const EMPTY_RESUME: ResumeData = {
    name: "",
    url: "",
    publicId: "",
    file: null,
};

const EasyApply = ({ job }: EasyApplyProps) => {
    const {
        data: user,
        isPending,
        isError,
    } = useQuery<EasyApplyUser>({
        queryKey: ["easyApplyUser"],
        queryFn: async () => {
            const data = await getEasyApplyUser();

            if (!data) {
                throw new Error("Unauthorized");
            }

            return data;
        },
        staleTime: 5 * 60 * 1000,
        retry: false,
    });

    const [currentStep, setCurrentStep] = useState(0);

    const [contactInfo, setContactInfo] =
        useState<ContactInfo>({
            email: "",
            phone: "",
        });

    const [resumeData, setResumeData] = useState<ResumeData>(EMPTY_RESUME);
    const [questionAnswers, setQuestionAnswers] = useState<QuestionAnswers>({});
    const hasQuestions = (job.questions?.length ?? 0) > 0;
    const totalSteps = hasQuestions ? 4 : 3;
    const progress = ((currentStep + 1) / totalSteps) * 100;
    if (isPending) {
        return <EasyApplySkeleton />;
    }

    if (isError || !user) {
        return (
            <div className="flex flex-col items-center gap-3 rounded-2xl border border-slate-200 bg-white p-8 text-center">
                <AlertCircle className="h-8 w-8 text-red-500" />

                <p className="text-sm font-medium text-slate-900">
                    You need to sign in to apply for this job.
                </p>

                <p className="text-sm text-slate-500">
                    Please sign in and try again.
                </p>
            </div>
        );
    }

    return (
        <div className="flex w-full flex-col">

            <div className="sticky top-[60px] flex items-center gap-5 bg-white py-3">
                <Progress
                    value={progress}
                    className="w-full"
                />

                <span className="font-semibold">
                    {Math.round(progress)}%
                </span>
            </div>

            <div className="mt-5">

                {currentStep === 0 && (
                    <EasyApplyUserInfo
                        user={user}
                        currentStep={currentStep}
                        initialContactInfo={contactInfo}
                        onNext={setCurrentStep}
                        onUserdata={setContactInfo}
                    />
                )}

                {currentStep === 1 && (
                    <EasyApplyResume
                        user={user}
                        currentStep={currentStep}
                        initialResume={resumeData}
                        onNext={setCurrentStep}
                        onBack={setCurrentStep}
                        onResume={setResumeData}
                    />
                )}

                {currentStep === 2 &&
                    hasQuestions && (
                        <EasyApplyQuestions
                            job={job}
                            currentStep={currentStep}
                            initialAnswers={questionAnswers}
                            onNext={setCurrentStep}
                            onBack={setCurrentStep}
                            onAnswers={setQuestionAnswers}
                        />
                    )}

                {((currentStep === 2 &&
                    !hasQuestions) ||
                    (currentStep === 3 &&
                        hasQuestions)) && (
                        <EasyApplySubmit
                            user={user}
                            job={job}
                            currentStep={currentStep}
                            onBack={setCurrentStep}
                            applicationData={{
                                contactInfo,
                                resumeData,
                                questionAnswers,
                            }}
                        />
                    )}

            </div>

            <div className="mt-5 rounded-xl border border-slate-200 p-5">
                <p className="text-sm text-slate-500">
                    Submitting this application will not modify your public profile.
                    Any resume uploaded here will only be used for this application.
                </p>
            </div>

        </div>
    );
};

export default EasyApply;