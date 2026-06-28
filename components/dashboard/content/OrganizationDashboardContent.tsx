"use client";


import ApplicantsTab from "@/components/dashboard/tabs/ApplicantsTab";
import HiredCandidatesTab from "@/components/dashboard/tabs/HiredCandidatesTab";
import OrganizationOverviewTab from "../overview/OrganizationOverviewTab";
import OrganizationJobsTab from "../tabs/OrganizationJobsTab";
import { DashboardData } from "@/types/dashboard";

interface OrganizationDashboardContentProps {
    activeTab: string;
    role: "ORGANIZATION";
    dashboardData: DashboardData;
}

const OrganizationDashboardContent = ({
    activeTab,
    role,
    dashboardData,
}: OrganizationDashboardContentProps) => {
    return (
        <section className="space-y-5">
            {/* Overview */}
            {activeTab ===
                "overview" && (
                    <OrganizationOverviewTab
                        role={role}
                        dashboardData={
                            dashboardData
                        }
                    />
                )}

            {/* Jobs */}
            {activeTab ===
                "jobs" && (
                    <OrganizationJobsTab
                        dashboardData={
                            dashboardData
                        }
                    />
                )}

            {/* Applicants */}
            {activeTab ===
                "applicants" && (
                    <ApplicantsTab
                        dashboardData={
                            dashboardData
                        }
                    />
                )}

            {/* Hired */}
            {activeTab ===
                "hired" && (
                    <HiredCandidatesTab
                        dashboardData={
                            dashboardData
                        }
                    />
                )}
        </section>
    );
};

export default OrganizationDashboardContent;