"use client";

import { useDispatch } from "react-redux";
import { useCurrentUser } from "@/hooks/useCurrentUser";

import { UserEducationForm } from "@/app/Forms/UserEducationForm";
import DeleteEducationForm from "@/app/Forms/DeleteEducationForm";
import { openModal } from "@/app/Redux/ModalSlice";

import Button from "@/components/Button";
import Icon from "@/components/Icon";
import Model from "@/components/Model/Model";

import EducationsSkeleton from "@/Skeletons/EducationsSkeleton";

import { GoPlus } from "react-icons/go";
import { LuPencil } from "react-icons/lu";
import { CiTrash } from "react-icons/ci";

import Image from "next/image";
import noImage from "../../../public/noImage.webp";

interface Education {
    id: number;
    instituteName: string;
    degree: string;
    fieldOfStudy: string;
    startDate: string;
    endDate: string;
    percentage: string;
}

interface EducationsProps {
    educations?: Education[];
    isLoading?: boolean;
    profileUserId?: number;
}

const Educations = ({
    educations = [],
    isLoading = false,
    profileUserId,
}: EducationsProps) => {
    const dispatch = useDispatch();
    const { user } = useCurrentUser();

    const isCurrentUser = user?.id === profileUserId;

    return (
        <section className="relative w-full min-h-[100px] rounded-[20px] border p-5 space-y-5">

            {/* HEADER */}
            <div className="flex items-center justify-between">
                <h3 className="font-bold">Education</h3>

                {isCurrentUser && (
                    <Model
                        bodyContent={<UserEducationForm />}
                        modalId="userEduModal"
                        title="Add your Education"
                        className="min-w-[300px] lg:w-[1000px]"
                    >
                        <Button
                            variant="border"
                            onClick={() => dispatch(openModal("userEduModal"))}
                            icon={<GoPlus size={20} />}
                        >
                            Add
                        </Button>
                    </Model>
                )}
            </div>

            {/* LOADING */}
            {isLoading && <EducationsSkeleton />}

            {/* EMPTY */}
            {!isLoading && educations.length === 0 && (
                <p className="text-sm text-neutral-400">
                    No education added yet.
                </p>
            )}

            {/* DATA */}
            {!isLoading &&
                educations.map((edu) => {
                    const editId = `edit-edu-${edu.id}`;
                    const deleteId = `delete-edu-${edu.id}`;

                    return (
                        <div
                            key={edu.id}
                            className="relative flex gap-5 items-start min-h-[100px]"
                        >
                            <Image
                                src={noImage.src}
                                alt="education"
                                width={50}
                                height={50}
                                className="bg-neutral-200"
                            />

                            <div>
                                <h4 className="font-bold capitalize">
                                    {edu.instituteName}
                                </h4>

                                <h5 className="capitalize">
                                    {edu.degree} in {edu.fieldOfStudy}
                                </h5>

                                <h5 className="text-[var(--lighttext)]">
                                    {edu.startDate} - {edu.endDate}
                                </h5>

                                <h5>Grade: {edu.percentage}%</h5>
                            </div>

                            {/* ACTIONS */}
                            {isCurrentUser && (
                                <div className="absolute right-3 top-3 flex gap-4">

                                    {/* EDIT */}
                                    <Model
                                        bodyContent={
                                            <UserEducationForm education={edu} edit />
                                        }
                                        modalId={editId}
                                        title="Edit Education"
                                        className="lg:w-[1000px]"
                                    >
                                        <Icon
                                            icon={<LuPencil size={20} />}
                                            isHover
                                            onClick={() =>
                                                dispatch(openModal(editId))
                                            }
                                        />
                                    </Model>

                                    {/* DELETE */}
                                    <Model
                                        bodyContent={
                                            <DeleteEducationForm edu={edu} />
                                        }
                                        modalId={deleteId}
                                        title="Delete Education"
                                        className="w-[400px]"
                                    >
                                        <Icon
                                            icon={<CiTrash size={20} />}
                                            isHover
                                            onClick={() =>
                                                dispatch(openModal(deleteId))
                                            }
                                        />
                                    </Model>
                                </div>
                            )}
                        </div>
                    );
                })}
        </section>
    );
};

export default Educations;