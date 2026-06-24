
import DashboardDataTable from "@/components/dashboard/tables/DashboardDataTable";
import { hiredCandidatesColumns } from "../tables/columns/hiredCandidatesColumns";



// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

interface HiredCandidatesTabProps {
    dashboardData: any;
}

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────

const HiredCandidatesTab = ({
    dashboardData,
}: HiredCandidatesTabProps) => {
    const hiredCandidates =
        dashboardData?.hiredCandidates
            ?.data ?? [];

    return (
        <DashboardDataTable
            columns={
                hiredCandidatesColumns
            }
            data={hiredCandidates}
            emptyTitle="No hired candidates"
            emptyDescription="No candidates have been hired yet."
        />
    );
};

export default HiredCandidatesTab;