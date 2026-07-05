"use client";

import { memo } from "react";
import { useSearchParams } from "next/navigation";
import { Role } from "@prisma/client";

import { User } from "@/types";
import { DashboardData } from "@/types/dashboard";

import DashboardNavbar from "./dashboard-navbar";
import DashboardContent from "./DashboardContent";
import { DASHBOARD_TABS } from "./config/dashboardTabsConfig";
import CompanyVerificationBanner from "@/app/(protected)/create-company/CompanyVerificationBanner";

interface DashboardClientProps {
    user: Pick<User, "id" | "role" | "username" | "userImage">;
    dashboardData: DashboardData;
    company: any
}

const DashboardClient = ({
    user,
    dashboardData,
    company
}: DashboardClientProps) => {
    const searchParams = useSearchParams();

    const allowedTabs = DASHBOARD_TABS[user.role];
    const requestedTab = searchParams.get("tab") ?? "overview";

    const activeTab =
        allowedTabs.some(
            ({ value }) =>
                value === requestedTab
        )
            ? requestedTab
            : "overview";

    if (!dashboardData) {
        return null;
    }

    return (
        <main className="min-h-screen space-y-6">

            {user.role === Role.ORGANIZATION &&
                company &&
                !company.companyIsVerified && (
                    <CompanyVerificationBanner
                        companyIsVerified={company.companyIsVerified}
                    />
                )}

            <DashboardNavbar
                role={user.role}
                activeTab={activeTab}
            />

            <DashboardContent
                role={user.role}
                activeTab={activeTab}
                dashboardData={
                    dashboardData
                }
            />
        </main>
    );
};

export default memo(DashboardClient);