"use client";

import Image from "next/image";
import { useTransition } from "react";
import { useDispatch } from "react-redux";

import { deleteProject } from "@/actions/user/delete-project";
import Button from "@/components/Button";
import { useCustomToast } from "@/lib/CustomToast";
import { closeModal } from "@/store/ModalSlice";

import { Project } from "@/types";

import noImage from "@/public/noImage.webp";

interface DeleteProjectFormProps {
    project: any;
    userId: number | undefined;
}

interface DeleteProjectResponse {
    success?: string;
    error?: string;
}

const DELETE_MODAL_ID = "deleteProjectModal";

const DeleteProjectForm = ({
    project,
}: DeleteProjectFormProps) => {
    const [isLoading, startTransition] =
        useTransition();

    const dispatch = useDispatch();
    const {
        showSuccessToast,
        showErrorToast,
    } = useCustomToast();

    const handleDelete = () => {
        if (isLoading) {
            return;
        }

        startTransition(async () => {
            try {
                const result: DeleteProjectResponse =
                    await deleteProject(project.id);

                if (result.success) {
                    showSuccessToast(
                        result.success
                    );

                    dispatch(
                        closeModal(
                            DELETE_MODAL_ID
                        )
                    );

                    return;
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
            }
        });
    };

    return (
        <div className="w-full space-y-5">
            <div className="flex min-h-[100px] flex-row items-start gap-5">
                <div className="relative h-24 w-32 shrink-0 overflow-hidden rounded-md bg-neutral-200">
                    <Image
                        src={
                            project.proImage ||
                            noImage
                        }
                        alt={project.proName}
                        fill
                        sizes="128px"
                        className="object-cover"
                    />
                </div>

                <div className="min-w-0 flex-1 space-y-1">
                    <h4 className="font-bold capitalize">
                        {project.proName}
                    </h4>

                    {project.proLink && (
                        <p className="break-all text-sm text-blue-500">
                            {project.proLink}
                        </p>
                    )}

                    {project.proDesc && (
                        <p className="line-clamp-3 text-sm text-neutral-500">
                            {project.proDesc}
                        </p>
                    )}
                </div>
            </div>

            <div className="rounded-lg border border-red-100 bg-red-50 px-4 py-3">
                <p className="text-sm text-red-700">
                    This action cannot be undone.
                </p>
            </div>

            <Button
            type='submit'
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