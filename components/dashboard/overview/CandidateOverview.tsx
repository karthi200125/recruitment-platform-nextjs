"use client";

import DashboardOverviewSection from "./DashboardOverview";

import DashboardAnalyticsChart from "./DashboardAnalyticsChart";

import {
    candidateAppliedColumns,
    candidateSavedColumns,
} from "../tables/columns/candidate-columns";

interface CandidateOverviewProps {
    applications: any[];

    savedJobs: any[];

    counts: {
        applied: number;
        saved: number;
        interviews: number;
        profileViews: number;
    };
}

const CandidateOverview = ({
    applications,
    savedJobs,
}: CandidateOverviewProps) => {
    const analyticsData = [
        {
            name: "Mon",
            value: 2,
        },

        {
            name: "Tue",
            value: 5,
        },

        {
            name: "Wed",
            value: 4,
        },

        {
            name: "Thu",
            value: 7,
        },

        {
            name: "Fri",
            value: 3,
        },

        {
            name: "Sat",
            value: 8,
        },

        {
            name: "Sun",
            value: 5,
        },
    ];

    return (
        <div className="space-y-8">
            {/* Charts */}
            <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
                <DashboardAnalyticsChart
                    title="Applications Activity"
                    data={analyticsData}
                />

                <DashboardAnalyticsChart
                    title="Interview Activity"
                    data={analyticsData}
                />
            </div>

            {/* Tables */}
            <div className="space-y-8">
                <DashboardOverviewSection
                    title="Recent Applications"
                    href="/dashboard?tab=applied"
                    columns={
                        candidateAppliedColumns
                    }
                    data={applications}
                    emptyTitle="No applications yet"
                    emptyDescription="Start applying to jobs to track your applications."
                />

                <DashboardOverviewSection
                    title="Saved Jobs"
                    href="/dashboard?tab=saved"
                    columns={
                        candidateSavedColumns
                    }
                    data={savedJobs}
                    emptyTitle="No saved jobs"
                    emptyDescription="Save jobs to quickly access them later."
                />
            </div>
        </div>
    );
};

export default CandidateOverview;