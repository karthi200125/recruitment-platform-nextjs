"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState, useTransition } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";

import { forgotPassword } from "@/actions/auth/forgotPassword";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Button from "@/components/Button";
import FormError from "@/components/ui/FormError";

// ─── Schema ────────────────────────────────────────────────────────────────

const ForgotPasswordSchema = z.object({
    email: z
        .string()
        .min(1, "Email is required")
        .email("Please enter a valid email address"),
});

type ForgotPasswordValues = z.infer<typeof ForgotPasswordSchema>;

// ─── Component ─────────────────────────────────────────────────────────────

export default function ForgotPasswordPage() {
    const [error, setError] = useState("");
    const [sent, setSent] = useState(false);
    const [isPending, startTransition] = useTransition();

    const form = useForm<ForgotPasswordValues>({
        resolver: zodResolver(ForgotPasswordSchema),
        defaultValues: { email: "" },
    });

    const onSubmit = (values: ForgotPasswordValues) => {
        setError("");

        startTransition(async () => {
            try {
                await forgotPassword(values.email);
                setSent(true);
            } catch {
                setError("Something went wrong. Please try again.");
            }
        });
    };

    // ── Success state ────────────────────────────────────────────────────

    if (sent) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
                <div className="w-full max-w-md">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 text-center space-y-4">
                        {/* Icon */}
                        <div className="flex justify-center">
                            <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center">
                                <CheckCircle2 className="w-7 h-7 text-emerald-500" strokeWidth={1.75} />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <h2 className="text-xl font-bold text-slate-900">Check your inbox</h2>
                            <p className="text-sm text-slate-500 leading-relaxed">
                                If{" "}
                                <span className="font-medium text-slate-700">
                                    {form.getValues("email")}
                                </span>{" "}
                                is registered, you'll receive a password reset link shortly.
                            </p>
                        </div>

                        <p className="text-xs text-slate-400">
                            Didn't receive it? Check your spam folder or{" "}
                            <button
                                onClick={() => { setSent(false); setError(""); }}
                                className="text-indigo-600 font-medium hover:underline"
                            >
                                try again
                            </button>
                            .
                        </p>

                        <Link
                            href="/signin"
                            className="inline-flex items-center justify-center gap-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 mt-2"
                        >
                            <ArrowLeft className="w-4 h-4" strokeWidth={2} />
                            Back to sign in
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // ── Form state ───────────────────────────────────────────────────────

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 space-y-6">

                    {/* Header */}
                    <div className="space-y-1.5">
                        <div className="w-11 h-11 rounded-xl bg-indigo-50 flex items-center justify-center mb-4">
                            <Mail className="w-5 h-5 text-indigo-600" strokeWidth={1.75} />
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                            Forgot password?
                        </h1>
                        <p className="text-sm text-slate-500 leading-relaxed">
                            No worries — enter your email and we'll send you a reset link.
                        </p>
                    </div>

                    {/* Form */}
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-4 w-full"
                        >
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                                                <Input
                                                    {...field}
                                                    type="email"
                                                    placeholder="Enter your email"
                                                    className="pl-9"
                                                    disabled={isPending}
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormError message={error} />

                            <Button
                                type="submit"
                                isLoading={isPending}
                                className="w-full"
                            >
                                Send Reset Link
                            </Button>
                        </form>
                    </Form>

                    {/* Footer */}
                    <div className="pt-2 border-t border-slate-100 text-center">
                        <Link
                            href="/signin"
                            className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors duration-200"
                        >
                            <ArrowLeft className="w-3.5 h-3.5" strokeWidth={2} />
                            Back to sign in
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}