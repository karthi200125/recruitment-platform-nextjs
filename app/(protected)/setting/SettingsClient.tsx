"use client";

import SettingAccountCard from "./SettingAccountCard";
import SettingSecurityCard from "./SettingSecurityCard";
import SettingDangerZoneCard from "./SettingDangerZoneCard";

import type { UserProfile } from "@/types";

interface SettingsClientProps {
    user: UserProfile;
}

const SettingsClient = ({ user }: SettingsClientProps) => {
    return (
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">
                    Settings
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                    Manage your account, security, and account preferences.
                </p>
            </div>

            <SettingAccountCard user={user} />

            <SettingSecurityCard user={user} />

            <SettingDangerZoneCard />
        </div>
    );
};

export default SettingsClient;