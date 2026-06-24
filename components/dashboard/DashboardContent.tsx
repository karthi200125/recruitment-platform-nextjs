import { Role } from "@prisma/client";

import CandidateDashboardContent from "@/components/dashboard/content/CandidateDashboardContent";
import RecruiterDashboardContent from "./content/RecruiterDashboardContent";
import OrganizationDashboardContent from "./content/OrganizationDashboardContent";

interface DashboardContentProps {
    activeTab: string;

    role: Role;

    dashboardData: any;
}

const DashboardContent = ({
    activeTab,
    role,
    dashboardData,
}: DashboardContentProps) => {
    // Candidate
    if (role === "CANDIDATE") {
        return (
            <CandidateDashboardContent
                activeTab={activeTab}
                role={role}
                dashboardData={
                    dashboardData
                }
            />
        );
    }

    // Recruiter
    if (role === "RECRUITER") {
        return (
            <RecruiterDashboardContent
                activeTab={activeTab}
                role={role}
                dashboardData={
                    dashboardData
                }
            />
        );
    }

    // Organization
    if (role === "ORGANIZATION") {
        return (
            <OrganizationDashboardContent
                activeTab={activeTab}
                role={role}
                dashboardData={
                    dashboardData
                }
            />
        );
    }

    return null;
};

export default DashboardContent;