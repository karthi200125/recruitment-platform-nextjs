"use client";

import DashboardOverviewSection from "./DashboardOverview";

import DashboardAnalyticsChart from "./DashboardAnalyticsChart";
import { OrganizationPostedColumns } from "../tables/columns/organization-columns";

interface OrganizationOverviewProps {
    postedJobs: any[];

    counts: {
        jobs: number;
        recruiters: number;
        employees: number;
        applicants: number;
    };
}

const OrganizationOverview = ({
    postedJobs,
}: OrganizationOverviewProps) => {
    const analyticsData = [
        {
            name: "Mon",
            value: 12,
        },

        {
            name: "Tue",
            value: 18,
        },

        {
            name: "Wed",
            value: 15,
        },

        {
            name: "Thu",
            value: 21,
        },

        {
            name: "Fri",
            value: 17,
        },

        {
            name: "Sat",
            value: 24,
        },

        {
            name: "Sun",
            value: 19,
        },
    ];

    return (
        <div className="space-y-8">
            {/* Charts */}
            <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
                <DashboardAnalyticsChart
                    title="Company Hiring Activity"
                    data={analyticsData}
                />

                <DashboardAnalyticsChart
                    title="Recruiters Performance"
                    data={analyticsData}
                />
            </div>

            {/* Tables */}
            <DashboardOverviewSection
                title="Company Jobs"
                href="/dashboard?tab=posted"
                columns={
                    OrganizationPostedColumns
                }
                data={postedJobs}
                emptyTitle="No jobs posted"
                emptyDescription="Start posting jobs for your organization."
            />
        </div>
    );
};

export default OrganizationOverview;