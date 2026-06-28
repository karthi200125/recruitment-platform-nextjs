"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { userProjectAction } from "@/actions/user/user-projects-action";
import Button from "@/components/Button";
import CustomFormField from "@/components/CustomFormField";
import { Form } from "@/components/ui/form";
import FormError from "@/components/ui/FormError";
import { useCustomToast } from "@/lib/CustomToast";
import { UserProjectSchema } from "@/lib/SchemaTypes";
import { closeModal } from "@/store/ModalSlice";
import { Project } from "@/types";
import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useState, useTransition } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useCurrentUser } from "@/hooks/useCurrentUser";

interface UserProjectProps {
    isEdit?: boolean;
    project?: Project;
}

export function UserProjectForm({ isEdit, project }: UserProjectProps) {
    const { user } = useCurrentUser()
    const [isLoading, startTransition] = useTransition();
    const queryClient = useQueryClient();

    const [err, setErr] = useState("")
    const dispatch = useDispatch()
    const [file, setFile] = useState<File | null>(null);
    const [showImage, setShowImage] = useState<string | null>(project?.proImage || null);
    const { showErrorToast, showSuccessToast } = useCustomToast();
    // const { per, UploadFile, downloadUrl } = useUpload({ file });

    const form = useForm<z.infer<typeof UserProjectSchema>>({
        resolver: zodResolver(UserProjectSchema),
        defaultValues: {
            proName: isEdit ? project?.proName : "",
            proDesc: isEdit ? project?.proDesc : "",
            proLink: isEdit ? project?.proLink : "",
        },
    });

    // const handleImageUpload = useCallback((e: any) => {
    //     const selectedFile = e.target.files?.[0];
    //     if (selectedFile) {
    //         setFile(selectedFile);
    //         const newImage = URL.createObjectURL(selectedFile);
    //         if (newImage !== showImage) {
    //             setShowImage(newImage);
    //         }
    //     }
    // }, [showImage]);

    // useEffect(() => {
    //     // UploadFile();
    // }, [file])


    const onSubmit = (values: z.infer<typeof UserProjectSchema>) => {
        startTransition(() => {
            const userId = user?.id
            const proId = project?.id
            // const proImage = downloadUrl

            userProjectAction(values, userId, isEdit, proId, '')
                .then((data) => {
                    if (data?.success) {
                        showSuccessToast(data?.success)
                        queryClient.invalidateQueries({ queryKey: ['getUserProjects', userId] })
                        queryClient.invalidateQueries({ queryKey: ['getuser', userId] })
                        dispatch(closeModal(isEdit ? "projectEditModal" : 'userProjectModal'))
                    }
                    if (data?.error) {
                        setErr(data?.error)
                    }
                })
        });
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <CustomFormField
                    name="proName"
                    form={form}
                    label="Project Title"
                    placeholder="Ex : Eccommerce Website"
                    isLoading={isLoading}
                />
                <CustomFormField
                    name="proLink"
                    form={form}
                    label="Project Link"
                    placeholder="Ex : https://exmaple.com"
                    isLoading={isLoading}
                />
                <CustomFormField
                    name="proDesc"
                    form={form}
                    label="Project Description"
                    placeholder="Ex : somthing about project"
                    isLoading={isLoading}
                    isTextarea
                />

                <div className="relative h-[200px] rounded-lg border overflow-hidden bg-gray-100">
                    <Image
                        src={showImage || ''}
                        alt="User profile"
                        fill
                        className="w-full h-full object-cover bg-neutral-100 absolute top-0 left-0"
                    />
                    <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        id="imageupload"
                    // onChange={handleImageUpload}
                    />
                    <label
                        htmlFor="imageupload"
                        className="absolute top-0 left-0 w-full h-full opacity-70 z-10 flex items-center justify-center cursor-pointer transition bg-black"
                    >
                        <div className="space-y-3 text-center">
                            <img src="" alt="" />
                            <h3 className="text-blue-400 z-10">Select Image</h3>
                        </div>
                    </label>
                </div>
                {/* {per !== null && (
                    <div className="space-y-3">
                        <h3>{downloadUrl ? "Completed" : "Uploading..."}</h3>
                        <Progress value={Number(per)} className="w-full" />
                    </div>
                )} */}

                <FormError message={err} />
                <Button isLoading={isLoading} className="!w-full">
                    {isEdit ? "Edit Project" : "Add Project"}
                </Button>
            </form>
        </Form>
    );
}
