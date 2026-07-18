"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { UserUpdate } from "@/actions/user/update-user";
import { UserInfoSchema } from "@/lib/SchemaTypes";
import { useCustomToast } from "@/lib/CustomToast";

import Button from "@/components/Button";
import CustomFormField from "@/components/CustomFormField";
import { Form } from "@/components/ui/form";
import FormError from "@/components/ui/FormError";

import { closeModal } from "@/store/ModalSlice";

import UserAbout from "./UserAbout";

import type { UserProfile } from "@/types";

interface Props {
    profileUser?: UserProfile | null;
}

export function UserInfoForm({
    profileUser,
}: Props) {
    const router = useRouter();
    const dispatch = useDispatch();

    const [isPending, startTransition] =useTransition();
    const [err, setErr] = useState("");
    const { showSuccessToast } = useCustomToast();

    const [userAbout, setUserAbout] =
        useState<string>(
            typeof profileUser?.userAbout ===
                "string"
                ? profileUser.userAbout
                : profileUser?.userAbout
                    ? JSON.stringify(
                        profileUser.userAbout
                    )
                    : ""
        );

    const form =
        useForm<
            z.infer<
                typeof UserInfoSchema
            >
        >({
            resolver: zodResolver(
                UserInfoSchema
            ),
            mode: "onChange",
            defaultValues: {
                username:
                    profileUser?.username ??
                    "",
                email:
                    profileUser?.email ??
                    "",
                firstName:
                    profileUser?.firstName ??
                    "",
                lastName:
                    profileUser?.lastName ??
                    "",
                userBio:
                    profileUser?.userBio ??
                    "",
                website:
                    profileUser?.website ??
                    "",
                gender:
                    profileUser?.gender ??
                    "",
                profession:
                    profileUser?.profession ??
                    "",
                phoneNo:
                    profileUser?.phoneNo ??
                    "",
                address:
                    profileUser?.address ??
                    "",
                city:
                    profileUser?.city ??
                    "",
                state:
                    profileUser?.state ??
                    "",
                country:
                    profileUser?.country ??
                    "",
                postalCode:
                    profileUser?.postalCode ??
                    "",
            },
        });

    const onSubmit = (
        values: z.infer<
            typeof UserInfoSchema
        >
    ) => {
        setErr("");

        startTransition(async () => {
            const res =
                await UserUpdate(
                    values,
                    userAbout
                );

            if (res.error) {
                setErr(res.error);
                return;
            }

            showSuccessToast(
                res.success ??
                "Profile updated successfully."
            );

            router.refresh();

            dispatch(
                closeModal(
                    "userInfoFormModal"
                )
            );
        });
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(
                    onSubmit
                )}
                className="space-y-5"
            >
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <CustomFormField
                        name="username"
                        label="Username"
                        form={form}
                    />

                    <CustomFormField
                        name="email"
                        label="Email"
                        type="email"
                        form={form}                                                
                    />

                    <CustomFormField
                        name="firstName"
                        label="First Name"
                        form={form}
                    />

                    <CustomFormField
                        name="lastName"
                        label="Last Name"
                        form={form}
                    />

                    <CustomFormField
                        name="profession"
                        label="Profession"
                        form={form}
                    />

                    <CustomFormField
                        name="phoneNo"
                        label="Phone Number"
                        form={form}
                    />

                    <CustomFormField
                        name="gender"
                        label="Gender"
                        form={form}
                        isSelect
                        options={[
                            "Male",
                            "Female",
                            "Others",
                        ]}
                    />

                    <CustomFormField
                        name="postalCode"
                        label="Postal Code"
                        form={form}
                    />

                    <CustomFormField
                        name="address"
                        label="Address"
                        form={form}
                    />

                    <CustomFormField
                        name="city"
                        label="City"
                        form={form}
                    />

                    <CustomFormField
                        name="state"
                        label="State"
                        form={form}
                    />

                    <CustomFormField
                        name="country"
                        label="Country"
                        form={form}
                    />
                </div>

                <CustomFormField
                    name="userBio"
                    label="Professional Headline"
                    form={form}
                    isTextarea
                />

                <CustomFormField
                    name="website"
                    label="Website"
                    form={form}
                />

                <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-slate-800">
                        About
                    </h3>

                    <UserAbout
                        onUserAbout={
                            setUserAbout
                        }
                        userAbout={
                            typeof profileUser?.userAbout ===
                                "string"
                                ? profileUser.userAbout
                                : profileUser?.userAbout
                                    ? JSON.stringify(
                                        profileUser.userAbout
                                    )
                                    : ""
                        }
                    />
                </div>

                <FormError
                    message={err}
                />

                <Button
                    type="submit"
                    isLoading={isPending}
                    className="w-full"
                >
                    Save Changes
                </Button>
            </form>
        </Form>
    );
}