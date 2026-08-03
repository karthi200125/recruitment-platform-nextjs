import DashboardDataTable from "@/components/dashboard/tables/DashboardDataTable";
import { applicantsColumns } from "../tables/columns/applicantsColumns";
import { DashboardData } from "@/types/dashboard";

interface ApplicantsTabProps {
    dashboardData: DashboardData;
}

const ApplicantsTab = ({
    dashboardData,
}: ApplicantsTabProps) => {
    const applicants =
        dashboardData.role === "RECRUITER" ||
            dashboardData.role === "ORGANIZATION"
            ? dashboardData.tables.applicants?.data ?? []
            : [];

    return (
        <DashboardDataTable
            columns={applicantsColumns}
            data={applicants}
            emptyTitle="No applicants found"
            emptyDescription="No candidates have applied yet."
        />
    );
};

export default ApplicantsTab;