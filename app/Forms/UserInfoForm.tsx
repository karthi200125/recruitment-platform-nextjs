"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { usePathname, useRouter } from "next/navigation";
import * as z from "zod";

import { UserInfoSchema } from "@/lib/SchemaTypes";
import { getCompanies } from "@/actions/company/getCompanies";
import { UserUpdate } from "@/actions/user/UpdateUser";

import Button from "@/components/Button";
import CustomFormField from "@/components/CustomFormField";
import { Form } from "@/components/ui/form";
import FormError from "@/components/ui/FormError";

import { useCustomToast } from "@/lib/CustomToast";
import { useCurrentUser } from "@/hooks/useCurrentUser";

import { closeModal } from "@/app/Redux/ModalSlice";
import UserAbout from "./UserAbout";

import { ProfileUser } from "@/types/userProfile";

/* ──────────────────────────────────────────────── */
interface Props {
    profileUser?: ProfileUser;
    currentStep?: number;
    onNext?: (value: number) => void;
}
/* ──────────────────────────────────────────────── */

export function UserInfoForm({
    profileUser,
    currentStep = 1,
    onNext,
}: Props) {
    const { user: currentUser } = useCurrentUser();
    const dispatch = useDispatch();
    const pathname = usePathname();
    const queryClient = useQueryClient();

    const [isPending, startTransition] = useTransition();
    const [userAbout, setUserAbout] = useState<string>(
        typeof profileUser?.userAbout === "string"
            ? profileUser.userAbout
            : profileUser?.userAbout
                ? JSON.stringify(profileUser.userAbout)
                : ""
    );
    const [err, setErr] = useState("");

    const router = useRouter();

    const { showSuccessToast } = useCustomToast();

    const isRecruiter = profileUser?.role === "RECRUITER";

    /* ────────────────────────────────────────────────
       Fetch companies
    ──────────────────────────────────────────────── */
    const { data: companies = [], isLoading: companyLoading } =
        useQuery({
            queryKey: ["companies"],
            queryFn: getCompanies,
        });

    const companiesOptions = companies.map(
        (c) => c.companyName
    );

    /* ────────────────────────────────────────────────
       Form
    ──────────────────────────────────────────────── */
    const form = useForm<z.infer<typeof UserInfoSchema>>({
        resolver: zodResolver(UserInfoSchema),
        defaultValues: {
            username: profileUser?.username || "",
            userBio: profileUser?.userBio || "",
            website: profileUser?.website || "",
            email: profileUser?.email || "",
            firstName: profileUser?.firstName || "",
            lastName: profileUser?.lastName || "",
            gender: profileUser?.gender || "",
            address: profileUser?.address || "",
            city: profileUser?.city || "",
            state: profileUser?.state || "",
            country: profileUser?.country || "",
            phoneNo: profileUser?.phoneNo || "",
            postalCode: profileUser?.postalCode || "",
            profession: profileUser?.profession || "",
            currentCompany: profileUser?.currentCompany || "",
        },
    });

    /* ────────────────────────────────────────────────
       Submit
    ──────────────────────────────────────────────── */
    const onSubmit = (values: z.infer<typeof UserInfoSchema>) => {
        const id = profileUser?.id;
        if (!id) return;

        // ✅ recruiter validation
        if (isRecruiter && !values.currentCompany) {
            setErr("Please select a company");
            return;
        }

        setErr("");

        startTransition(async () => {
            const res = await UserUpdate(values, id, userAbout);

            if (res.success) {
                showSuccessToast(res.success);

                router.refresh()

                dispatch(closeModal("userInfoFormModal"));

                if (pathname === "/welcome" && onNext) {
                    onNext(currentStep + 1);
                }
            } else {
                setErr(res.error || "Something went wrong");
            }
        });
    };

    /* ──────────────────────────────────────────────── */
    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
            >

                {/* GRID FIELDS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <CustomFormField name="username" form={form} label="Username" />
                    <CustomFormField name="email" form={form} label="Email" type="email" />
                    <CustomFormField name="firstName" form={form} label="First Name" />
                    <CustomFormField name="lastName" form={form} label="Last Name" />
                    <CustomFormField name="address" form={form} label="Address" />
                    <CustomFormField name="city" form={form} label="City" />
                    <CustomFormField name="state" form={form} label="State" />
                    <CustomFormField name="country" form={form} label="Country" />
                    <CustomFormField name="postalCode" form={form} label="Postal Code" />
                    <CustomFormField name="phoneNo" form={form} label="Phone Number" />

                    <CustomFormField
                        name="gender"
                        form={form}
                        label="Gender"
                        isSelect
                        options={["Male", "Female", "Others"]}
                    />

                    <CustomFormField
                        name="profession"
                        form={form}
                        label="Profession"
                    />
                </div>

                <CustomFormField
                    name="userBio"
                    form={form}
                    label="User Bio"
                    isTextarea
                />

                <CustomFormField
                    name="website"
                    form={form}
                    label="Website"
                />

                {/* RECRUITER FIELD */}
                {isRecruiter && (
                    <CustomFormField
                        name="currentCompany"
                        form={form}
                        label="Select Company"
                        isSelect
                        options={companiesOptions}
                        optionsLoading={companyLoading}
                    />
                )}

                {/* ABOUT */}
                <div className="space-y-2">
                    <h5 className="font-bold">About User</h5>
                    <UserAbout
                        onUserAbout={setUserAbout}
                        UserAbout={
                            typeof profileUser?.userAbout === "string"
                                ? profileUser.userAbout
                                : profileUser?.userAbout
                                    ? JSON.stringify(profileUser.userAbout)
                                    : ""
                        }
                    />
                </div>

                <FormError message={err} />

                <Button isLoading={isPending} className="w-full">
                    {pathname === "/welcome" ? "Next" : "Update"}
                </Button>
            </form>
        </Form>
    );
}