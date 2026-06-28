"use client";

import { Role } from "@prisma/client";
import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { DASHBOARD_TABS } from "./config/dashboardTabsConfig";
import DashboardNavbar from "./dashboard-navbar";
import DashboardContent from "./DashboardContent";
import { DashboardData } from "@/types/dashboard";
import { User } from "@/types";


interface DashboardClientProps {
    user: Pick<
        User,
        "id" | "role" | "username" | "userImage"
    >;
    role: Role;
    dashboardData: DashboardData;
}

const DashboardClient = ({
    user,
    role,
    dashboardData,
}: DashboardClientProps) => {
    const searchParams =
        useSearchParams();

    const allowedTabs =
        DASHBOARD_TABS[role];

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