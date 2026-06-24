"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { userEducationAction } from "@/actions/user/user-education-action";
import Button from "@/components/Button";
import CustomFormField from "@/components/CustomFormField";
import { Form } from "@/components/ui/form";
import FormError from "@/components/ui/FormError";
import { useCustomToast } from "@/lib/CustomToast";
import { UserEducationSchema } from "@/lib/SchemaTypes";
import { useQueryClient } from "@tanstack/react-query";
import { useParams, usePathname } from "next/navigation";
import { useState, useTransition } from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeModal } from "@/store/ModalSlice";
import { education_levels, fields_of_study } from "@/lib/data/lp-nav-links-data";

interface EducationProps {
    education?: any,
    edit?: boolean,
}

export function UserEducationForm({ education, edit }: EducationProps) {
    const user = useSelector((state: any) => state.user.user);
    const [isLoading, startTransition] = useTransition();
    const [err, setErr] = useState("")
    const { showSuccessToast } = useCustomToast()
    const queryClient = useQueryClient();
    const pathname = usePathname()
    const dispatch = useDispatch()

    const { userId } = useParams()
    const id = Number(userId)

    const form = useForm<z.infer<typeof UserEducationSchema>>({
        resolver: zodResolver(UserEducationSchema),
        defaultValues: {
            instituteName: edit ? education?.instituteName : "",
            degree: edit ? education?.degree : "",
            fieldOfStudy: edit ? education?.fieldOfStudy : "",
            startDate: edit ? education?.startDate : "",
            endDate: edit ? education?.endDate : "",
            percentage: edit ? education?.percentage : "",
        },
    });

    const onSubmit = (values: z.infer<typeof UserEducationSchema>) => {
        startTransition(() => {
            const userId = user?.id
            const eduId = education?.id
            const isEdit = edit ? true : false

            userEducationAction(values, userId, isEdit, eduId)
                .then((data: any) => {
                    if (data?.success) {
                        showSuccessToast(data?.success)
                        queryClient.invalidateQueries({ queryKey: ['getuserEducation', id] })
                        dispatch(closeModal(isEdit ? 'userEditEduModal' : 'userEduModal'))
                    }
                    if (data?.error) {
                        setErr(data?.error)
                    }
                })
        })
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <CustomFormField
                        name="instituteName"
                        form={form}
                        label="Institute Name"
                        placeholder="Institute Name"
                        isLoading={isLoading}
                    />
                    <CustomFormField
                        name="degree"
                        form={form}
                        label="Degree"
                        placeholder="Degree"
                        isLoading={isLoading}
                        isSelect
                        options={education_levels}
                    />
                    <CustomFormField
                        name="fieldOfStudy"
                        form={form}
                        label="Field of Study"
                        placeholder="Field of Study"
                        isLoading={isLoading}
                        isSelect
                        options={fields_of_study}
                    />
                    <CustomFormField
                        name="percentage"
                        form={form}
                        label="Percentage"
                        placeholder="Percentage"
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

                <FormError message={err} />
                <Button isLoading={isLoading} className="!w-full" >
                    {pathname === '/welcome' ? "Next" :
                        edit ? "Edit Education" : "Add Education"}
                </Button>
            </form>
        </Form>
    );
}
