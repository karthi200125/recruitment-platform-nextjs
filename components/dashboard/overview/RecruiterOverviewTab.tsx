
import DashboardActivityChart from "@/components/dashboard/charts/DashboardActivityChart";
import RecentActivityCard from "@/components/dashboard/cards/RecentActivityCard";
import RecentApplicationsCard from "@/components/dashboard/cards/RecentApplicationsCard";

import { Role } from "@prisma/client";
import DashboardStats from "../cards/DashboardStats";
import DashboardStatusChart from "../charts/DashboardStatusChart ";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

interface RecruiterOverviewTabProps {
    role: Role;
    dashboardData: any;
}

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────

const RecruiterOverviewTab = ({
    role,
    dashboardData,
}: RecruiterOverviewTabProps) => {
    const stats =
        dashboardData?.stats ?? {};

    const hiringStatusChart =
        dashboardData?.charts
            ?.hiringStatusChart ?? [];

    const applicantsActivityChart =
        dashboardData?.charts
            ?.applicantsActivityChart ??
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
                {/* Hiring Funnel */}
                <div className="xl:col-span-4">
                    <div className="h-[320px] overflow-hidden rounded-[24px] border border-slate-200 bg-white">
                        <DashboardStatusChart
                            title="Hiring Funnel"
                            total={
                                stats
                                    ?.totalApplicationsCount
                                    ?.count ?? 0
                            }
                            data={
                                hiringStatusChart
                            }
                        />
                    </div>
                </div>

                {/* Applicants Activity */}
                <div className="xl:col-span-8">
                    <div className="h-[320px] overflow-hidden rounded-[24px] border border-slate-200 bg-white">
                        <DashboardActivityChart
                            title="Applicants Activity"
                            data={
                                applicantsActivityChart
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

export default RecruiterOverviewTab;