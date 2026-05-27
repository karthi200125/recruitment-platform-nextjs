'use client';

import { useState, useTransition } from "react";

import { useRouter } from "next/navigation";

import { signIn } from "next-auth/react";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { z } from "zod";

import Link from "next/link";

import { FaLock, FaLockOpen } from "react-icons/fa";

import { LoginSchema } from "@/lib/SchemaTypes";

import Button from "@/components/Button";

import FormError from "@/components/ui/FormError";

import { Input } from "@/components/ui/input";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";

const LoginForm = () => {
    const router = useRouter();

    const [showPassword, setShowPassword] =
        useState(false);

    const [error, setError] = useState("");

    const [isPending, startTransition] =
        useTransition();

    const form = useForm<
        z.infer<typeof LoginSchema>
    >({
        resolver:
            zodResolver(LoginSchema),

        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = (
        values: z.infer<typeof LoginSchema>
    ) => {
        setError("");

        startTransition(async () => {
            try {
                const result = await signIn(
                    "credentials",
                    {
                        email: values.email,
                        password: values.password,
                        redirect: false,
                    }
                );

                if (result?.error) {
                    setError(
                        "Invalid email or password"
                    );

                    return;
                }

                router.refresh();

                router.push("/dashboard");
            } catch (error) {
                setError(
                    "Something went wrong"
                );
            }
        });
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(
                    onSubmit
                )}
                className="space-y-4 w-full"
            >
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input
                                    {...field}
                                    type="email"
                                    placeholder="Email"
                                    disabled={isPending}
                                    autoComplete="email"
                                    className="bg-white/[0.02] border border-white/10 text-white"
                                />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <div className="relative">
                                    <Input
                                        {...field}
                                        type={
                                            showPassword
                                                ? "text"
                                                : "password"
                                        }
                                        placeholder="Password"
                                        disabled={isPending}
                                        autoComplete="current-password"
                                        className="bg-white/[0.02] border border-white/10 text-white"
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(
                                                (prev) => !prev
                                            )
                                        }
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50"
                                    >
                                        {showPassword ? (
                                            <FaLockOpen />
                                        ) : (
                                            <FaLock />
                                        )}
                                    </button>
                                </div>
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex justify-end">
                    <Link
                        href="/forgot-password"
                        className="text-sm text-blue-500 hover:text-white transition"
                    >
                        Forgot password?
                    </Link>
                </div>

                <FormError message={error} />

                <Button
                    type="submit"
                    isLoading={isPending}
                    className="w-full"
                >
                    Login
                </Button>
            </form>
        </Form>
    );
};

export default LoginForm;