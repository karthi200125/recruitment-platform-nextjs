"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, ShieldCheck, User2 } from "lucide-react";
import { useState } from "react";

import SettingAccountCard from "./SettingAccountCard";
import SettingDangerZoneCard from "./SettingDangerZoneCard";
import SettingSecurityCard from "./SettingSecurityCard";

import type { UserSettings } from "@/types";

interface SettingsClientProps {
    user: UserSettings;
}

type SettingsSection = "account" | "security" | "danger";

const SECTIONS: { id: SettingsSection; label: string; icon: typeof User2 }[] = [
    { id: "account", label: "Account", icon: User2 },
    { id: "security", label: "Security", icon: ShieldCheck },
    { id: "danger", label: "Danger Zone", icon: AlertTriangle },
];

const SettingsClient = ({ user }: SettingsClientProps) => {
    const [activeSection, setActiveSection] = useState<SettingsSection>("account");

    return (
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
                <p className="mt-1 text-sm text-slate-500">Manage your account, security, and preferences.</p>
            </div>

            <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
                {/* section nav */}
                <nav className="flex flex-shrink-0 gap-1 overflow-x-auto lg:w-56 lg:flex-col lg:overflow-visible">
                    {SECTIONS.map((section) => {
                        const isActive = activeSection === section.id;
                        const isDanger = section.id === "danger";

                        return (
                            <button
                                key={section.id}
                                type="button"
                                onClick={() => setActiveSection(section.id)}
                                className={`relative flex flex-shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition-colors lg:w-full ${isActive
                                        ? isDanger
                                            ? "bg-red-50 text-red-700"
                                            : "bg-indigo-50 text-indigo-700"
                                        : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                                    }`}
                            >
                                <section.icon className="h-4 w-4 flex-shrink-0" strokeWidth={1.75} />
                                <span className="whitespace-nowrap">{section.label}</span>
                            </button>
                        );
                    })}
                </nav>

                {/* active panel */}
                <div className="min-w-0 flex-1">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeSection}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            transition={{ duration: 0.15 }}
                        >
                            {activeSection === "account" && <SettingAccountCard user={user} />}
                            {activeSection === "security" && <SettingSecurityCard user={user} />}
                            {activeSection === "danger" && <SettingDangerZoneCard />}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default SettingsClient;