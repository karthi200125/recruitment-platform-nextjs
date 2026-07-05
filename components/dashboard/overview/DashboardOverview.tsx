import { ReactNode } from "react";
import { Role } from "@prisma/client";

import DashboardStats from "../cards/DashboardStats";
import DashboardStatusChart from "../charts/DashboardStatusChart";
import DashboardActivityChart from "../charts/DashboardActivityChart";

import {
  DashboardActivityData,
  DashboardAnalyticsData,
  DashboardStatusChartData,
} from "@/types/dashboard";
import ProfileCompletionCard from "../cards/ProfileCompletionCard";
import ProfileViewsCard from "../cards/ProfileViewCard";
import RecentApplicationsCard from "../cards/RecentApplicationsCard";
import RecentActivityCard from "../cards/RecentActivityCard";

interface DashboardOverviewProps {
  role: Role;

  stats: Record<string, DashboardAnalyticsData>;

  statusChart: {
    title: string;
    total: number;
    data: DashboardStatusChartData[];
  };

  activityChart: {
    title: string;
    data: DashboardActivityData[];
  };

  recentSection: ReactNode;

  profileSection: ReactNode;
}

const DashboardOverview = ({
  role,
  stats,
  statusChart,
  activityChart,
  recentSection,
  profileSection,
}: DashboardOverviewProps) => {
  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <DashboardStats
        role={''}
        stats={''}
      />

      {/* Charts Grid */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
        {/* Status Chart */}
        <div className="xl:col-span-4">
          <div className="h-[320px] rounded-[24px] border border-slate-200 bg-white">
            <DashboardStatusChart
              title="Application Status"
              total={''}
              data={''}
            />

          </div>
        </div>

        {/* Activity Chart */}
        <div className="xl:col-span-5">
          <div className="h-[320px] overflow-hidden rounded-[24px] border border-slate-200 bg-white">
            <DashboardActivityChart
              title="Application Activity"
              data={''}
            />
          </div>
        </div>

        {/* Right Column */}
        <div className="xl:col-span-3">
          <div className="flex h-full flex-col gap-5">
            {/* Profile Completion */}
            <div className="flex-1 overflow-hidden rounded-[24px] border border-slate-200 bg-white">
              <ProfileCompletionCard
                percentage={''}
                items={''}
              />
            </div>

            {/* Profile Views */}
            <div className="h-[180px] overflow-hidden rounded-[24px] border border-slate-200 bg-white">
              <ProfileViewsCard
                count={''}
                growth={''}
                isPositive={false}
              />
            </div>

          </div>
        </div>
      </div>

      {/* Recent Applications */}
      <div className="xl:col-span-8">
        <div className="h-[360px] overflow-hidden rounded-[24px] border border-slate-200 bg-white">
          <RecentApplicationsCard
            applications={''}
          />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="xl:col-span-4">
        <div className="h-[360px] overflow-hidden rounded-[24px] border border-slate-200 bg-white">
          <RecentActivityCard
            activities={''}
          />
        </div>
      </div>
    </div>
    </div >
  );
};

export default DashboardOverview;