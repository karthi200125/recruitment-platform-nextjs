"use client";

import { useCallback, useMemo, useState, useTransition } from "react";
import { useDispatch } from "react-redux";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { userProjectAction } from "@/actions/user/user-projects-action";
import Button from "@/components/Button";
import CustomFormField from "@/components/CustomFormField";
import { Form } from "@/components/ui/form";
import FormError from "@/components/ui/FormError";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useCustomToast } from "@/lib/CustomToast";
import { UserProjectSchema } from "@/lib/SchemaTypes";
import { closeModal } from "@/store/ModalSlice";
import { Project } from "@/types";
import { UploadFile } from "../upload/UploadFile";
import { ProjectCardProject } from "@/app/(public)/userProfile/project/ProjectCard";

type FormValues = z.infer<typeof UserProjectSchema>;

interface UserProjectProps {
    isEdit?: boolean;
    project?: ProjectCardProject;
    onSuccess?: (project: Project) => void;
    onClose?: () => void;
}

export function UserProjectForm({
    isEdit = false,
    project,
    onSuccess,
    onClose,
}: UserProjectProps) {
    const { user } = useCurrentUser();
    const dispatch = useDispatch();
    const queryClient = useQueryClient();

    const { showErrorToast, showSuccessToast } = useCustomToast();

    const [isPending, startTransition] = useTransition();

    const [error, setError] = useState("");

    const [projectImage, setProjectImage] = useState(
        project?.proImage ?? ""
    );

    const [projectImagePublicId, setProjectImagePublicId] = useState(
        project?.proImagePublicId ?? ""
    );

    const form = useForm<FormValues>({
        resolver: zodResolver(UserProjectSchema),
        mode: "onChange",
        defaultValues: {
            proName: project?.proName ?? "",
            proDesc: project?.proDesc ?? "",
            proLink: project?.proLink ?? "",
        },
    });

    const resetForm = useCallback(() => {
        form.reset();

        setProjectImage("");
        setProjectImagePublicId("");
        setError("");
    }, [form]);

    const invalidateQueries = useCallback(async () => {
        if (!user?.id) return;

        await Promise.all([
            queryClient.invalidateQueries({
                queryKey: ["getUserProjects", user.id],
            }),
            queryClient.invalidateQueries({
                queryKey: ["getuser", user.id],
            }),
        ]);
    }, [queryClient, user?.id]);

    const handleSuccess = useCallback(
        async (projectData: Project, message: string) => {
            showSuccessToast(message);

            await invalidateQueries();

            resetForm();

            onSuccess?.(projectData);
            onClose?.();

            dispatch(
                closeModal(
                    isEdit
                        ? "projectEditModal"
                        : "userProjectModal"
                )
            );
        },
        [
            dispatch,
            invalidateQueries,
            isEdit,
            onClose,
            onSuccess,
            resetForm,
            showSuccessToast,
        ]
    );

    const onSubmit = useCallback(
        (values: FormValues) => {
            if (isPending) return;

            if (!user?.id) {
                showErrorToast("User not found.");
                return;
            }

            setError("");

            startTransition(async () => {
                const result = await userProjectAction(
                    values,
                    user.id,
                    projectImage,
                    projectImagePublicId,
                    isEdit,
                    project?.id
                );

                if ("error" in result) {
                    setError(result.error);
                    showErrorToast(result.error);
                    return;
                }

                await handleSuccess(result.data, result.success);
            });
        },
        [
            handleSuccess,
            isEdit,
            isPending,            
            project?.id,
            projectImage,
            projectImagePublicId,
            showErrorToast,
            user?.id,
        ]
    );

    const isSubmitDisabled = useMemo(
        () =>
            isPending ||
            !form.formState.isValid ||
            !projectImage ||
            !projectImagePublicId,
        [
            isPending,
            form.formState.isValid,
            projectImage,
            projectImagePublicId,
        ]
    );

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
            >
                <CustomFormField
                    form={form}
                    name="proName"
                    label="Project Title"
                    placeholder="Ex: Ecommerce Website"
                    isLoading={isPending}
                />

                <CustomFormField
                    form={form}
                    name="proLink"
                    label="Project Link"
                    placeholder="Ex: https://example.com"
                    isLoading={isPending}
                />

                <CustomFormField
                    form={form}
                    name="proDesc"
                    label="Project Description"
                    placeholder="Tell users about your project..."
                    isTextarea
                    isLoading={isPending}
                />

                <UploadFile
                    type="project-image"
                    existingFile={
                        projectImage
                            ? {
                                url: projectImage,
                                name: project?.proName ?? "Project Image",
                                publicId: projectImagePublicId,
                            }
                            : undefined
                    }
                    disabled={isPending}
                    onUploadSuccess={(file) => {
                        setProjectImage(file.url);
                        setProjectImagePublicId(file.publicId);
                    }}
                    onUploadError={(message) => {
                        setError(message);
                        showErrorToast(message);
                    }}
                    onRemove={() => {
                        setProjectImage("");
                        setProjectImagePublicId("");
                    }}
                    onReplace={() => {
                        setProjectImage("");
                        setProjectImagePublicId("");
                    }}
                    onDelete={() => {
                        setProjectImage("");
                        setProjectImagePublicId("");
                    }}
                />

                <FormError message={error} />

                <Button
                    type="submit"
                    className="!w-full"
                    isLoading={isPending}
                    disabled={isSubmitDisabled}
                >
                    {isEdit ? "Update Project" : "Add Project"}
                </Button>
            </form>
        </Form>
    );
}