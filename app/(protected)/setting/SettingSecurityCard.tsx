"use client";

import { LockKeyhole, ShieldCheck } from "lucide-react";

import Button from "@/components/Button";
import { Input } from "@/components/ui/input";

import type { UserProfile } from "@/types";

interface SettingSecurityCardProps {
    user: UserProfile;
}

const SettingSecurityCard = ({
    user,
}: SettingSecurityCardProps) => {
    const isCredentials =
        user.authProvider === "credentials";

    const provider =
        user.authProvider === "google"
            ? "Google"
            : user.authProvider === "github"
                ? "GitHub"
                : "Email & Password";

    return (
        <div className="rounded-2xl border border-slate-200 bg-white">
            <div className="border-b border-slate-100 px-6 py-5">
                <h2 className="text-lg font-semibold text-slate-900">
                    Security
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                    Manage your authentication and account security.
                </p>
            </div>

            {!isCredentials ? (
                <div className="space-y-5 p-6">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
                            <ShieldCheck className="h-5 w-5" />
                        </div>

                        <div>
                            <p className="text-sm font-semibold text-slate-900">
                                Authentication Provider
                            </p>

                            <p className="text-sm text-slate-500">
                                {provider}
                            </p>
                        </div>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                        <p className="text-sm text-slate-600">
                            Your password is managed by{" "}
                            <span className="font-semibold">
                                {provider}
                            </span>.
                            Password changes must be made through your authentication provider.
                        </p>
                    </div>
                </div>
            ) : (
                <form className="space-y-5 p-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">
                            Email Address
                        </label>

                        <Input
                            type="email"
                            defaultValue={user.email}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">
                            Current Password
                        </label>

                        <Input
                            type="password"
                            placeholder="Enter current password"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">
                            New Password
                        </label>

                        <Input
                            type="password"
                            placeholder="Enter new password"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">
                            Confirm Password
                        </label>

                        <Input
                            type="password"
                            placeholder="Confirm new password"
                        />
                    </div>

                    <div className="flex justify-end">
                        <Button>
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