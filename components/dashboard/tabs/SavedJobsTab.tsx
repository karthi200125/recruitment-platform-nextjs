import DashboardDataTable from "@/components/dashboard/tables/DashboardDataTable";
import { savedJobsColumns } from "../tables/columns/savedJobsColumns";
import { DashboardData } from "@/types/dashboard";

interface SavedJobsTabProps {
    dashboardData: DashboardData;
}

const SavedJobsTab = ({
    dashboardData,
}: SavedJobsTabProps) => {
    if (
        dashboardData.role !== "CANDIDATE" &&
        dashboardData.role !== "RECRUITER"
    ) {
        return null;
    }

    const savedJobs =
        dashboardData.tables.savedJobs?.data ?? [];

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