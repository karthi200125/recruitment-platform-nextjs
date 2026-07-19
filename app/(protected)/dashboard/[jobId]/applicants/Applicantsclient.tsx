import { ApplicantApplication } from "@/types/applicants";
import { ApplicantsFilterBar } from "./Applicantsfilterbar";
import { ApplicantsList } from "./Applicantslist";
import { ApplicantDetails } from "./Applicantdetails";

interface ApplicantsClientProps {
    applicants: ApplicantApplication[];
    selected: ApplicantApplication | null;
    jobSkills: string[];
}

export function ApplicantsClient({ applicants, selected, jobSkills }: ApplicantsClientProps) {
    return (
        <div className="flex h-[calc(100vh-70px)] mt-2 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex w-full flex-shrink-0 flex-col overflow-hidden border-r border-slate-100 md:w-[340px] lg:w-[380px]">
                <div className="flex-shrink-0 border-b border-slate-100 bg-white px-4 py-4">
                    <h2 className="text-sm font-bold text-slate-800">Applicants</h2>
                    <p className="mt-0.5 text-xs text-slate-400">{applicants.length} total</p>
                </div>

                <ApplicantsFilterBar />

                <div className="flex-1 overflow-y-auto">
                    <ApplicantsList applicants={applicants} selectedId={selected?.id ?? null} />
                </div>
            </div>

            <div className="hidden flex-1 flex-col overflow-y-auto bg-slate-50/50 md:flex">
                <ApplicantDetails applicant={selected} jobSkills={jobSkills} />
            </div>
        </div>
    );
}