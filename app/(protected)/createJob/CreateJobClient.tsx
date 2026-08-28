"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowRight,
  Briefcase,
  Crown,
  TrendingUp,
} from "lucide-react";

import CreateJobForm from "@/components/forms/CreateJobForm";
import type {
  Company,
  JobWithCompany,
} from "@/types";
import { Role } from "@prisma/client";

interface CreateJobClientProps {
  userId: number;
  role: Role;

  features: {
    MAX_ACTIVE_JOBS: number;
    JOBS_PER_MONTH?: number;
  };

  recruiterCompany: Company | null;

  usage: {
    activeJobs: number;
    monthlyJobs: number;
  };

  isBlocked: boolean;

  job?: JobWithCompany | null;

  isEdit?: boolean;
}

interface UsageStatProps {
  label: string;
  used: number;
  max: number;
}

function UsageStat({
  label,
  used,
  max,
}: UsageStatProps) {
  const pct = Math.min((used / max) * 100, 100);

  const isNearLimit = pct >= 80;

  const isAtLimit = used >= max;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-slate-600">
          {label}
        </span>

        <span
          className={`font-bold ${isAtLimit
            ? "text-red-600"
            : isNearLimit
              ? "text-amber-600"
              : "text-slate-700"
            }`}
        >
          {used} / {max}
        </span>
      </div>

      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full transition-all duration-500 ${isAtLimit
            ? "bg-red-500"
            : isNearLimit
              ? "bg-amber-500"
              : "bg-indigo-500"
            }`}
          style={{
            width: `${pct}%`,
          }}
        />
      </div>
    </div>
  );
}

export default function CreateJobClient({
  features,
  usage,
  recruiterCompany,
  isBlocked,
  job,
  isEdit = false,
}: CreateJobClientProps) {
  const router = useRouter();

  return (
    <div className="mx-auto w-full max-w-5xl space-y-7 px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            {isEdit ? "Edit Job" : "Post a Job"}
          </h1>

          <p className="mt-0.5 text-sm text-slate-400">
            {isEdit
              ? "Update your job listing details."
              : "Fill in the details to publish your listing."}
          </p>
        </div>

        <div className="flex flex-shrink-0 items-center gap-2">
          <Briefcase
            className="h-5 w-5 text-indigo-500"
            strokeWidth={1.75}
          />
        </div>
      </div>

      {/* Usage */}
      <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5">
        <div className="mb-1 flex items-center gap-2">
          <TrendingUp
            className="h-4 w-4 text-slate-500"
            strokeWidth={1.75}
          />

          <h3 className="text-sm font-bold text-slate-800">
            Your Usage
          </h3>
        </div>

        <UsageStat
          label="Active Jobs"
          used={usage.activeJobs}
          max={features.MAX_ACTIVE_JOBS}
        />

        {features.JOBS_PER_MONTH !== undefined && (
          <UsageStat
            label="Jobs This Month"
            used={usage.monthlyJobs}
            max={features.JOBS_PER_MONTH}
          />
        )}

        <p className="text-[11px] text-slate-400">
          Upgrade to Pro for unlimited active listings and higher
          monthly limits.{" "}
          <Link
            href="/subscriptions"
            className="font-semibold text-indigo-600 hover:underline"
          >
            View plans →
          </Link>
        </p>
      </div>

      {isBlocked ? (
        <div className="overflow-hidden rounded-2xl border border-red-200 bg-red-50">
          <div className="h-1 w-full bg-gradient-to-r from-red-400 to-orange-400" />

          <div className="space-y-4 p-6">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-red-100">
                <AlertCircle
                  className="h-5 w-5 text-red-500"
                  strokeWidth={2}
                />
              </div>

              <div>
                <p className="mb-1 text-base font-bold text-slate-800">
                  Posting limit reached
                </p>

                <p className="text-sm leading-relaxed text-slate-500">
                  You&apos;ve reached the maximum number of active jobs
                  or monthly postings for your current plan.
                  Upgrade to continue posting.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/subscriptions"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-indigo-200 transition-colors duration-200 hover:bg-indigo-500"
              >
                <Crown className="h-4 w-4" />
                Upgrade to Pro
              </Link>

              <button
                onClick={() => router.push("/dashboard")}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition-colors duration-200 hover:bg-slate-50"
              >
                Back to Dashboard

                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="h-1 w-full bg-gradient-to-r from-indigo-500 to-violet-500" />

          <div className="p-6 sm:p-8">
            <CreateJobForm
              job={job}
              isEdit={isEdit}
              recruiterCompany={recruiterCompany}
            />
          </div>
        </div>
      )}
    </div>
  );
}