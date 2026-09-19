"use client";

import { formatDistanceToNow } from "date-fns";
import {
  Briefcase,
  Clock,
  ExternalLink,
  MapPin,
  MoreHorizontal,
  Timer,
  Users,
  Zap
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import Model from "@/components/Model";
import SaveJobButton from "@/components/SaveJobButton";
import JobTitlesSkeleton from "@/components/skeletons/JobTitlesSkeleton";

import AIJobMatch from "./AIJobMatch";
import EasyApply from "./EasyApply/EasyApply";

import type { FilteredJob, JobWithAI } from "@/actions/job/get-filter-all-jobs";
import type { SearchParams } from "@/types";
import type { Question } from "@/types/easyApply";

interface JobTitlesProps {
  user: any;
  job: JobWithAI;
  company: FilteredJob["company"];
  isPending: boolean;
  safeSearchParams?: SearchParams;
  isAIMatching: boolean;
  isAIError: boolean;
}

const MODE_STYLES: Record<string, string> = {
  remote:
    "bg-emerald-50 text-emerald-700 border-emerald-200",
  hybrid:
    "bg-violet-50 text-violet-700 border-violet-200",
  onsite:
    "bg-amber-50 text-amber-700 border-amber-200",
  on_site:
    "bg-amber-50 text-amber-700 border-amber-200",
};

const JobTitles = ({
  user,
  job,
  company,
  isPending,
  isAIMatching,
  isAIError,
}: JobTitlesProps) => {
  if (isPending) {
    return <JobTitlesSkeleton />;
  }

  const modeLower = (job.mode ?? "")
    .toLowerCase()
    .replace(/\s+/g, "_");

  const modeBadge =
    MODE_STYLES[modeLower] ??
    "bg-slate-100 text-slate-600 border-slate-200";

  const applicantCount =
    job._count?.jobApplications ?? 0;

  const aiMatch = job.aiMatch;

  return (
    <div className="space-y-5">
      {/* Company */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Link
            href={`/userProfile/${company?.id}`}
            className="flex-shrink-0"
          >
            <div className="h-8 w-8 overflow-hidden rounded-lg border border-slate-200 bg-white">
              <Image
                src={
                  company?.companyImage ||
                  "/noImage.webp"
                }
                alt={
                  company?.companyName ?? "Company"
                }
                width={40}
                height={40}
                sizes="40px"
                className="h-full w-full object-contain"
              />
            </div>
          </Link>

          <Link
            href={`/userProfile/${company?.userId}`}
            className="text-sm font-semibold text-slate-700 transition-colors duration-200 hover:text-indigo-600"
          >
            {company?.companyName ?? "Company"}
          </Link>
        </div>

        <button
          type="button"
          aria-label="More options"
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-colors duration-200 hover:bg-slate-100"
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>

      {/* Job title / meta */}
      <div>
        <h1 className="mb-2 text-xl font-bold leading-snug text-slate-900 capitalize">
          {job.jobTitle}
        </h1>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-slate-500">
          {(job.city || job.state) && (
            <span className="flex items-center gap-1.5">
              <MapPin
                className="h-3.5 w-3.5 flex-shrink-0"
                strokeWidth={2}
              />

              {[
                job.city,
                job.state,
                job.country,
              ]
                .filter(Boolean)
                .join(", ")}
            </span>
          )}

          <span className="flex items-center gap-1.5">
            <Clock
              className="h-3.5 w-3.5 flex-shrink-0"
              strokeWidth={2}
            />

            {formatDistanceToNow(
              new Date(job.createdAt),
              {
                addSuffix: true,
              }
            )}
          </span>

          <span className="flex items-center gap-1.5">
            <Users
              className="h-3.5 w-3.5 flex-shrink-0"
              strokeWidth={2}
            />

            {applicantCount} applicants
          </span>
        </div>
      </div>

      {/* Job badges */}
      <div className="flex flex-wrap gap-2">
        {job.mode && (
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold capitalize ${modeBadge}`}
          >
            <Briefcase
              className="h-3 w-3"
              strokeWidth={2}
            />

            {job.mode}
          </span>
        )}

        {job.type && (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600 capitalize">
            <Timer
              className="h-3 w-3"
              strokeWidth={2}
            />

            {job.type}
          </span>
        )}

        {company?.companyTotalEmployees && (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">
            <Users
              className="h-3 w-3"
              strokeWidth={2}
            />

            {company.companyTotalEmployees} employees
          </span>
        )}
      </div>

      {/* AI Match */}
      <AIJobMatch result={aiMatch} />

      {/* Apply / Save */}
      {user ? (
        <div className="flex flex-wrap gap-3 pt-1">
          {user?.role !== "ORGANIZATION" && (
            <>
              {/* Easy Apply */}
              {job.isEasyApply ? (
                <Model
                  bodyContent={
                    <EasyApply
                      job={{
                        id: job.id,
                        jobTitle: job.jobTitle,
                        questions:
                          (job.questions ??
                            []) as unknown as Question[],
                      }}
                    />
                  }
                  title={`Apply to ${company?.companyName}`}
                  modalId="easyapplyModal"
                  className="max-w-5xl"
                >
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-indigo-200 transition-colors duration-200 hover:bg-indigo-500"
                  >
                    <Zap
                      className="h-4 w-4"
                      strokeWidth={2}
                    />

                    Easy Apply
                  </button>
                </Model>
              ) : (
                /* External Apply */
                <button
                  type="button"
                  onClick={() => {
                    if (job.applyLink) {
                      window.open(
                        job.applyLink,
                        "_blank",
                        "noopener,noreferrer"
                      );
                    }
                  }}
                  className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-indigo-200 transition-colors duration-200 hover:bg-indigo-500"
                >
                  Apply

                  <ExternalLink
                    className="h-3.5 w-3.5"
                    strokeWidth={2}
                  />
                </button>
              )}

              {/* Save */}
              {user?.id && (
                <SaveJobButton
                  userId={user.id}
                  jobId={job.id}
                />
              )}
            </>
          )}
        </div>
      ) : (
        /* Not signed in */
        <div className="flex max-w-max items-center gap-2 rounded-xl border border-indigo-200 bg-amber-50 px-3 py-2.5">
          <p className="text-xs text-indigo-700">
            <span className="font-semibold">
              Signin
            </span>{" "}
            users can only apply jobs.{" "}

            <Link
              href="/signin"
              className="underline underline-offset-2 transition-colors hover:text-indigo-800"
            >
              SignIn
            </Link>
          </p>
        </div>
      )}
    </div>
  );
};

export default JobTitles;