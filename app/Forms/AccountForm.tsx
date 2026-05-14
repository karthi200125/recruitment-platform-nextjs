// components/forms/AccountForm.tsx

'use client';

import { useState, useTransition } from "react";
import { signOut } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import {
    changePassword,
    changeEmail,
    deleteAccount,
    ChangePasswordSchema,
    ChangeEmailSchema,
    DeleteAccountSchema,
} from "@/actions/settings";

import {
    Form,
    FormField,
    FormItem,
    FormControl,
    FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import Button from "@/components/Button";
import FormError from "@/components/ui/FormError";

interface AccountFormProps {
    provider?: string;
}

export default function AccountForm({
    provider,
}: AccountFormProps) {

    const [passwordError, setPasswordError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [deleteError, setDeleteError] = useState("");

    const [isPending, startTransition] = useTransition();

    // =========================
    // PASSWORD FORM
    // =========================

    const passwordForm = useForm<
        z.infer<typeof ChangePasswordSchema>
    >({
        resolver: zodResolver(ChangePasswordSchema),
        defaultValues: {
            oldPassword: "",
            newPassword: "",
        },
    });

    const onPasswordSubmit = (
        values: z.infer<typeof ChangePasswordSchema>
    ) => {

        setPasswordError("");

        startTransition(async () => {

            const res = await changePassword(values);

            if (res?.error) {
                return setPasswordError(res.error);
            }

            alert("Password updated successfully");

            passwordForm.reset();
        });
    };



    // =========================
    // EMAIL FORM
    // =========================

    const emailForm = useForm<
        z.infer<typeof ChangeEmailSchema>
    >({
        resolver: zodResolver(ChangeEmailSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onEmailSubmit = (
        values: z.infer<typeof ChangeEmailSchema>
    ) => {

        setEmailError("");

        startTransition(async () => {

            const res = await changeEmail(values);

            if (res?.error) {
                return setEmailError(res.error);
            }

            alert("Email updated successfully");

            emailForm.reset();
        });
    };



    // =========================
    // DELETE FORM
    // =========================

    const deleteForm = useForm<
        z.infer<typeof DeleteAccountSchema>
    >({
        resolver: zodResolver(DeleteAccountSchema),
        defaultValues: {
            password: "",
            confirmText: "",
        },
    });

    const onDeleteSubmit = (
        values: z.infer<typeof DeleteAccountSchema>
    ) => {

        setDeleteError("");

        const confirmed = confirm(
            "This action is irreversible. Continue?"
        );

        if (!confirmed) return;

        startTransition(async () => {

            const res = await deleteAccount(values);

            if (res?.error) {
                return setDeleteError(res.error);
            }

            alert("Account deleted successfully");

            await signOut({
                callbackUrl: "/",
            });
        });
    };



    return (
        <div className="space-y-10 max-w-md">


            {/* ========================= */}
            {/* CHANGE PASSWORD */}
            {/* ========================= */}

            {provider === "credentials" && (

                <Form {...passwordForm}>
                    <form
                        onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
                        className="space-y-3"
                    >

                        <h2 className="font-semibold">
                            Change Password
                        </h2>

                        <FormField
                            control={passwordForm.control}
                            name="oldPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            type="password"
                                            placeholder="Old Password"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={passwordForm.control}
                            name="newPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            type="password"
                                            placeholder="New Password"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button isLoading={isPending}>
                            Update Password
                        </Button>

                        <FormError message={passwordError} />

                    </form>
                </Form>
            )}



            {/* ========================= */}
            {/* CHANGE EMAIL */}
            {/* ========================= */}

            <Form {...emailForm}>
                <form
                    onSubmit={emailForm.handleSubmit(onEmailSubmit)}
                    className="space-y-3"
                >

                    <h2 className="font-semibold">
                        Change Email
                    </h2>

                    <FormField
                        control={emailForm.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input
                                        {...field}
                                        type="email"
                                        placeholder="New Email"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {provider === "credentials" && (

                        <FormField
                            control={emailForm.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            type="password"
                                            placeholder="Current Password"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    )}

                    <Button isLoading={isPending}>
                        Update Email
                    </Button>

                    <FormError message={emailError} />

                </form>
            </Form>



            {/* ========================= */}
            {/* DELETE ACCOUNT */}
            {/* ========================= */}

            <Form {...deleteForm}>
                <form
                    onSubmit={deleteForm.handleSubmit(onDeleteSubmit)}
                    className="space-y-3"
                >

                    <h2 className="font-semibold text-red-500">
                        Delete Account
                    </h2>

                    {provider === "credentials" && (

                        <FormField
                            control={deleteForm.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            type="password"
                                            placeholder="Enter Password"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    )}

                    <FormField
                        control={deleteForm.control}
                        name="confirmText"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input
                                        {...field}
                                        placeholder='Type "DELETE"'
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button
                        isLoading={isPending}
                        className="bg-red-600 hover:bg-red-700"
                    >
                        Delete Account
                    </Button>

                    <FormError message={deleteError} />

                </form>
            </Form>

        </div>
    );
}