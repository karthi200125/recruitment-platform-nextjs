'use client';

import { useRouter } from "next/navigation";
import { Crown, Briefcase, TrendingUp, ArrowRight, AlertCircle } from "lucide-react";
import Link from "next/link";
import CreateJobForm from "@/app/Forms/CreateJobForm";

type Props = {
  userId: number;
  role: "RECRUITER" | "ORGANIZATION";
  features: {
    MAX_ACTIVE_JOBS: number;
    JOBS_PER_MONTH?: number;
  };
  usage: {
    activeJobs: number;
    monthlyJobs: number;
  };
  isBlocked: boolean;
  job?: any;
  isEdit?: boolean;
};

function UsageStat({ label, used, max }: { label: string; used: number; max: number }) {
  const pct = Math.min((used / max) * 100, 100);
  const isNearLimit = pct >= 80;
  const isAtLimit = used >= max;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-slate-600">{label}</span>
        <span className={`font-bold ${isAtLimit ? "text-red-600" : isNearLimit ? "text-amber-600" : "text-slate-700"}`}>
          {used} / {max}
        </span>
      </div>
      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${isAtLimit ? "bg-red-500" : isNearLimit ? "bg-amber-500" : "bg-indigo-500"}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export default function CreateJobClient({ features, usage, isBlocked, job, isEdit = false }: Props) {
  const router = useRouter();

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-7">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">{isEdit ? "Edit Job" : "Post a Job"}</h1>
          <p className="text-sm text-slate-400 mt-0.5">
            {isEdit ? "Update your job listing details." : "Fill in the details to publish your listing."}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Briefcase className="w-5 h-5 text-indigo-500" strokeWidth={1.75} />
        </div>
      </div>

      {/* Usage card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <TrendingUp className="w-4 h-4 text-slate-500" strokeWidth={1.75} />
          <h3 className="text-sm font-bold text-slate-800">Your Usage</h3>
        </div>

        <UsageStat
          label="Active Jobs"
          used={usage.activeJobs}
          max={features.MAX_ACTIVE_JOBS}
        />
        {"JOBS_PER_MONTH" in features && features.JOBS_PER_MONTH != null && (
          <UsageStat
            label="Jobs This Month"
            used={usage.monthlyJobs}
            max={features.JOBS_PER_MONTH}
          />
        )}

        <p className="text-[11px] text-slate-400">
          Upgrade to Pro for unlimited active listings and higher monthly limits.{" "}
          <Link href="/subscription" className="text-indigo-600 font-semibold hover:underline underline-offset-2">
            View plans →
          </Link>
        </p>
      </div>

      {/* Blocked state */}
      {isBlocked ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 overflow-hidden">
          <div className="h-1 w-full bg-gradient-to-r from-red-400 to-orange-400" />
          <div className="p-6 space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-5 h-5 text-red-500" strokeWidth={2} />
              </div>
              <div>
                <p className="text-base font-bold text-slate-800 mb-1">Posting limit reached</p>
                <p className="text-sm text-slate-500 leading-relaxed">
                  You've reached the maximum number of active jobs or monthly postings for your current plan. Upgrade to continue posting.
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/subscription"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors duration-200 shadow-sm shadow-indigo-200"
              >
                <Crown className="w-4 h-4" strokeWidth={2} />
                Upgrade to Pro
              </Link>
              <button
                onClick={() => router.push("/dashboard")}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors duration-200"
              >
                Back to Dashboard
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Job form card */
        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
          <div className="h-1 w-full bg-gradient-to-r from-indigo-500 to-violet-500" />
          <div className="p-6 sm:p-8">
            <CreateJobForm job={job} isEdit={isEdit} />
          </div>
        </div>
      )}
    </div>
  );
}