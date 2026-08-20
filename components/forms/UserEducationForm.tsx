"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useDispatch } from "react-redux";

import { userEducationAction } from "@/actions/user/user-education-action";
import Button from "@/components/Button";
import CustomFormField from "@/components/CustomFormField";
import { Form } from "@/components/ui/form";
import FormError from "@/components/ui/FormError";

import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useCustomToast } from "@/lib/CustomToast";

import {
    education_levels,
    fields_of_study,
} from "@/lib/data/lp-nav-links-data";

import { UserEducationSchema } from "@/lib/SchemaTypes";
import { closeModal } from "@/store/ModalSlice";
import { Education } from "@/types";

interface EducationProps {
    education?: Education;
    edit?: boolean;
}

interface EducationActionResponse {
    success?: string;
    error?: string;
}

const ADD_EDUCATION_MODAL_ID = "userEduModal";
const EDIT_EDUCATION_MODAL_ID = "userEditEduModal";

export function UserEducationForm({
    education,
    edit = false,
}: EducationProps) {
    const { user } = useCurrentUser();

    const [isLoading, startTransition] =
        useTransition();

    const [err, setErr] = useState("");

    const { showSuccessToast, showErrorToast } =
        useCustomToast();

    const dispatch = useDispatch();
    const router = useRouter();

    const form = useForm<
        z.infer<typeof UserEducationSchema>
    >({
        resolver: zodResolver(
            UserEducationSchema
        ),

        defaultValues: {
            instituteName: edit
                ? education?.instituteName ?? ""
                : "",

            degree: edit
                ? education?.degree ?? ""
                : "",

            fieldOfStudy: edit
                ? education?.fieldOfStudy ?? ""
                : "",

            startDate: edit
                ? education?.startDate ?? ""
                : "",

            endDate: edit
                ? education?.endDate ?? ""
                : "",

            percentage: edit
                ? education?.percentage ?? ""
                : "",
        },
    });

    const onSubmit = (
        values: z.infer<
            typeof UserEducationSchema
        >
    ) => {
        if (isLoading) {
            return;
        }

        if (!user?.id) {
            setErr("User not found.");
            return;
        }

        setErr("");

        startTransition(async () => {
            try {
                const userId = Number(user.id);

                const result: EducationActionResponse =
                    await userEducationAction(
                        values,
                        userId,
                        edit,
                        education?.id
                    );

                if (result.error) {
                    setErr(result.error);
                    showErrorToast(result.error);
                    return;
                }

                if (!result.success) {
                    const message =
                        "Something went wrong.";

                    setErr(message);
                    showErrorToast(message);
                    return;
                }

                /*
                 * Database update succeeded.
                 *
                 * Refresh the current route so
                 * Server Components receive the
                 * latest education data.
                 */
                router.refresh();

                /*
                 * Show success feedback.
                 */
                showSuccessToast(
                    result.success
                );

                /*
                 * Close ONLY the modal that opened
                 * this form.
                 */
                dispatch(
                    closeModal(
                        edit
                            ? EDIT_EDUCATION_MODAL_ID
                            : ADD_EDUCATION_MODAL_ID
                    )
                );
            } catch (error) {
                console.error(
                    "[USER_EDUCATION]",
                    error
                );

                const message =
                    "Failed to save education.";

                setErr(message);
                showErrorToast(message);
            }
        });
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(
                    onSubmit
                )}
                className="space-y-4"
            >
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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

                <Button
                    type="submit"
                    isLoading={isLoading}
                    className="!w-full"
                >
                    {edit
                        ? "Edit Education"
                        : "Add Education"}
                </Button>
            </form>
        </Form>
    );
}