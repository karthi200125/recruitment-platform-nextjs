import { Role } from "@prisma/client";

import { DashboardData } from "@/types/dashboard";
import DashboardOverview from "./overview/DashboardOverview";
import RecentActivityCard from "./cards/RecentActivityCard";

interface DashboardContentProps {
    activeTab: string;
    role: Role;
    dashboardData: DashboardData;
}

const DashboardContent = ({
    activeTab,
    role,
    dashboardData,
}: DashboardContentProps) => {
    return {
        < section className = "space-y-5" >
        {/* Overview */ }
    {
        activeTab ===
            "overview" && (
                <DashboardOverview
                    role={role}
                    stats={dashboardData.stats ?? {}}
                    leftChart={{
                        title: "Company Hiring",
                        total: dashboardData.stats?.applicants?.count ?? 0,
                        data: dashboardData.charts?.companyHiringChart ?? [],
                    }}
                    rightChart={{
                        title: "Recruiters Performance",
                        data: dashboardData.charts?.recruitersPerformanceChart ?? [],
                    }}
                    leftContent={
                        <RecentApplicantsCard
                            applicants={dashboardData.recentApplicants ?? []}
                        />
                    }
                    rightContent={
                        <RecentActivityCard
                            activities={dashboardData.recentActivity ?? []}
                        />
                    }
                />
            )
    }

    {/* Jobs */ }
    {
        activeTab ===
            "jobs" && (
                <OrganizationJobsTab
                    dashboardData={
                        dashboardData
                    }
                />
            )
    }

    {/* Applicants */ }
    {
        activeTab ===
            "applicants" && (
                <ApplicantsTab
                    dashboardData={
                        dashboardData
                    }
                />
            )
    }

    {/* Hired */ }
    {
        activeTab ===
            "hired" && (
                <HiredCandidatesTab
                    dashboardData={
                        dashboardData
                    }
                />
            )
    }
                </section >
    }
};

export default DashboardContent;