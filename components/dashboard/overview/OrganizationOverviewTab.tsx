
import DashboardActivityChart from "@/components/dashboard/charts/DashboardActivityChart";
import { Role } from "@prisma/client";
import DashboardStats from "../cards/DashboardStats";
import DashboardStatusChart from "../charts/DashboardStatusChart";
import { DashboardData } from "@/types/dashboard";

interface OrganizationOverviewTabProps {
    role: Role;
    dashboardData: DashboardData;
}

const OrganizationOverviewTab = ({
    role,
    dashboardData,
}: OrganizationOverviewTabProps) => {
    const stats =
        dashboardData?.stats ?? {};

    const companyHiringChart =
        dashboardData?.charts
            ?.companyHiringChart ?? [];

    const recruitersPerformanceChart =
        dashboardData?.charts
            ?.recruitersPerformanceChart ??
        [];

    const recentApplicants =
        dashboardData?.recentApplicants ??
        [];

    const recentActivity =
        dashboardData?.recentActivity ??
        [];

    return (
        <div className="space-y-6">
            {/* KPI */}
            <DashboardStats
                role={role}
                stats={dashboardData.stats}
            />

            {/* Charts */}
            <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
                {/* Hiring Chart */}
                <div className="xl:col-span-4">
                    <div className="h-[320px] overflow-hidden rounded-[24px] border border-slate-200 bg-white">
                        <DashboardStatusChart
                            title="Company Hiring"
                            total={
                                stats
                                    ?.totalApplicationsCount
                                    ?.count ?? 0
                            }
                            data={
                                companyHiringChart
                            }
                        />
                    </div>
                </div>

                {/* Recruiters Performance */}
                <div className="xl:col-span-8">
                    <div className="h-[320px] overflow-hidden rounded-[24px] border border-slate-200 bg-white">
                        <DashboardActivityChart
                            title="Recruiters Performance"
                            data={
                                recruitersPerformanceChart
                            }
                        />
                    </div>
                </div>

                {/* Recent Applicants */}
                <div className="xl:col-span-8">
                    <div className="h-[360px] overflow-hidden rounded-[24px] border border-slate-200 bg-white">
                        {/* <RecentApplicationsCard
                            applications={
                                recentApplicants
                            }
                        /> */}
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="xl:col-span-4">
                    <div className="h-[360px] overflow-hidden rounded-[24px] border border-slate-200 bg-white">
                        {/* <RecentActivityCard
                            activities={
                                recentActivity
                            }
                        /> */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrganizationOverviewTab;