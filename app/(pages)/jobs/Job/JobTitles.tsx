'use client';

import React, { useMemo, useTransition } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import { SavedJobAction } from "../../../../actions/user/SavedJobAction";
// import { userSavedJobs } from "@/app/Redux/AuthSlice";
import noImage from "../../../../public/noImage.webp";
import JobTitlesSkeleton from "@/Skeletons/JobTitlesSkeleton";
import { useQuery } from "@tanstack/react-query";
import { checkSkills } from "@/actions/job/CompareSkills";
import { openModal } from "@/app/Redux/ModalSlice";
import Link from "next/link";

const JobTitles = ({ job, company, isPending , safeSearchParams }: any) => {
    const user = useSelector((state: any) => state.user?.user);
    const dispatch = useDispatch();
    const [isLoading, startTransition] = useTransition();

    const isSaved = useMemo(() => user?.savedJobs.includes(job?.id), [user?.savedJobs, job?.id]);

    const HandleSaveJob = () => {
        startTransition(() => {
            const jobId = job?.id;
            const userId = user?.id;
            SavedJobAction(userId, jobId).then((data: any) => {
                if (data?.success) {
                    dispatch(userSavedJobs(jobId));
                } else if (data?.error) {
                    console.error(data?.error);
                }
            });
        });
    };

    const { data } = useQuery({
        queryKey: ["getSkillsPer", user, job],
        queryFn: async () => checkSkills(user, job),
    });

    const Per = data?.per || 0;
    const message = data?.Msg;
    const isApplied = useMemo(
        () => job?.jobApplications?.some((application: any) => application?.userId === user?.id),
        [job?.jobApplications, user?.id]
    );

    if (isPending) {
        return <JobTitlesSkeleton />;
    }

    return (
        <div className="space-y-5">
            {/* Company Info */}
            <div className="flex flex-row items-center justify-between">
                <Link href={`/userProfile/${company?.id}`} className="flex flex-row items-center gap-2">
                    <Image
                        src={company?.companyImage || noImage.src}
                        alt="Company Logo"
                        width={30}
                        height={30}
                        className="w-[20px] h-[20px]"
                    />
                    <h5 className="text-sm font-bold">{company?.companyName}</h5>
                </Link>
                <Icon icon={<IoIosMore size={25} />} title="More" tooltipbg="white" isHover />
            </div>

            {/* Job Details */}
            <div className="space-y-3">
                <h2 className="capitalize">{job?.jobTitle}</h2>
                <h4 className="text-[var(--textBlur)]">
                    {job?.city}, {job?.state}, {job?.country}. {moment(job?.createdAt).fromNow()} (
                    {job?.jobApplications?.length || 0} applicants)
                </h4>

                {/* Job Mode and Type */}
                <div className="flex flex-row gap-3 items-center">
                    <FaSuitcase size={20} />
                    <h5 className="bg-neutral-200 p-1 rounded-[5px] flexcenter px-3">{job?.mode}</h5>
                    <h5 className="bg-neutral-200 p-1 rounded-[5px] flexcenter px-3">{job?.type}</h5>
                </div>

                {/* Employees */}
                <div className="flex flex-row gap-3 items-center">
                    <CgCalendarDates size={25} />
                    <h5 className="bg-neutral-200 p-1 rounded-[5px] flexcenter px-3">
                        {company?.companyTotalEmployees} Employees
                    </h5>
                </div>

                {/* Skills Match */}
                <div className="flex flex-row gap-3 items-start md:items-center">
                    <FaListCheck size={20} />
                    <h5>
                        <b>{Per}%</b> skills matched your profile -{" "}
                        <span className={Per > 70 ? "text-green-400" : "text-orange-400"}>{message}</span>
                    </h5>
                </div>

                {/* Premium Feature */}
                <Link href={'/dashboard?'} className="flex flex-row gap-3 items-start md:items-center">
                    <HiLightBulb size={25} />
                    <h5 className={`${user?.isPro && "underline hover:opacity-50 trans cursor-pointer"}`}>
                        See how you compare to over {job?.jobApplications?.length || 0} other applicants.{" "}
                        {!user?.isPro &&
                            <span className="protext trans hover:opacity-50 cursor-pointer font-bold">Activate Premium</span>
                        }
                    </h5>
                </Link>

                {/* Action Buttons */}
                <div className="flex flex-row items-center gap-3 mt-5">
                    {isApplied ? (
                        <Button className="bg-green-100 !text-green-500">Applied</Button>
                    ) : (
                        user?.role !== "ORGANIZATION" &&
                        <>
                            {job?.isEasyApply ? (
                                <Model
                                    bodyContent={<EasyApply job={job} safeSearchParams={safeSearchParams}/>}
                                    title={`Apply to ${company?.companyName || "Company"}`}
                                    className="w-full md:w-[1000px]"
                                    modalId="easyapplyModal"
                                    desc={`For ${job?.jobTitle || "this Job"} Post`}
                                >
                                    <Button onClick={() => dispatch(openModal('easyapplyModal'))}>Easy Apply</Button>
                                </Model>
                            ) : (
                                <Button
                                    onClick={() => job?.applyLink && window.open(job.applyLink, '_blank')}
                                    icon={<VscLinkExternal size={15} />}
                                >
                                    Apply on Company Site
                                </Button>

                            )}
                            <Button
                                onClick={HandleSaveJob}
                                className={`${isSaved ? "!bg-black !text-white" : "!text-black !bg-white border"}`}
                                isLoading={isLoading}
                            >
                                {isSaved ? "Unsave" : "Save"}
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default JobTitles;
