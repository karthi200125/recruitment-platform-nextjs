"use client";

import { Eye, EyeOff, LockKeyhole, ShieldCheck } from "lucide-react";
import { useState, useTransition } from "react";

import { changePassword } from "@/actions/setting/change-password";
import Button from "@/components/Button";
import { Input } from "@/components/ui/input";
import { useCustomToast } from "@/lib/CustomToast";

import type { UserSettings } from "@/types";

interface SettingSecurityCardProps {
    user: UserSettings;
}

const PasswordField = ({
    label,
    value,
    onChange,
    error,
    placeholder,
}: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    error?: string;
    placeholder: string;
}) => {
    const [visible, setVisible] = useState(false);

    return (
        <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">{label}</label>
            <div className="relative">
                <Input
                    type={visible ? "text" : "password"}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className="pr-10"
                />
                <button
                    type="button"
                    onClick={() => setVisible((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600"
                    tabIndex={-1}
                >
                    {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
            </div>
            {error && <p className="text-xs font-medium text-red-500">{error}</p>}
        </div>
    );
};

const SettingSecurityCard = ({ user }: SettingSecurityCardProps) => {
    const isCredentials = user.authProvider === "credentials";
    const { showSuccessToast, showErrorToast } = useCustomToast();
    const [isPending, startTransition] = useTransition();

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const provider = user.authProvider === "google" ? "Google" : user.authProvider === "github" ? "GitHub" : "Email & Password";

    const passwordsMatch = newPassword.length === 0 || confirmPassword.length === 0 || newPassword === confirmPassword;
    const isLongEnough = newPassword.length === 0 || newPassword.length >= 8;
    const canSubmit = currentPassword.length > 0 && newPassword.length >= 8 && newPassword === confirmPassword;

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!canSubmit || isPending) return;

        startTransition(async () => {
            const result = await changePassword({ currentPassword, newPassword, confirmPassword });

            if (result.error) {
                showErrorToast(result.error);
                return;
            }

            showSuccessToast(result.success ?? "Password updated.");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        });
    };

    return (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-100">
            <div className="border-b border-slate-100 px-7 py-6">
                <h2 className="text-lg font-semibold text-slate-900">Security</h2>
                <p className="mt-1 text-sm text-slate-500">Manage your authentication and account security.</p>
            </div>

            {!isCredentials ? (
                <div className="space-y-5 p-7">
                    <div className="flex items-center gap-3.5">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                            <ShieldCheck className="h-[18px] w-[18px]" strokeWidth={1.75} />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-slate-900">Authentication Provider</p>
                            <p className="text-sm text-slate-500">{provider}</p>
                        </div>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                        <p className="text-sm text-slate-600">
                            Your password is managed by <span className="font-semibold">{provider}</span>. Password changes
                            must be made through your authentication provider.
                        </p>
                    </div>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-5 p-7">
                    <PasswordField
                        label="Current Password"
                        value={currentPassword}
                        onChange={setCurrentPassword}
                        placeholder="Enter current password"
                    />

                    <PasswordField
                        label="New Password"
                        value={newPassword}
                        onChange={setNewPassword}
                        placeholder="Enter new password"
                        error={!isLongEnough ? "Must be at least 8 characters" : undefined}
                    />

                    <PasswordField
                        label="Confirm Password"
                        value={confirmPassword}
                        onChange={setConfirmPassword}
                        placeholder="Confirm new password"
                        error={!passwordsMatch ? "Passwords do not match" : undefined}
                    />

                    <div className="flex justify-end border-t border-slate-100 pt-5">
                        <Button type="submit" disabled={!canSubmit || isPending} isLoading={isPending}>
                            <LockKeyhole className="h-4 w-4" />
                            Save Changes
                        </Button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default SettingSecurityCard;