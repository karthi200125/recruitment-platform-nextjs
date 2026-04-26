'use client';

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";


import {
    changePassword,
    changeEmail,
    deleteAccount,
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
import { ChangeEmailSchema, ChangePasswordSchema, DeleteAccountSchema } from "@/lib/SchemaTypes";

export default function AccountForm() {
    const [error, setError] = useState("");
    const [isPending, startTransition] = useTransition();

    // PASSWORD FORM
    const passwordForm = useForm<z.infer<typeof ChangePasswordSchema>>({
        resolver: zodResolver(ChangePasswordSchema),
        defaultValues: { oldPassword: "", newPassword: "" },
    });

    const onPasswordSubmit = (values: z.infer<typeof ChangePasswordSchema>) => {
        setError("");

        startTransition(async () => {
            const res = await changePassword(values);
            if (res?.error) return setError(res.error);

            alert(res.success);
            passwordForm.reset();
        });
    };

    // EMAIL FORM
    const emailForm = useForm<z.infer<typeof ChangeEmailSchema>>({
        resolver: zodResolver(ChangeEmailSchema),
        defaultValues: { email: "" },
    });

    const onEmailSubmit = (values: z.infer<typeof ChangeEmailSchema>) => {
        setError("");

        startTransition(async () => {
            const res = await changeEmail(values);
            if (res?.error) return setError(res.error);

            alert(res.success);
        });
    };

    // DELETE FORM
    const deleteForm = useForm<z.infer<typeof DeleteAccountSchema>>({
        resolver: zodResolver(DeleteAccountSchema),
        defaultValues: { password: "" },
    });

    const onDeleteSubmit = (values: z.infer<typeof DeleteAccountSchema>) => {
        setError("");

        if (!confirm("This action is irreversible. Continue?")) return;

        startTransition(async () => {
            const res = await deleteAccount(values);
            if (res?.error) return setError(res.error);

            alert("Account deleted");
            window.location.href = "/";
        });
    };

    return (
        <div className="space-y-10 max-w-md">

            {/* PASSWORD */}
            <Form {...passwordForm}>
                <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-3">
                    <h2 className="font-semibold">Change Password</h2>

                    <FormField control={passwordForm.control} name="oldPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input {...field} placeholder="Old Password" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                    <FormField control={passwordForm.control} name="newPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input {...field} placeholder="New Password" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                    <Button isLoading={isPending}>Update Password</Button>
                </form>
            </Form>

            {/* EMAIL */}
            <Form {...emailForm}>
                <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-3">
                    <h2 className="font-semibold">Change Email</h2>

                    <FormField control={emailForm.control} name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input {...field} placeholder="New Email" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                    <Button isLoading={isPending}>Update Email</Button>
                </form>
            </Form>

            {/* DELETE */}
            <Form {...deleteForm}>
                <form onSubmit={deleteForm.handleSubmit(onDeleteSubmit)} className="space-y-3">
                    <h2 className="font-semibold text-red-500">Delete Account</h2>

                    <FormField control={deleteForm.control} name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input {...field} placeholder="Enter password" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                    <Button isLoading={isPending} className="bg-red-600">
                        Delete Account
                    </Button>
                </form>
            </Form>

            <FormError message={error} />
        </div>
    );
}