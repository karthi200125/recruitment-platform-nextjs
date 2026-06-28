import DashboardDataTable from "@/components/dashboard/tables/DashboardDataTable";
import { appliedJobsColumns } from "../tables/columns/appliedJobsColumns";
import { DashboardData } from "@/types/dashboard";


interface AppliedJobsTabProps {
    dashboardData: DashboardData;
}

const AppliedJobsTab = ({
    dashboardData,
}: AppliedJobsTabProps) => {
    const applications =
        dashboardData?.appliedJobs
            ?.data ?? [];

    return (
        <DashboardDataTable
            columns={
                appliedJobsColumns
            }
            data={applications}
            emptyTitle="No applications found"
            emptyDescription="You haven't applied to any jobs yet."
        />
    );
};

export default AppliedJobsTab;