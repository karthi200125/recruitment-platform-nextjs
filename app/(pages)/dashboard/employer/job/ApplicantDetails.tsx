"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, XCircle, FileText, MessageSquare, User, Loader2 } from "lucide-react";
import { updateApplicationStatus } from "@/actions/jobapplication/updateApplicationStatus";
import { getStatusConfig } from "./ApplicantList";

export type ApplicationStatus = "APPLIED" | "VIEWED" | "SHORTLISTED" | "REJECTED";

interface QnA {
  id: string | number;
  question: string;
  answer: string;
}

interface Application {
  id: number;
  status: ApplicationStatus;
  candidateResume?: string | null;
  questionAndAnswers?: Record<string, QnA>;
  user: {
    username: string;
    email?: string;
    image?: string | null;
  };
}

interface ApplicantDetailsProps {
  application: Application | null;
}

export function ApplicantDetailsSkeleton() {
  return (
    <div className="p-6 sm:p-8 space-y-6 animate-pulse">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-slate-200 flex-shrink-0" />
        <div className="flex-1 space-y-2 pt-1">
          <div className="h-5 w-1/2 rounded-xl bg-slate-200" />
          <div className="h-3.5 w-1/3 rounded-lg bg-slate-100" />
          <div className="h-6 w-24 rounded-full bg-slate-100 mt-1" />
        </div>
      </div>
      <div className="h-px bg-slate-100" />
      <div className="h-[360px] rounded-2xl bg-slate-100" />
      <div className="rounded-2xl border border-slate-200 p-5 space-y-4">
        <div className="h-4 w-24 rounded bg-slate-200" />
        {[1, 2].map((i) => (
          <div key={i} className="space-y-1.5">
            <div className="h-3.5 w-3/4 rounded bg-slate-200" />
            <div className="h-3 w-full rounded bg-slate-100" />
            <div className="h-3 w-5/6 rounded bg-slate-100" />
          </div>
        ))}
      </div>
    </div>
  );
}

function UserAvatar({ name, image, size = "lg" }: { name: string; image?: string | null; size?: "sm" | "lg" }) {
  const initials = name.slice(0, 2).toUpperCase();
  const cls = size === "lg"
    ? "w-12 h-12 text-sm"
    : "w-9 h-9 text-xs";
  if (image) {
    return <img src={image} alt={name} className={`${cls} rounded-full object-cover border border-slate-200 flex-shrink-0`} />;
  }
  return (
    <div className={`${cls} rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center font-bold text-indigo-600 flex-shrink-0`}>
      {initials}
    </div>
  );
}

export default function ApplicantDetails({ application }: ApplicantDetailsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [localStatus, setLocalStatus] = useState<ApplicationStatus | null>(application?.status ?? null);

  useEffect(() => {
    setLocalStatus(application?.status ?? null);
  }, [application]);

  // Auto-mark as viewed
  useEffect(() => {
    if (application && application.status === "APPLIED") {
      updateApplicationStatus(application.id, "VIEWED")
        .then(() => {
          setLocalStatus("VIEWED");
          router.refresh();
        })
        .catch((err) => console.error("Auto viewed failed", err));
    }
  }, [application, router]);

  const handleUpdate = async (status: ApplicationStatus) => {
    if (!application || loading) return;
    const previous = localStatus;
    try {
      setLoading(true);
      setLocalStatus(status);
      await updateApplicationStatus(application.id, status);
      router.refresh();
    } catch (err) {
      console.error(err);
      setLocalStatus(previous);
    } finally {
      setLoading(false);
    }
  };

  // Empty state
  if (!application || !localStatus) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 text-center px-8">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center">
          <User className="w-7 h-7 text-slate-300" strokeWidth={1.5} />
        </div>
        <div>
          <p className="text-base font-semibold text-slate-700 mb-1">Select a candidate</p>
          <p className="text-sm text-slate-400 max-w-xs leading-relaxed">
            Click any applicant on the left to review their profile and resume.
          </p>
        </div>
      </div>
    );
  }

  const config = getStatusConfig(localStatus);
  const StatusIcon = config.icon;
  const qnaEntries = application.questionAndAnswers
    ? Object.values(application.questionAndAnswers)
    : [];

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-2xl">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <UserAvatar name={application.user.username} image={application.user.image} />
          <div>
            <h2 className="text-lg font-bold text-slate-900">{application.user.username}</h2>
            {application.user.email && (
              <p className="text-sm text-slate-400 mt-0.5">{application.user.email}</p>
            )}
            <span className={`inline-flex items-center gap-1.5 mt-2 text-xs font-semibold px-3 py-1 rounded-full border ${config.bg} ${config.text} ${config.border}`}>
              {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <StatusIcon className="w-3.5 h-3.5" strokeWidth={2} />}
              {loading ? "Updating..." : config.label}
            </span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => handleUpdate("SHORTLISTED")}
            disabled={loading || localStatus === "SHORTLISTED"}
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
          >
            <CheckCircle2 className="w-3.5 h-3.5" strokeWidth={2} />
            Shortlist
          </button>
          <button
            onClick={() => handleUpdate("REJECTED")}
            disabled={loading || localStatus === "REJECTED"}
            className="inline-flex items-center gap-1.5 rounded-xl bg-red-50 border border-red-200 px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
          >
            <XCircle className="w-3.5 h-3.5" strokeWidth={2} />
            Reject
          </button>
        </div>
      </div>

      <div className="h-px bg-slate-100" />

      {/* Resume */}
      {application.candidateResume ? (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <FileText className="w-4 h-4 text-slate-500" strokeWidth={1.75} />
            <h3 className="text-sm font-bold text-slate-800">Resume</h3>
          </div>
          <div className="rounded-2xl border border-slate-200 overflow-hidden">
            <iframe
              src={application.candidateResume}
              className="w-full h-[400px]"
              title="Candidate Resume"
            />
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-5 py-6">
          <FileText className="w-5 h-5 text-slate-300" strokeWidth={1.5} />
          <p className="text-sm text-slate-400">No resume uploaded by this candidate.</p>
        </div>
      )}

      {/* Q&A */}
      {qnaEntries.length > 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-slate-100">
            <MessageSquare className="w-4 h-4 text-slate-500" strokeWidth={1.75} />
            <h3 className="text-sm font-bold text-slate-800">Screening Answers</h3>
            <span className="ml-auto text-xs text-slate-400">{qnaEntries.length} question{qnaEntries.length !== 1 ? "s" : ""}</span>
          </div>
          <div className="divide-y divide-slate-100">
            {qnaEntries.map((item) => (
              <div key={item.id} className="px-5 py-4">
                <p className="text-xs font-semibold text-slate-700 mb-1.5">{item.question}</p>
                <p className="text-sm text-slate-500 leading-relaxed">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}