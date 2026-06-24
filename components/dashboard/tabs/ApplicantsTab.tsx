
import DashboardDataTable from "@/components/dashboard/tables/DashboardDataTable";
import { applicantsColumns } from "../tables/columns/applicantsColumns";



// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

interface ApplicantsTabProps {
    dashboardData: any;
}

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────

const ApplicantsTab = ({
    dashboardData,
}: ApplicantsTabProps) => {
    const applicants =
        dashboardData?.applicants
            ?.data ?? [];

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