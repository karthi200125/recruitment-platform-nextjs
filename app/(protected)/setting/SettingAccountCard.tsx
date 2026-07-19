"use client";

import { CalendarDays, Mail, Shield, User2 } from "lucide-react";
import { format } from "date-fns";

import type { UserProfile } from "@/types";

interface SettingAccountCardProps {
    user: UserProfile;
}

const SettingAccountCard = ({
    user,
}: SettingAccountCardProps) => {
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
                    Account
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                    View your account information.
                </p>
            </div>

            <div className="divide-y divide-slate-100">
                <InfoRow
                    icon={<User2 className="h-4 w-4" />}
                    label="Username"
                    value={user.username ?? "-"}
                />

                <InfoRow
                    icon={<Mail className="h-4 w-4" />}
                    label="Email"
                    value={user.email}
                />

                <InfoRow
                    icon={<Shield className="h-4 w-4" />}
                    label="Authentication"
                    value={provider}
                />

                <InfoRow
                    icon={<CalendarDays className="h-4 w-4" />}
                    label="Member Since"
                    value={format(new Date(user.createdAt), "dd MMM yyyy")}
                />
            </div>
        </div>
    );
};

interface InfoRowProps {
    icon: React.ReactNode;
    label: string;
    value: string;
}

function InfoRow({
    icon,
    label,
    value,
}: InfoRowProps) {
    return (
        <div className="flex items-center justify-between gap-4 px-6 py-4">
            <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
                    {icon}
                </div>

                <span className="text-sm font-medium text-slate-600">
                    {label}
                </span>
            </div>

            <span className="text-right text-sm font-semibold text-slate-900">
                {value}
            </span>
        </div>
    );
}

export default SettingAccountCard;