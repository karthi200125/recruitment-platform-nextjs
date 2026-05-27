"use client";

import { Role } from "@prisma/client";
import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { DASHBOARD_TABS } from "./config/dashboardTabsConfig";
import DashboardNavbar from "./dashboard-navbar";
import DashboardContent from "./DashboardContent";


interface DashboardClientProps {
    user: {
        id: number;

        role: Role;

        username?: string | null;

        userImage?: string | null;
    };

    role: Role;

    dashboardData: any;
}

const DashboardClient = ({
    user,
    role,
    dashboardData,
}: DashboardClientProps) => {
    const searchParams =
        useSearchParams();

    // ─────────────────────────────────────────
    // Allowed Tabs
    // ─────────────────────────────────────────

    const allowedTabs =
        DASHBOARD_TABS[role];

    // ─────────────────────────────────────────
    // Active Tab
    // ─────────────────────────────────────────

    const activeTab =
        useMemo(() => {
            const tab =
                searchParams.get(
                    "tab"
                ) ?? "overview";

            const isValid =
                allowedTabs.some(
                    (item) =>
                        item.value ===
                        tab
                );

            return isValid
                ? tab
                : "overview";
        }, [
            searchParams,
            allowedTabs,
        ]);

    // ─────────────────────────────────────────
    // Render
    // ─────────────────────────────────────────

    return (
        <div className="min-h-screen w-full">
            <div className="space-y-6">
                {/* Navbar */}
                <DashboardNavbar
                    role={role}
                    activeTab={activeTab}
                />

                {/* Content */}
                <DashboardContent
                    activeTab={activeTab}
                    role={role}
                    dashboardData={
                        dashboardData
                    }
                />
            </div>
        </div>
    );
};

export default DashboardClient;