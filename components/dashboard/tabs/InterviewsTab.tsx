

import DashboardDataTable from "@/components/dashboard/tables/DashboardDataTable";
import { interviewsColumns } from "../tables/columns/interviewsColumns";
import { DashboardData } from "@/types/dashboard";



interface InterviewsTabProps {
    dashboardData: DashboardData;
}

const InterviewsTab = ({
    dashboardData,
}: InterviewsTabProps) => {
    const interviews =
        dashboardData?.interviews
            ?.data ?? [];

    return (
        <DashboardDataTable
            columns={interviewsColumns}
            data={interviews}
            emptyTitle="No interviews"
            emptyDescription="No interviews scheduled yet."
        />
    );
};

export default InterviewsTab;