"use client";

import { Progress } from "@/components/ui/progress";
import { ContactInfo, EasyApplyProps, QuestionAnswers, ResumeData, EasyApplyUser, EasyApplyPayload } from "@/types/easyApply";
import { useState } from "react";
import EasyApplyQuestions from "./EasyApplyQuestions";
import EasyApplyUserInfo from "./EasyApplyUserInfo";
import EasyApplySubmit from "./EasyApplySubmit";
import EasyApplyResume from "./EasyApplyResume";
import { getEasyApplyUser } from "@/actions/user/getuser/getEasyApplyUser";
import { useQuery } from "@tanstack/react-query";


const EasyApply = ({ job, safeSearchParams }: EasyApplyProps) => {
    const { data: user, isPending } = useQuery<EasyApplyUser>({
        queryKey: ["easyApplyUser"],
        queryFn: async () => {
            const data = await getEasyApplyUser();

            if (!data) {
                throw new Error("Unauthorized");
            }

            return data;
        },
    });

    const [currentStep, setCurrentStep] = useState<number>(0);

    const [contactInfo, setContactInfo] = useState<ContactInfo>({
        email: "",
        phone: "",
    });

    const [resumeData, setResumeData] = useState<ResumeData>({
        name: "",
        url: "",
    });

    const [questionAnswers, setQuestionAnswers] = useState<QuestionAnswers>({});


    const hasQuestions = Boolean(job?.questions?.length);

    const totalSteps = hasQuestions ? 4 : 3;
    const progress = ((currentStep + 1) / totalSteps) * 100;

    if (isPending) {
        return <p>Loading...</p>;
    }

    return (
        <div className="w-full flex flex-col">
            {/* Progress Bar */}
            <div className="sticky top-[60px] w-full flex items-center gap-5 bg-white py-3">
                <Progress value={progress} className="w-full" />
                <h3 className="font-bold">{progress.toFixed(0)}%</h3>
            </div>

            <div className="mt-5">
                {/* STEP 1 - USER INFO */}
                {currentStep === 0 && (
                    <EasyApplyUserInfo
                        user={user}
                        currentStep={currentStep}
                        onNext={setCurrentStep}
                        onUserdata={setContactInfo}
                    />
                )}

                {/* STEP 2 - RESUME */}
                {currentStep === 1 && (
                    <EasyApplyResume
                        user={user}
                        currentStep={currentStep}
                        onNext={setCurrentStep}
                        onBack={setCurrentStep}
                        onResume={setResumeData}
                    />
                )}

                {/* STEP 3 - QUESTIONS */}
                {currentStep === 2 && hasQuestions && (
                    <EasyApplyQuestions
                        job={job}
                        currentStep={currentStep}
                        onNext={setCurrentStep}
                        onBack={setCurrentStep}
                        onAnswers={setQuestionAnswers}
                    />
                )}

                {/* STEP 4 - SUBMIT */}
                {((currentStep === 2 && !hasQuestions) ||
                    (currentStep === 3 && hasQuestions)) && (
                        <EasyApplySubmit
                            user={user}
                            job={job}
                            safeSearchParams={safeSearchParams}
                            applicationData={{
                                contactInfo,
                                resumeData,
                                questionAnswers,
                            }}
                        />
                    )}
            </div>

            {/* Footer */}
            <div className="mt-5 border rounded-md p-5">
                <h6>
                    Submitting this application won't change your profile.
                </h6>
            </div>
        </div>
    );
};

export default EasyApply;