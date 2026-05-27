"use client";

import DashboardDataTable from "@/components/dashboard/tables/DashboardDataTable";
import { organizationJobsColumns } from "../tables/columns/organizationJobsColumns";



// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

interface OrganizationJobsTabProps {
    dashboardData: any;
}

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────

const OrganizationJobsTab = ({
    dashboardData,
}: OrganizationJobsTabProps) => {
    const jobs =
        dashboardData?.jobs?.data ??
        [];

    return (
        <DashboardDataTable
            columns={
                organizationJobsColumns
            }
            data={jobs}
            emptyTitle="No jobs found"
            emptyDescription="No organization jobs are available yet."
        />
    );
};

export default OrganizationJobsTab;