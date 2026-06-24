
import DashboardDataTable from "@/components/dashboard/tables/DashboardDataTable";
import { postedJobsColumns } from "../tables/columns/postedJobsColumns";



// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

interface PostedJobsTabProps {
    dashboardData: any;
}

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────

const PostedJobsTab = ({
    dashboardData,
}: PostedJobsTabProps) => {
    const postedJobs =
        dashboardData?.postedJobs
            ?.data ?? [];

    return (
        <DashboardDataTable
            columns={postedJobsColumns}
            data={postedJobs}
            emptyTitle="No jobs posted"
            emptyDescription="You haven't posted any jobs yet."
        />
    );
};

export default PostedJobsTab;