"use client";

import React, { useMemo } from "react";
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import Model from "@/components/Model/Model";
import moment from "moment";
import Image from "next/image";
import { CgCalendarDates } from "react-icons/cg";
import { FaSuitcase, FaListCheck } from "react-icons/fa6";
import { HiLightBulb } from "react-icons/hi";
import { IoIosMore } from "react-icons/io";
import EasyApply from "./EasyApply/EasyApply";
import { VscLinkExternal } from "react-icons/vsc";
import noImage from "../../../../public/noImage.webp";
import JobTitlesSkeleton from "@/Skeletons/JobTitlesSkeleton";
import { useQuery } from "@tanstack/react-query";
import { checkSkills } from "@/actions/job/CompareSkills";
import Link from "next/link";
import { useSession } from "next-auth/react";
import SaveJobButton from "@/components/SaveJobButton";

import { Job, Company, JobApplication } from "@prisma/client";

// ✅ TYPES
type JobWithRelations = Job & {
    jobApplications: JobApplication[];
};

type User = {
    id: number;
    role: "CANDIDATE" | "RECRUITER" | "ORGANIZATION";
    isPro?: boolean;
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


    const { data } = useQuery({
        queryKey: ["getSkillsPer", user?.id, job.id],
        queryFn: async () => checkSkills(user, job),
        enabled: !!user && !!job,
    });

    const Per = data?.per ?? 0;
    const message = data?.Msg;

    // ✅ Proper typed logic
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
                    <span className="bg-neutral-200 px-3 rounded">
                        {job.mode}
                    </span>
                    <span className="bg-neutral-200 px-3 rounded">
                        {job.type}
                    </span>
                </div>

                <div className="flex gap-3 items-center">
                    <CgCalendarDates size={25} />
                    <span className="bg-neutral-200 px-3 rounded">
                        {company.companyTotalEmployees} Employees
                    </span>
                </div>

                <div className="flex gap-3 items-center">
                    <FaListCheck size={20} />
                    <span>
                        <b>{Per}%</b> skills matched -{" "}
                        <span
                            className={
                                Per > 70 ? "text-green-400" : "text-orange-400"
                            }
                        >
                            {message}
                        </span>
                    </span>
                </div>

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

                                {/* ✅ CLEAN SAVE BUTTON */}
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
            </div>
        </div>
    );
};

export default JobTitles;