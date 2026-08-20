"use client";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useTransition } from "react";
import { useDispatch } from "react-redux";

import { deleteExperience } from "@/actions/user/delete-experience";
import Button from "@/components/Button";
import { useCustomToast } from "@/lib/CustomToast";
import { closeModal } from "@/store/ModalSlice";
import { Experience } from "@/types";

import noImage from "@/public/noImage.webp";

interface DeleteExperienceFormProps {
    exp: Experience;
}

interface DeleteExperienceResponse {
    success?: string;
    error?: string;
}

const DeleteExperienceForm = ({
    exp,
}: DeleteExperienceFormProps) => {
    const [isLoading, startTransition] =
        useTransition();

    const dispatch = useDispatch();
    const router = useRouter()    

    const { showSuccessToast, showErrorToast } =
        useCustomToast();

    const params = useParams();

    const userId = Number(params.userId);

    const handleDelete = () => {
        startTransition(async () => {
            try {
                const result: DeleteExperienceResponse =
                    await deleteExperience(
                        exp.id
                    );

                if (result.success) {
                    router.refresh()
                    showSuccessToast(
                        result.success
                    );                    
                }

                if (result.error) {
                    showErrorToast(
                        result.error
                    );
                }
            } catch (error) {
                console.error(
                    "[DELETE_EXPERIENCE]",
                    error
                );

                showErrorToast(
                    "Failed to delete experience."
                );
            } finally {
                dispatch(
                    closeModal(
                        "userDeleteExpModal"
                    )
                );
            }
        });
    };

    return (
        <div className="w-full">
            <div className="relative flex min-h-[100px] flex-row items-start gap-5">
                <Image
                    src={noImage}
                    alt={exp.companyName}
                    width={50}
                    height={50}
                    className="bg-neutral-200 object-cover"
                />

                <div>
                    <h4 className="font-bold capitalize">
                        {exp.companyName}
                    </h4>

                    <h5 className="capitalize">
                        {exp.position}
                    </h5>

                    <h5 className="capitalize text-[var(--lighttext)]">
                        {exp.startDate} -{" "}
                        {exp.endDate}
                    </h5>

                    {exp.description && (
                        <h5>
                            {exp.description}
                        </h5>
                    )}
                </div>
            </div>

            <Button
                className="mt-4 w-full"
                isLoading={isLoading}
                onClick={handleDelete}
            >
                Delete Experience
            </Button>
        </div>
    );
};

export default DeleteExperienceForm;