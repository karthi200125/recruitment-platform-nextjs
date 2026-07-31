import { Role } from "@prisma/client";

import { DashboardOverviewData } from "@/types/dashboard";

import DashboardStats from "../cards/DashboardStats";
import ProfileCompletionCard from "../cards/ProfileCompletionCard";
import RecentApplicationsCard from "../cards/RecentApplicationsCard";
import RecentActivityCard from "../cards/RecentActivityCard";
import DashboardActivityChart from "../charts/DashboardActivityChart";
import ProfileViewsCard from "../cards/ProfileViewCard";
import DashboardStatusChart from "../charts/DashboardStatusChart";
import ProfileCompletionBanner from "../cards/ProfileCompletionBanner";

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


  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <CardSkeleton key={i} className="h-28" />
          ))}
        </div>
        <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-12">
          <div className="space-y-5 xl:col-span-8">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <CardSkeleton className="h-[360px]" />
              <CardSkeleton className="h-[360px]" />
            </div>
            <CardSkeleton className="h-[300px]" />
            <CardSkeleton className="h-[300px]" />
          </div>
          <div className="space-y-5 xl:col-span-4">
            <CardSkeleton className="h-[420px]" />
            <CardSkeleton className="h-[280px]" />
          </div>
        </div>
      </div>
    );
  }

  
  return (
    <div className="space-y-6">
      <DashboardStats role={role} stats={stats} />

      <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-12">
        {/* Main content: 3 explicit rows */}
        <div className={"space-y-5 xl:col-span-8"}>
          {/* Row 1 — status donut + recent activity, side by side */}
          <div className="grid grid-cols-1 items-start gap-5 md:grid-cols-2">
            <DashboardStatusChart
              title={charts.statusChart.title}
              total={charts.statusChart.total}
              data={charts.statusChart.data}
            />
            <RecentActivityCard activities={recentActivity} />
          </div>

          {/* Row 2 — bar chart, full width, its own row since it's the big one */}
          <DashboardActivityChart title={charts.activityChart.title} data={charts.activityChart.data} />

          {/* Row 3 — recent applications */}
          <RecentApplicationsCard applications={recentApplications} isLoading={false} />
        </div>

        <div className="space-y-5 xl:col-span-4">
          <div className="space-y-5 xl:sticky xl:top-6">

            {profileCompletion ? (
              <ProfileCompletionCard
                percentage={profileCompletion.percentage}
                items={profileCompletion.items}
              />
            ) : null}


            <ProfileViewsCard
              profileViews={profileViews}
            />

          </div>
        </div>
      </div>

      {profileCompletion && <ProfileCompletionBanner percentage={profileCompletion.percentage} />}
    </div>
  );
};

export default DashboardOverview;