
import DashboardDataTable from "@/components/dashboard/tables/DashboardDataTable";
import { savedJobsColumns } from "../tables/columns/savedJobsColumns";

interface SavedJobsTabProps {
    dashboardData: any;
}

const SavedJobsTab = ({
    dashboardData,
}: SavedJobsTabProps) => {
    const savedJobs =
        dashboardData?.savedJobs
            ?.data ?? [];

    return (
        <DashboardDataTable
            columns={savedJobsColumns}
            data={savedJobs}
            emptyTitle="No saved jobs"
            emptyDescription="Save jobs to view them later."
        />
    );
};

export default SavedJobsTab;