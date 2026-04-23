"use client";

import React, { useMemo } from "react";
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import Model from "@/components/Model/Model";
import moment from "moment";
import Image from "next/image";
import { CgCalendarDates } from "react-icons/cg";
import { FaSuitcase, FaListCheck } from "react-icons/fa6";
import { IoIosMore } from "react-icons/io";
import EasyApply from "./EasyApply/EasyApply";
import { VscLinkExternal } from "react-icons/vsc";
import noImage from "../../../../public/noImage.webp";
import JobTitlesSkeleton from "@/Skeletons/JobTitlesSkeleton";
import Link from "next/link";
import SaveJobButton from "@/components/SaveJobButton";

import { Job, Company, JobApplication } from "@prisma/client";
import { checkSkills } from "@/actions/job/CompareSkills";

// TYPES
type JobWithRelations = Job & {
  jobApplications: JobApplication[];
};

type User = {
  id: number;
  role: "CANDIDATE" | "RECRUITER" | "ORGANIZATION";
  skills?: string[];
};

interface JobTitlesProps {
  user: User;
  job: JobWithRelations;
  company: Company;
  isPending: boolean;
  safeSearchParams?: Record<string, string | string[] | undefined>;
}

const JobTitles: React.FC<JobTitlesProps> = ({
  user,
  job,
  company,
  isPending,
  safeSearchParams,
}) => {
  // ✅ Skill Matching (NO API CALL)
  const skillResult = useMemo(() => {
    if (!user || !job) return null;
    return checkSkills(user, job);
  }, [user, job]);

  const percentage = Math.min(skillResult?.percentage ?? 0, 100);
  const matchedSkills = skillResult?.matchedSkills ?? [];
  const missingSkills = skillResult?.missingSkills ?? [];

  // ✅ Check if already applied
  const isApplied = useMemo(() => {
    if (!user) return false;
    return job.jobApplications?.some(
      (application) => application.userId === user.id
    );
  }, [job.jobApplications, user]);

  if (isPending) {
    return <JobTitlesSkeleton />;
  }

  return (
    <div className="space-y-5">
      {/* Company */}
      <div className="flex justify-between items-center">
        <Link
          href={`/userProfile/${company.id}`}
          className="flex items-center gap-2"
        >
          <Image
            src={company.companyImage || noImage.src}
            alt="Company Logo"
            width={30}
            height={30}
            className="w-[20px] h-[20px]"
          />
          <h5 className="text-sm font-bold">{company.companyName}</h5>
        </Link>
        <Icon icon={<IoIosMore size={25} />} title="More" isHover />
      </div>

      {/* Job Info */}
      <div className="space-y-3">
        <h2 className="capitalize">{job.jobTitle}</h2>

        <h4 className="text-[var(--textBlur)]">
          {job.city}, {job.state}, {job.country}.{" "}
          {moment(job.createdAt).fromNow()} (
          {job.jobApplications?.length || 0} applicants)
        </h4>

        <div className="flex gap-3 items-center">
          <FaSuitcase size={20} />
          <span className="bg-neutral-200 px-3 rounded">{job.mode}</span>
          <span className="bg-neutral-200 px-3 rounded">{job.type}</span>
        </div>

        <div className="flex gap-3 items-center">
          <CgCalendarDates size={25} />
          <span className="bg-neutral-200 px-3 rounded">
            {company.companyTotalEmployees} Employees
          </span>
        </div>

        {/* ✅ SKILL MATCH UI (ONLY FOR CANDIDATE) */}
        {user?.role === "CANDIDATE" && skillResult && (
          <div className="flex gap-3 items-start">
            <FaListCheck size={20} />

            <div className="text-sm">
              <div>
                <b>{percentage}% match</b>
              </div>

              {matchedSkills.length > 0 && (
                <div className="text-green-500">
                  ✓ {matchedSkills.slice(0, 3).join(", ")}
                </div>
              )}

              {missingSkills.length > 0 && (
                <div className="text-orange-400">
                  Missing: {missingSkills.slice(0, 3).join(", ")}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 mt-5">
          {isApplied ? (
            <Button className="bg-green-100 !text-green-500">
              Applied
            </Button>
          ) : (
            user?.role !== "ORGANIZATION" && (
              <>
                {job.isEasyApply ? (
                  <Model
                    bodyContent={
                      <EasyApply
                        job={job}
                        safeSearchParams={safeSearchParams}
                      />
                    }
                    title={`Apply to ${company.companyName}`}
                    modalId="easyapplyModal"
                  >
                    <Button>Easy Apply</Button>
                  </Model>
                ) : (
                  <Button
                    onClick={() =>
                      job.applyLink &&
                      window.open(job.applyLink, "_blank")
                    }
                    icon={<VscLinkExternal size={15} />}
                  >
                    Apply
                  </Button>
                )}

                {/* Save Job */}
                {user?.id && (
                  <SaveJobButton userId={user.id} jobId={job.id} />
                )}
              </>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default JobTitles;