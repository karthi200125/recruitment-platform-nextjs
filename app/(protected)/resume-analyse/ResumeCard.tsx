import { ExternalLink, FileText } from "lucide-react";

export function ResumeCard({ resume }: { resume: string }) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex h-full items-center gap-5">
                <div className="flex h-28 w-20 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
                    <FileText className="h-9 w-9 text-indigo-500" />
                </div>

                <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Current Resume
                    </p>

                    <h2 className="mt-1 truncate text-base font-bold text-slate-900">
                        My Resume.pdf
                    </h2>

                    <p className="mt-2 text-sm leading-5 text-slate-500">
                        This is the resume currently stored on your profile.
                    </p>

                    <a
                        href={resume}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 inline-flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-xs font-semibold text-indigo-600 transition hover:bg-indigo-50"
                    >
                        View Resume
                        <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                </div>
            </div>
        </div>
    );
}