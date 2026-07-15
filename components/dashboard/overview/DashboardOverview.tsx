import { Role } from "@prisma/client";

import { DashboardOverviewData } from "@/types/dashboard";

import DashboardStats from "../cards/DashboardStats";
import ProfileCompletionCard from "../cards/ProfileCompletionCard";
import RecentApplicationsCard from "../cards/RecentApplicationsCard";
import RecentActivityCard from "../cards/RecentActivityCard";
import DashboardActivityChart from "../charts/DashboardActivityChart";
import ProfileViewsCard from "../cards/ProfileViewCard";
import DashboardStatusChart from "../charts/DashboardStatusChart";

interface DashboardOverviewProps {
  role: Role;
  overview: DashboardOverviewData;
  isLoading?: boolean;
}

const CardSkeleton = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse rounded-[24px] border border-slate-200 bg-slate-100 ${className}`} />
);

const DashboardOverview = ({ role, overview, isLoading = false }: DashboardOverviewProps) => {
  const {
    stats,
    charts,
    profileCompletion,
    profileViews,
    recentApplications = [],
    recentActivity,
  } = overview;
  
  const hasSidebar = Boolean(profileCompletion || (profileViews && profileViews.length > 0));

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <CardSkeleton key={i} className="h-28" />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
          <CardSkeleton className="h-[320px] xl:col-span-4" />
          <CardSkeleton className="h-[320px] xl:col-span-5" />
          <CardSkeleton className="h-[320px] xl:col-span-3" />
        </div>
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
          <CardSkeleton className="h-[360px] xl:col-span-8" />
          <CardSkeleton className="h-[360px] xl:col-span-4" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DashboardStats role={role} stats={stats} />

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
        <div className={hasSidebar ? "xl:col-span-4" : "xl:col-span-6"}>
          <div className="h-[320px] overflow-hidden rounded-[24px] border border-slate-200 bg-white">
            <DashboardStatusChart
              title={charts.statusChart.title}
              total={charts.statusChart.total}
              data={charts.statusChart.data}
            />
          </div>
        </div>

        <div className={hasSidebar ? "xl:col-span-5" : "xl:col-span-6"}>
          <div className="h-[320px] overflow-hidden rounded-[24px] border border-slate-200 bg-white">
            <DashboardActivityChart title={charts.activityChart.title} data={charts.activityChart.data} />
          </div>
        </div>

        {hasSidebar && (
          <div className="xl:col-span-3">
            <div className="flex h-full flex-col gap-5">
              {profileCompletion && (
                <div className="flex-1 overflow-hidden rounded-[24px] border border-slate-200 bg-white">
                  <ProfileCompletionCard
                    percentage={profileCompletion.percentage}
                    items={profileCompletion.items}
                  />
                </div>
              )}

              {profileViews && profileViews.length > 0 && (
                <div className="h-[180px] overflow-hidden rounded-[24px] border border-slate-200 bg-white">
                  <ProfileViewsCard profileViews={profileViews} />
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
        <div className="xl:col-span-8">
          <div className="h-[360px] overflow-hidden rounded-[24px] border border-slate-200 bg-white">
            <RecentApplicationsCard applications={recentApplications} isLoading={false} />
          </div>
        </div>

        <div className="xl:col-span-4">
          <div className="h-[360px] overflow-hidden rounded-[24px] border border-slate-200 bg-white">
            <RecentActivityCard activities={recentActivity} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;