'use client'

import dynamic from "next/dynamic"
import { UserInfoForm } from "@/app/Forms/UserInfoForm"
import { useState, Suspense } from "react"
import { useSelector } from "react-redux"
import WelcomeUserEducation from "./WelcomeUserEducation"
import WelcomeUserExperince from "./WelcomeUserExperince"
import { useQuery } from "@tanstack/react-query"
import { getCompanyByUserId } from "@/actions/company/getCompanyById"

const CompanyForm = dynamic(() => import("@/app/Forms/CompanyForm"), {
    loading: () => (
        <div className="w-full space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="h-10 bg-white/10 rounded-lg animate-pulse" />
                <div className="h-10 bg-white/10 rounded-lg animate-pulse" />
                <div className="h-10 bg-white/10 rounded-lg animate-pulse" />
                <div className="h-10 bg-white/10 rounded-lg animate-pulse" />
            </div>
        </div>
    ),
    ssr: true
});

const Welcome = () => {
    const user = useSelector((state: any) => state.user.user)
    const [step, setStep] = useState(1)

    const isOrg = user?.role === "ORGANIZATION"

    const { data: company, isPending } = useQuery({
        queryKey: ['getCompanyByUserId', user?.id],
        queryFn: async () => await getCompanyByUserId(user?.id),
        enabled: !!user?.id,
    });
    
    const renderStepContent = () => {
        switch (step) {
            case 1:
                return <UserInfoForm currentStep={step} onNext={(n: number) => setStep(n)} />
            case 2:
                return <WelcomeUserEducation currentStep={step} onNext={(n: number) => setStep(n)} onBack={(n: number) => setStep(n)} />
            case 3:
                return <WelcomeUserExperince currentStep={step} onBack={(n: number) => setStep(n)} />
            default:
                return null
        }
    }

    return (
        <div className="w-full max-h-max flex items-center justify-start flex-col gap-10 my-5 p-5 border rounded-[20px]">
            <div className="w-full h-full">
                {isOrg ?
                    <div className={`${user?.role !== 'ORGANIZATION' && "hidden"} w-full h-full space-y-5`}>
                        <h3 className="font-bold">{company ? "Edit Company" : "Create Company"}</h3>
                        <Suspense fallback={
                            <div className="w-full space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="h-10 bg-white/10 rounded-lg animate-pulse" />
                                    <div className="h-10 bg-white/10 rounded-lg animate-pulse" />
                                    <div className="h-10 bg-white/10 rounded-lg animate-pulse" />
                                    <div className="h-10 bg-white/10 rounded-lg animate-pulse" />
                                </div>
                            </div>
                        }>
                            <CompanyForm company={company} isPending={isPending} />
                        </Suspense>
                    </div>
                    :
                    renderStepContent()}
            </div>
        </div>
    )
}

export default Welcome
