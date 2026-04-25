'use client';

import React, { useMemo } from "react";
import moment from "moment";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin, Clock, Users, Briefcase, Timer,
  CheckCircle2, AlertCircle, ExternalLink,
  MoreHorizontal, Zap, ListChecks
} from "lucide-react";

import Model from "@/components/Model/Model";
import EasyApply from "./EasyApply/EasyApply";
import JobTitlesSkeleton from "@/Skeletons/JobTitlesSkeleton";
import SaveJobButton from "@/components/SaveJobButton";

import noImage from "../../../../public/noImage.webp";
import { checkSkills } from "@/actions/job/CompareSkills";
import { JobWithCompany } from "@/actions/job/getFilterAllJobs";

type Role = 'CANDIDATE' | 'RECRUITER' | 'ORGANIZATION';

interface User {
  id: number;
  role: Role;
  skills?: string[];
}

interface JobTitlesProps {
  user: User | null | undefined;
  job: JobWithCompany;
  company: JobWithCompany["company"] | undefined;
  isPending: boolean;
  safeSearchParams?: Record<string, string | string[] | undefined>;
}

const MODE_STYLES: Record<string, string> = {
  remote: "bg-emerald-50 text-emerald-700 border-emerald-200",
  hybrid: "bg-violet-50 text-violet-700 border-violet-200",
  onsite: "bg-amber-50 text-amber-700 border-amber-200",
  on_site: "bg-amber-50 text-amber-700 border-amber-200",
};

const JobTitles: React.FC<JobTitlesProps> = ({ user, job, company, isPending, safeSearchParams }) => {
  const skillResult = useMemo(() => {
    if (!user || !job) return null;
    return checkSkills(user, job);
  }, [user, job]);

  const percentage = Math.min(skillResult?.percentage ?? 0, 100);
  const matchedSkills = skillResult?.matchedSkills ?? [];
  const missingSkills = skillResult?.missingSkills ?? [];

  const isApplied = useMemo(() => {
    if (!user || !job.jobApplications) return false;
    return job.jobApplications.some((app) => app.userId === user.id);
  }, [job.jobApplications, user]);

  if (isPending) return <JobTitlesSkeleton />;

  const modeLower = (job.mode ?? "").toLowerCase().replace(" ", "_");
  const modeBadge = MODE_STYLES[modeLower] ?? "bg-slate-100 text-slate-600 border-slate-200";

  return (
    <div className="space-y-5">

      {/* Company row */}
      <div className="flex items-center justify-between">
        <Link href={`/userProfile/${company?.id}`} className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg overflow-hidden border border-slate-200 flex-shrink-0 bg-white">
            <Image
              src={company?.companyImage || noImage}
              alt={company?.companyName ?? "Company"}
              width={32} height={32}
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-sm font-semibold text-slate-700 group-hover:text-indigo-600 transition-colors duration-200">
            {company?.companyName ?? "Company"}
          </span>
        </Link>
        <button aria-label="More options" className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors duration-200">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* Title + meta */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 capitalize leading-snug mb-2">{job.jobTitle}</h1>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-slate-500">
          {(job.city || job.state) && (
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 flex-shrink-0" strokeWidth={2} />
              {[job.city, job.state, job.country].filter(Boolean).join(", ")}
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 flex-shrink-0" strokeWidth={2} />
            {moment(job.createdAt).fromNow()}
          </span>
          <span className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 flex-shrink-0" strokeWidth={2} />
            {job.jobApplications?.length ?? 0} applicants
          </span>
        </div>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-2">
        {job.mode && (
          <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border capitalize ${modeBadge}`}>
            <Briefcase className="w-3 h-3" strokeWidth={2} />{job.mode}
          </span>
        )}
        {job.type && (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border bg-slate-50 text-slate-600 border-slate-200 capitalize">
            <Timer className="w-3 h-3" strokeWidth={2} />{job.type}
          </span>
        )}
        {company?.companyTotalEmployees && (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border bg-slate-50 text-slate-600 border-slate-200">
            <Users className="w-3 h-3" strokeWidth={2} />{company.companyTotalEmployees} employees
          </span>
        )}
      </div>

      {/* Skill match */}
      {user?.role === "CANDIDATE" && skillResult && (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <ListChecks className="w-4 h-4 text-slate-500" strokeWidth={1.75} />
              <span className="text-sm font-semibold text-slate-700">Skill Match</span>
            </div>
            <span className={`text-sm font-bold ${percentage >= 70 ? "text-emerald-600" : percentage >= 40 ? "text-amber-600" : "text-red-500"}`}>
              {percentage}%
            </span>
          </div>
          <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${percentage >= 70 ? "bg-emerald-500" : percentage >= 40 ? "bg-amber-500" : "bg-red-400"}`}
              style={{ width: `${percentage}%` }}
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {matchedSkills.slice(0, 4).map((skill) => (
              <span key={skill} className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                <CheckCircle2 className="w-2.5 h-2.5" strokeWidth={3} />{skill}
              </span>
            ))}
            {missingSkills.slice(0, 3).map((skill) => (
              <span key={skill} className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                <AlertCircle className="w-2.5 h-2.5" strokeWidth={3} />{skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-3 pt-1">
        {isApplied ? (
          <div className="inline-flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 px-5 py-2.5 text-sm font-semibold text-emerald-700">
            <CheckCircle2 className="w-4 h-4" strokeWidth={2} />Applied
          </div>
        ) : (
          user?.role !== "ORGANIZATION" && (
            <>
              {job.isEasyApply ? (
                <Model
                  bodyContent={<EasyApply job={job} safeSearchParams={safeSearchParams} />}
                  title={`Apply to ${company?.companyName}`}
                  modalId="easyapplyModal"
                >
                  <button className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors duration-200 shadow-sm shadow-indigo-200">
                    <Zap className="w-4 h-4" strokeWidth={2} />Easy Apply
                  </button>
                </Model>
              ) : (
                <button
                  onClick={() => job.applyLink && window.open(job.applyLink, "_blank")}
                  className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors duration-200 shadow-sm shadow-indigo-200"
                >
                  Apply<ExternalLink className="w-3.5 h-3.5" strokeWidth={2} />
                </button>
              )}
              {user?.id && <SaveJobButton userId={user.id} jobId={job.id} />}
            </>
          )
        )}
      </div>
    </div>
  );
};

export default JobTitles;