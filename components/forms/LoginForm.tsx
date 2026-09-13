"use client";

import { Lock, LockOpen } from "lucide-react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

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
import { LoginSchema } from "@/lib/SchemaTypes";

type LoginValues = z.infer<typeof LoginSchema>;

export default function LoginForm() {
    const router = useRouter();

    const [showPassword, setShowPassword] =
        useState(false);

    const [error, setError] = useState("");

    const [isPending, startTransition] =
        useTransition();

    const form = useForm<LoginValues>({
        resolver: zodResolver(LoginSchema),

        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = (values: LoginValues) => {
        if (isPending) {
            return;
        }

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

                router.push("/dashboard");
                router.refresh();
            } catch {
                setError(
                    "Something went wrong. Please try again."
                );
            }
        });
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full space-y-4"
                noValidate
            >
                {/* Email */}
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
                                    autoComplete="email"
                                    disabled={isPending}
                                    className="border border-white/10 bg-white/[0.02] text-white"
                                />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Password */}
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
                                        autoComplete="current-password"
                                        disabled={isPending}
                                        className="border border-white/10 bg-white/[0.02] pr-10 text-white"
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(
                                                (previous) =>
                                                    !previous
                                            )
                                        }
                                        disabled={isPending}
                                        aria-label={
                                            showPassword
                                                ? "Hide password"
                                                : "Show password"
                                        }
                                        aria-pressed={
                                            showPassword
                                        }
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 transition-colors hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {showPassword ? (
                                            <LockOpen
                                                className="h-4 w-4"
                                                aria-hidden="true"
                                            />
                                        ) : (
                                            <Lock
                                                className="h-4 w-4"
                                                aria-hidden="true"
                                            />
                                        )}
                                    </button>
                                </div>
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Forgot password */}
                <div className="flex justify-end">
                    <Link
                        href="/forgot-password"
                        className="text-sm font-medium text-indigo-400 transition-colors hover:text-indigo-300"
                    >
                        Forgot password?
                    </Link>
                </div>

                {/* Server/auth error */}
                <FormError message={error} />

                {/* Submit */}
                <Button
                    type="submit"
                    isLoading={isPending}
                    disabled={isPending}
                    className="w-full"
                >
                    Login
                </Button>
            </form>
        </Form>
    );
}