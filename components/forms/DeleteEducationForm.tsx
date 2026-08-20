"use client";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useTransition } from "react";
import { useDispatch } from "react-redux";

import { deleteEducation } from "@/actions/user/delete-education";
import Button from "@/components/Button";
import { useCustomToast } from "@/lib/CustomToast";
import { closeModal } from "@/store/ModalSlice";
import { Education } from "@/types";

import noImage from "@/public/noImage.webp";

interface DeleteEducationFormProps {
    edu: Education;
}

interface DeleteEducationResponse {
    success?: string;
    error?: string;
}

const DeleteEducationForm = ({
    edu,
}: DeleteEducationFormProps) => {
    const router = useRouter()
    const [isLoading, startTransition] = useTransition();
    const dispatch = useDispatch();    
    const { showSuccessToast, showErrorToast } = useCustomToast();
    const params = useParams();
    const userId = Number(params.userId);

    const handleDelete = () => {
        startTransition(async () => {
            try {
                const result: DeleteEducationResponse =
                    await deleteEducation(
                        edu.id
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
                    "[DELETE_EDUCATION]",
                    error
                );

                showErrorToast(
                    "Failed to delete education."
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
                    alt={edu.instituteName}
                    width={50}
                    height={50}
                    className="bg-neutral-200"
                />

                <div>
                    <h4 className="font-bold capitalize">
                        {edu.instituteName}
                    </h4>

                    <h5 className="capitalize">
                        {edu.degree} in{" "}
                        {edu.fieldOfStudy}
                    </h5>

                    <h5 className="capitalize text-[var(--lighttext)]">
                        {edu.startDate} -{" "}
                        {edu.endDate}
                    </h5>

                    <h5>
                        Grade :{" "}
                        {edu.percentage}%
                    </h5>
                </div>
            </div>

            <Button
                className="mt-4 w-full"
                isLoading={isLoading}
                onClick={handleDelete}
            >
                Delete Education
            </Button>
        </div>
    );
};

export default DeleteEducationForm;