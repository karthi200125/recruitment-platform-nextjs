
import DashboardDataTable from "@/components/dashboard/tables/DashboardDataTable";
import { postedJobsColumns } from "../tables/columns/postedJobsColumns";
import { DashboardData } from "@/types/dashboard";


interface PostedJobsTabProps {
    dashboardData: DashboardData;
}

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