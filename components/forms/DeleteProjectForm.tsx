"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import { useTransition } from "react";
import { useDispatch } from "react-redux";
import { useQueryClient } from "@tanstack/react-query";

import { deleteProject } from "@/actions/user/delete-project";
import Button from "@/components/Button";
import { useCustomToast } from "@/lib/CustomToast";
import { closeModal } from "@/store/ModalSlice";

import { Project } from "@/types";

import noImage from "@/public/noImage.webp";

interface DeleteProjectFormProps {
    project: Project;
}

interface DeleteProjectResponse {
    success?: string;
    error?: string;
}

const DeleteProjectForm = ({
    project,
}: DeleteProjectFormProps) => {
    const [isLoading, startTransition] =
        useTransition();

    const dispatch = useDispatch();

    const queryClient =
        useQueryClient();

    const { showSuccessToast, showErrorToast } =
        useCustomToast();

    const params = useParams();

    const userId = Number(params.userId);

    const handleDelete = () => {
        startTransition(async () => {
            try {
                const result: DeleteProjectResponse =
                    await deleteProject(project.id);

                if (result.success) {
                    showSuccessToast(
                        result.success
                    );

                    await Promise.all([
                        queryClient.invalidateQueries({
                            queryKey: [
                                "getUserProjects",
                                userId,
                            ],
                        }),
                        queryClient.invalidateQueries({
                            queryKey: [
                                "getUser",
                                userId,
                            ],
                        }),
                    ]);
                }

                if (result.error) {
                    showErrorToast(
                        result.error
                    );
                }
            } catch (error) {
                console.error(
                    "[DELETE_PROJECT]",
                    error
                );

                showErrorToast(
                    "Failed to delete project."
                );
            } finally {
                dispatch(
                    closeModal(
                        "projectDeleteModal"
                    )
                );
            }
        });
    };

    return (
        <div className="w-full space-y-5">
            <div className="flex min-h-[100px] flex-row items-start gap-5">
                <Image
                    src={
                        project.proImage ??
                        noImage
                    }
                    alt={
                        project.proName
                    }
                    width={50}
                    height={50}
                    className="h-full w-full flex-1 rounded-md bg-neutral-200 object-cover"
                />

                <div className="flex-1 space-y-1">
                    <h4 className="font-bold capitalize">
                        {project.proName}
                    </h4>

                    {project.proLink && (
                        <h6 className="break-all text-blue-500">
                            {project.proLink}
                        </h6>
                    )}

                    <h6 className="line-clamp-2 text-[var(--lighttext)]">
                        {project.proDesc}
                    </h6>
                </div>
            </div>

            <Button
                className="w-full"
                isLoading={isLoading}
                onClick={handleDelete}
            >
                Delete Project
            </Button>
        </div>
    );
};

export default DeleteProjectForm;