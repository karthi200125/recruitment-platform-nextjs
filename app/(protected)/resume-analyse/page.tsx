import { getMyResume } from "@/actions/ai/resume/get-my-resume";
import ResumeAnalyseClient from "./ResumeAnalyseClient";

export default async function ResumeAnalysePage() {
    const result = await getMyResume();

    if (!result.success) {
        return (
            <div className="w-full">
                <div className="rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm text-red-700">
                    {result.error || "Unable to load your resume."}
                </div>
            </div>
        );
    }

    return (
        <ResumeAnalyseClient
            resume={result.data?.resume ?? null}
        />
    );
}