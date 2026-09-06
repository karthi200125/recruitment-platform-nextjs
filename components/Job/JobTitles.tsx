"use client";

import { formatDistanceToNow } from "date-fns";
import {
  Briefcase,
  CheckCircle2,
  Clock,
  ExternalLink,
  MapPin,
  MoreHorizontal,
  Timer,
  Users,
  Zap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";

import Model from "@/components/Model";
import SaveJobButton from "@/components/SaveJobButton";
import JobTitlesSkeleton from "@/components/skeletons/JobTitlesSkeleton";

import EasyApply from "./EasyApply/EasyApply";
import AIJobMatch from "./AIJobMatch";

import { FilteredJob } from "@/actions/job/get-filter-all-jobs";
import { SearchParams } from "@/types";
import { Question } from "@/types/easyApply";

interface JobTitlesProps {
  user: any;
  job: FilteredJob;
  company: FilteredJob["company"];
  isPending: boolean;
  safeSearchParams?: SearchParams;
  isAIError: boolean,
  isAIMatching: boolean,
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
  safeSearchParams,
  isAIMatching,
  isAIError
}: JobTitlesProps) => {
  /*
   * ---------------------------------------------------------
   * Applied status
   * ---------------------------------------------------------
   */

  const isApplied = useMemo(() => {
    if (!user || !job.jobApplications) {
      return false;
    }

    return job.jobApplications.some(
      (app) => app.userId === user.id
    );
  }, [job.jobApplications, user]);

  /*
   * ---------------------------------------------------------
   * Loading
   * ---------------------------------------------------------
   */

  if (isPending) {
    return <JobTitlesSkeleton />;
  }

  /*
   * ---------------------------------------------------------
   * Job mode badge
   * ---------------------------------------------------------
   */

  const modeLower = (job.mode ?? "")
    .toLowerCase()
    .replace(/\s+/g, "_");

  const modeBadge =
    MODE_STYLES[modeLower] ??
    "bg-slate-100 text-slate-600 border-slate-200";

  /*
   * ---------------------------------------------------------
   * AI MATCH
   *
   * IMPORTANT:
   *
   * We DO NOT call Gemini here.
   *
   * getFilteredJobs() already fetched the AI result
   * and attached it to:
   *
   * job.aiMatch
   *
   * So this component only displays it.
   * ---------------------------------------------------------
   */

  const aiMatch = job.aiMatch;

  return (
    <div className="space-y-5">

      {/* ===================================================== */}
      {/* Company row */}
      {/* ===================================================== */}

      <div className="flex items-center justify-between">

        <div className="flex items-center gap-2.5">

          <Link
            href={`/userProfile/${company?.id}`}
            className="flex-shrink-0"
          >
            <div className="w-8 h-8 rounded-lg overflow-hidden border border-slate-200 bg-white">
              <Image
                src={
                  company?.companyImage ||
                  "/noImage.webp"
                }
                alt={
                  company?.companyName ??
                  "Company"
                }
                width={40}
                height={40}
                sizes="40px"
                className="w-full h-full object-contain"
              />
            </div>
          </Link>

          <Link
            href={`/userProfile/${company?.userId}`}
            className="text-sm font-semibold text-slate-700 hover:text-indigo-600 transition-colors duration-200"
          >
            {company?.companyName ??
              "Company"}
          </Link>

        </div>

        <button
          type="button"
          aria-label="More options"
          className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors duration-200"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>

      </div>


      {/* ===================================================== */}
      {/* Title + meta */}
      {/* ===================================================== */}

      <div>

        <h1 className="text-xl font-bold text-slate-900 capitalize leading-snug mb-2">
          {job.jobTitle}
        </h1>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-slate-500">

          {(job.city || job.state) && (
            <span className="flex items-center gap-1.5">

              <MapPin
                className="w-3.5 h-3.5 flex-shrink-0"
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
              className="w-3.5 h-3.5 flex-shrink-0"
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
              className="w-3.5 h-3.5 flex-shrink-0"
              strokeWidth={2}
            />

            {job.jobApplications?.length ??
              0}{" "}
            applicants

          </span>

        </div>

      </div>


      {/* ===================================================== */}
      {/* Job badges */}
      {/* ===================================================== */}

      <div className="flex flex-wrap gap-2">

        {job.mode && (
          <span
            className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border capitalize ${modeBadge}`}
          >
            <Briefcase
              className="w-3 h-3"
              strokeWidth={2}
            />

            {job.mode}
          </span>
        )}

        {job.type && (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border bg-slate-50 text-slate-600 border-slate-200 capitalize">
            <Timer
              className="w-3 h-3"
              strokeWidth={2}
            />

            {job.type}
          </span>
        )}

        {company?.companyTotalEmployees && (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border bg-slate-50 text-slate-600 border-slate-200">

            <Users
              className="w-3 h-3"
              strokeWidth={2}
            />

            {company.companyTotalEmployees}{" "}
            employees

          </span>
        )}

      </div>


      {/* ===================================================== */}
      {/* AI JOB MATCH */}
      {/* ===================================================== */}

      {user?.role === "CANDIDATE" && aiMatch && (
        <AIJobMatch
          result={aiMatch}
          isAIMatching={isAIMatching}
          isAIError={isAIError}
        />
      )}


      {/* ===================================================== */}
      {/* Actions */}
      {/* ===================================================== */}

      {user ? (

        <div className="flex flex-wrap gap-3 pt-1">

          {isApplied ? (

            <div className="inline-flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 px-5 py-2.5 text-sm font-semibold text-emerald-700">

              <CheckCircle2
                className="w-4 h-4"
                strokeWidth={2}
              />

              Applied

            </div>

          ) : (

            user?.role !== "ORGANIZATION" && (

              <>

                {/* Easy Apply */}

                {job.isEasyApply ? (

                  <Model
                    bodyContent={
                      <EasyApply
                        job={{
                          id: job.id,
                          jobTitle:
                            job.jobTitle,
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
                      className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors duration-200 shadow-sm shadow-indigo-200"
                    >

                      <Zap
                        className="w-4 h-4"
                        strokeWidth={2}
                      />

                      Easy Apply

                    </button>

                  </Model>

                ) : (

                  /* External Apply */

                  <button
                    type="button"
                    onClick={() =>
                      job.applyLink &&
                      window.open(
                        job.applyLink,
                        "_blank"
                      )
                    }
                    className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors duration-200 shadow-sm shadow-indigo-200"
                  >

                    Apply

                    <ExternalLink
                      className="w-3.5 h-3.5"
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

            )

          )}

        </div>

      ) : (

        /* =================================================== */
        /* Not signed in */
        /* =================================================== */

        <div className="max-w-max flex items-center gap-2 rounded-xl bg-amber-50 border border-indigo-200 px-3 py-2.5">

          <p className="text-xs text-indigo-700">

            <span className="font-semibold">
              Signin
            </span>{" "}
            users can only apply jobs.{" "}

            <Link
              href="/signin"
              className="underline underline-offset-2 hover:text-indigo-800 transition-colors"
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