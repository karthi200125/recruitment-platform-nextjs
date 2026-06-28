
import DashboardDataTable from "@/components/dashboard/tables/DashboardDataTable";
import { profileViewsColumns } from "../tables/columns/profileViewsColumns";
import { DashboardData } from "@/types/dashboard";


interface ProfileViewsTabProps {
    dashboardData: DashboardData;
}

const ProfileViewsTab = ({
    dashboardData,
}: ProfileViewsTabProps) => {
    const profileViews =
        dashboardData?.profileViews
            ?.data ?? [];

    return (
        <DashboardDataTable
            columns={
                profileViewsColumns
            }
            data={profileViews}
            emptyTitle="No profile views"
            emptyDescription="No one has viewed your profile yet."
        />
    );
};

export default ProfileViewsTab;