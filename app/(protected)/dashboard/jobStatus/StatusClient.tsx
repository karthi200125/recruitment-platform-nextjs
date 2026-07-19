import JobStatusList from "./JobStatusList";
import JobStatusDetails from "./JobStatusDetails";
import { CandidateApplication } from "@/types/candidate-application";

interface StatusClientProps {
    appliedJobs: CandidateApplication[];
    selectedApplication: CandidateApplication | null;
}

export default function StatusClient({ appliedJobs, selectedApplication }: StatusClientProps) {
    return (
        <div className="flex h-[calc(100vh-64px)] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex w-full flex-shrink-0 flex-col overflow-hidden border-r border-slate-100 md:w-[320px] lg:w-[360px]">
                <div className="flex-shrink-0 border-b border-slate-100 bg-white px-4 py-4">
                    <h2 className="text-sm font-bold text-slate-800">My Applications</h2>
                    <p className="mt-0.5 text-xs text-slate-400">{appliedJobs.length} total</p>
                </div>

                <div className="flex-1 overflow-y-auto">
                    <JobStatusList jobs={appliedJobs} />
                </div>
            </div>

            <div className="hidden flex-1 flex-col overflow-y-auto bg-slate-50/50 md:flex">
                <JobStatusDetails application={selectedApplication} />
            </div>
        </div>
    );
}