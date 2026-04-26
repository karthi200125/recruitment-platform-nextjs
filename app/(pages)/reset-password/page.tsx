"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState, useTransition } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { KeyRound, ArrowLeft, CheckCircle2, ShieldAlert } from "lucide-react";
import { FaLock, FaLockOpen } from "react-icons/fa";

import { resetPassword } from "@/actions/auth/resetPassword";

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

const ResetPasswordSchema = z
    .object({
        password: z
            .string()
            .min(8, "Password must be at least 8 characters")
            .regex(/[A-Z]/, "Must contain at least one uppercase letter")
            .regex(/[0-9]/, "Must contain at least one number"),
        confirmPassword: z.string().min(1, "Please confirm your password"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

type ResetPasswordValues = z.infer<typeof ResetPasswordSchema>;

// ─── Password strength indicator ──────────────────────────────────────────

function getStrength(password: string): { score: number; label: string; color: string } {
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 1) return { score, label: "Weak", color: "bg-rose-500" };
    if (score <= 3) return { score, label: "Fair", color: "bg-amber-400" };
    if (score <= 4) return { score, label: "Good", color: "bg-indigo-500" };
    return { score, label: "Strong", color: "bg-emerald-500" };
}

// ─── Component ─────────────────────────────────────────────────────────────

export default function ResetPasswordPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get("token");

    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [showPass, setShowPass] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [isPending, startTransition] = useTransition();

    const form = useForm<ResetPasswordValues>({
        resolver: zodResolver(ResetPasswordSchema),
        defaultValues: { password: "", confirmPassword: "" },
    });

    const watchedPassword = form.watch("password");
    const strength = getStrength(watchedPassword);

    // ── Invalid / missing token ──────────────────────────────────────────

    if (!token) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4">
                <div className="w-full max-w-md">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 text-center space-y-4">
                        <div className="flex justify-center">
                            <div className="w-14 h-14 rounded-full bg-rose-50 flex items-center justify-center">
                                <ShieldAlert className="w-7 h-7 text-rose-500" strokeWidth={1.75} />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <h2 className="text-xl font-bold text-slate-900">Invalid reset link</h2>
                            <p className="text-sm text-slate-500 leading-relaxed">
                                This password reset link is invalid or has expired.
                                Please request a new one.
                            </p>
                        </div>
                        <Link
                            href="/forgot-password"
                            className="inline-flex items-center justify-center gap-2 w-full rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors duration-200 shadow-sm shadow-indigo-200"
                        >
                            Request a new link
                        </Link>
                        <Link
                            href="/login"
                            className="inline-flex items-center justify-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors duration-200"
                        >
                            <ArrowLeft className="w-3.5 h-3.5" strokeWidth={2} />
                            Back to sign in
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // ── Success state ────────────────────────────────────────────────────

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
                <div className="w-full max-w-md">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 text-center space-y-4">
                        <div className="flex justify-center">
                            <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center">
                                <CheckCircle2 className="w-7 h-7 text-emerald-500" strokeWidth={1.75} />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <h2 className="text-xl font-bold text-slate-900">Password updated!</h2>
                            <p className="text-sm text-slate-500 leading-relaxed">
                                Your password has been reset successfully.
                                You can now sign in with your new password.
                            </p>
                        </div>
                        <button
                            onClick={() => router.push("/login")}
                            className="inline-flex items-center justify-center gap-2 w-full rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors duration-200 shadow-sm shadow-indigo-200"
                        >
                            Sign in now
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // ── Form ─────────────────────────────────────────────────────────────

    const onSubmit = (values: ResetPasswordValues) => {
        setError("");

        startTransition(async () => {
            const res = await resetPassword(token, values.password);

            if (res.success) {
                setSuccess(true);
            } else {
                setError(res.error ?? "Something went wrong. Please try again.");
            }
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 space-y-6">

                    {/* Header */}
                    <div className="space-y-1.5">
                        <div className="w-11 h-11 rounded-xl bg-indigo-50 flex items-center justify-center mb-4">
                            <KeyRound className="w-5 h-5 text-indigo-600" strokeWidth={1.75} />
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                            Reset your password
                        </h1>
                        <p className="text-sm text-slate-500 leading-relaxed">
                            Choose a strong new password for your account.
                        </p>
                    </div>

                    {/* Form */}
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-4 w-full"
                        >
                            {/* New password */}
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <div className="relative">
                                                <Input
                                                    {...field}
                                                    type={showPass ? "text" : "password"}
                                                    placeholder="New password"
                                                    disabled={isPending}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPass((p) => !p)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                                >
                                                    {showPass ? <FaLockOpen size={14} /> : <FaLock size={14} />}
                                                </button>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Password strength bar */}
                            {watchedPassword.length > 0 && (
                                <div className="space-y-1.5 -mt-1">
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4, 5].map((step) => (
                                            <div
                                                key={step}
                                                className={`h-1 flex-1 rounded-full transition-all duration-300 ${step <= strength.score
                                                        ? strength.color
                                                        : "bg-slate-100"
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                    <p className="text-xs text-slate-400">
                                        Strength:{" "}
                                        <span className="font-medium text-slate-600">
                                            {strength.label}
                                        </span>
                                    </p>
                                </div>
                            )}

                            {/* Confirm password */}
                            <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <div className="relative">
                                                <Input
                                                    {...field}
                                                    type={showConfirm ? "text" : "password"}
                                                    placeholder="Confirm new password"
                                                    disabled={isPending}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowConfirm((p) => !p)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                                >
                                                    {showConfirm ? <FaLockOpen size={14} /> : <FaLock size={14} />}
                                                </button>
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
                                Reset Password
                            </Button>
                        </form>
                    </Form>

                    {/* Footer */}
                    <div className="pt-2 border-t border-slate-100 text-center">
                        <Link
                            href="/login"
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