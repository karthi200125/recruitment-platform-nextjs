"use client";

import { CalendarDays, Mail, Shield, User2 } from "lucide-react";
import { format } from "date-fns";

import type { UserProfile } from "@/types";

interface SettingAccountCardProps {
    user: UserProfile;
}

const ROW_ICON_STYLES = [
    "bg-indigo-50 text-indigo-600",
    "bg-sky-50 text-sky-600",
    "bg-violet-50 text-violet-600",
    "bg-emerald-50 text-emerald-600",
];

const SettingAccountCard = ({ user }: SettingAccountCardProps) => {
    const provider =
        user.authProvider === "google" ? "Google" : user.authProvider === "github" ? "GitHub" : "Email & Password";

    const rows = [
        { icon: User2, label: "Username", value: user.username ?? "-" },
        { icon: Mail, label: "Email", value: user.email },
        { icon: Shield, label: "Authentication", value: provider },
        { icon: CalendarDays, label: "Member Since", value: format(new Date(user.createdAt), "dd MMM yyyy") },
    ];

    return (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-100">
            <div className="border-b border-slate-100 px-7 py-6">
                <h2 className="text-lg font-semibold text-slate-900">Account</h2>
                <p className="mt-1 text-sm text-slate-500">View your account information.</p>
            </div>

            <div className="divide-y divide-slate-100">
                {rows.map((row, i) => (
                    <div key={row.label} className="flex items-center justify-between gap-4 px-7 py-4 transition-colors hover:bg-slate-50/60">
                        <div className="flex items-center gap-3.5">
                            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${ROW_ICON_STYLES[i % ROW_ICON_STYLES.length]}`}>
                                <row.icon className="h-[18px] w-[18px]" strokeWidth={1.75} />
                            </div>
                            <span className="text-sm font-medium text-slate-500">{row.label}</span>
                        </div>

                        <span className="text-right text-sm font-semibold text-slate-900">{row.value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SettingAccountCard;