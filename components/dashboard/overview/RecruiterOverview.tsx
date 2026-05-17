"use client";

import DashboardOverviewSection from "./DashboardOverview";

import DashboardAnalyticsChart from "./DashboardAnalyticsChart";

import {
    recruiterPostedColumns,
} from "../tables/columns/recruiter-columns";

interface RecruiterOverviewProps {
    postedJobs: any[];

    counts: {
        postedJobs: number;
        applicants: number;
        shortlisted: number;
        interviews: number;
    };
}

const RecruiterOverview = ({
    postedJobs,
}: RecruiterOverviewProps) => {
    const analyticsData = [
        {
            name: "Mon",
            value: 4,
        },

        {
            name: "Tue",
            value: 8,
        },

        {
            name: "Wed",
            value: 6,
        },

        {
            name: "Thu",
            value: 11,
        },

        {
            name: "Fri",
            value: 7,
        },

        {
            name: "Sat",
            value: 13,
        },

        {
            name: "Sun",
            value: 9,
        },
    ];

    return (
        <div className="space-y-8">
            {/* Charts */}
            <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
                <DashboardAnalyticsChart
                    title="Hiring Activity"
                    data={analyticsData}
                />

                <DashboardAnalyticsChart
                    title="Applicants Growth"
                    data={analyticsData}
                />
            </div>

            {/* Tables */}
            <DashboardOverviewSection
                title="Recent Posted Jobs"
                href="/dashboard?tab=posted"
                columns={recruiterPostedColumns}
                data={postedJobs}
                emptyTitle="No jobs posted"
                emptyDescription="Post jobs to start receiving applications."
            />
        </div>
    );
};

export default RecruiterOverview;