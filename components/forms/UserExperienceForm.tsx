"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { userExperienceAction } from "@/actions/user/user-experience-action";
import Button from "@/components/Button";
import CustomFormField from "@/components/CustomFormField";
import { Form } from "@/components/ui/form";
import FormError from "@/components/ui/FormError";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useCustomToast } from "@/lib/CustomToast";
import { UserExperienceSchema } from "@/lib/SchemaTypes";
import { closeModal } from "@/store/ModalSlice";
import { Experience } from "@/types";
import { useParams, useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useDispatch } from "react-redux";

interface ExperienceProps {
    experience?: Experience,
    edit?: boolean,
}


export function UserExperienceForm({ experience, edit }: ExperienceProps) {
    const { user } = useCurrentUser()
    const [isLoading, startTransition] = useTransition();
    const [err, setErr] = useState("")
    const router = useRouter()

    const { showErrorToast, showSuccessToast } = useCustomToast()
    const dispatch = useDispatch()

    const { userId } = useParams()
    const id = Number(userId)

    const form = useForm<z.infer<typeof UserExperienceSchema>>({
        resolver: zodResolver(UserExperienceSchema),
        defaultValues: {
            companyName: edit ? experience?.companyName : "",
            position: edit ? experience?.position : "",
            startDate: edit ? experience?.startDate : "",
            endDate: edit ? experience?.endDate : "",
            description: experience?.description ?? "",
        },
    });

    const onSubmit = (values: z.infer<typeof UserExperienceSchema>) => {
        startTransition(() => {
            const userId = user?.id
            const expId = experience?.id
            const isEdit = edit ? true : false

            if (!userId) {
                setErr("User not found.");
                return;
            }

            userExperienceAction(values, userId, isEdit, expId)
                .then((data: any) => {
                    if (data.success) {
                        router.refresh()
                        showSuccessToast(data?.success)
                        dispatch(closeModal(isEdit ? 'userEditExpModal' : 'userExpModal'))
                    }
                    if (data.error) {
                        setErr(data?.error)
                        showErrorToast(data.error);
                    }
                })
        })
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <CustomFormField
                        name="companyName"
                        form={form}
                        label="Company Name"
                        placeholder="Company Name"
                        isLoading={isLoading}
                    />
                    <CustomFormField
                        name="position"
                        form={form}
                        label="Job Position"
                        placeholder="Job Position"
                        isLoading={isLoading}
                    />
                    <CustomFormField
                        name="startDate"
                        form={form}
                        label="Start Date"
                        placeholder="Start Date"
                        isLoading={isLoading}
                    />

                    <CustomFormField
                        name="endDate"
                        form={form}
                        label="End Date"
                        placeholder="End Date"
                        isLoading={isLoading}
                    />


                </div>
                <CustomFormField
                    isTextarea
                    name="description"
                    form={form}
                    label="About Your Previous Job"
                    placeholder="Description"
                    isLoading={isLoading}
                />

                <FormError message={err} />
                <Button type='submit' isLoading={isLoading} className="!w-full" >Add Experience</Button>
            </form>
        </Form>
    );
}
