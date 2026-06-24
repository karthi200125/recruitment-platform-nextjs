import { Role } from "@prisma/client";
import DashboardStats from "../cards/DashboardStats";
import DashboardStatusChart from "../charts/DashboardStatusChart ";
import DashboardActivityChart from "../charts/DashboardActivityChart";
import ProfileCompletionCard from "../cards/ProfileCompletionCard";
import ProfileViewsCard from "../cards/ProfileViewCard";
import RecentApplicationsCard from "../cards/RecentApplicationsCard";
import RecentActivityCard from "../cards/RecentActivityCard";

interface CandidateOverviewTabProps {
    role: Role;

    dashboardData: any;
}

const CandidateOverview = ({
    role,
    dashboardData,
}: CandidateOverviewTabProps) => {

    const applicationStatusChart = dashboardData?.charts?.applicationStatusChart ?? [];
    const applicationActivityChart = dashboardData?.charts?.applicationActivityChart ?? [];
    const profileCompletion = dashboardData?.profileCompletion;
    const recentActivity = dashboardData?.recentActivity ?? [];
    const recentApplications = dashboardData?.recentApplications ?? [];
    

    return (
        <div className="space-y-6">
            {/* KPI Cards */}
            <DashboardStats
                role={role}
                stats={dashboardData.stats}
            />

            {/* Charts Grid */}
            <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
                {/* Status Chart */}
                <div className="xl:col-span-4">
                    <div className="h-[320px] rounded-[24px] border border-slate-200 bg-white">
                        <DashboardStatusChart
                            title="Application Status"
                            total={dashboardData?.stats?.appliedJobs?.count ?? 0}
                            data={applicationStatusChart}
                        />

                    </div>
                </div>

                {/* Activity Chart */}
                <div className="xl:col-span-5">
                    <div className="h-[320px] overflow-hidden rounded-[24px] border border-slate-200 bg-white">
                        <DashboardActivityChart
                            title="Application Activity"
                            data={
                                applicationActivityChart
                            }
                        />
                    </div>
                </div>

                {/* Right Column */}
                <div className="xl:col-span-3">
                    <div className="flex h-full flex-col gap-5">
                        {/* Profile Completion */}
                        <div className="flex-1 overflow-hidden rounded-[24px] border border-slate-200 bg-white">
                            <ProfileCompletionCard
                                percentage={
                                    profileCompletion?.percentage ??
                                    0
                                }
                                items={
                                    profileCompletion?.items ??
                                    []
                                }
                            />
                        </div>

                        {/* Profile Views */}
                        <div className="h-[180px] overflow-hidden rounded-[24px] border border-slate-200 bg-white">
                            {/* <ProfileViewsCard
                                count={
                                    stats
                                        ?.profileViews
                                        ?.count ??
                                    0
                                }
                                growth={
                                    stats
                                        ?.profileViews
                                        ?.growth ??
                                    0
                                }
                                isPositive={
                                    stats
                                        ?.profileViews
                                        ?.isPositive ??
                                    false
                                }
                            /> */}
                        </div>
                    </div>
                </div>

                {/* Recent Applications */}
                <div className="xl:col-span-8">
                    <div className="h-[360px] overflow-hidden rounded-[24px] border border-slate-200 bg-white">
                        {/* <RecentApplicationsCard
                            applications={
                                recentApplications
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

export default CandidateOverview;