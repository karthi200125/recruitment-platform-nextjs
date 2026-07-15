import { memo } from "react";
import { Role } from "@prisma/client";

import { DashboardData, DashboardTab, DashboardPagination } from "@/types/dashboard";
import { JobApplicationWithUser, JobWithCompany, User } from "@/types";

import DashboardOverview from "./overview/DashboardOverview";
import DashboardTableSection from "./tables/DashboardTableSection";

interface DashboardContentProps {
    role: Role;
    activeTab: DashboardTab;
    dashboardData: DashboardData;
    isLoading?: boolean;
}

type AnyTableData =
    | DashboardPagination<JobApplicationWithUser>
    | DashboardPagination<JobWithCompany>
    | DashboardPagination<User>;

const getTableForTab = (dashboardData: DashboardData, tab: DashboardTab): AnyTableData | null => {
    switch (dashboardData.role) {
        case "CANDIDATE": {
            const { tables } = dashboardData;
            switch (tab) {
                case "applied": return tables.appliedJobs ?? null;
                case "saved": return tables.savedJobs ?? null;
                case "interviews": return tables.interviews ?? null;
                case "followers": return tables.followers ?? null;
                case "following": return tables.following ?? null;
                default: return null;
            }
        }
        case "RECRUITER": {
            const { tables } = dashboardData;
            switch (tab) {
                case "applied": return tables.appliedJobs ?? null;
                case "saved": return tables.savedJobs ?? null;
                case "interviews": return tables.interviews ?? null;
                case "followers": return tables.followers ?? null;
                case "following": return tables.following ?? null;
                case "postedJobs": return tables.postedJobs ?? null;
                case "applicants": return tables.applicants ?? null;
                case "hired": return tables.hiredCandidates ?? null;
                default: return null;
            }
        }
        case "ORGANIZATION": {
            const { tables } = dashboardData;
            switch (tab) {
                case "jobs": return tables.postedJobs ?? null;
                case "applicants": return tables.applicants ?? null;
                case "hired": return tables.hiredCandidates ?? null;
                case "employees": return tables.employees ?? null;
                default: return null;
            }
        }
        default:
            return null;
    }
};

const DashboardContent = ({ role, activeTab, dashboardData, isLoading = false }: DashboardContentProps) => {
    if (activeTab === "overview") {
        return <DashboardOverview role={role} overview={dashboardData.overview} isLoading={isLoading} />;
    }

    const tableData = getTableForTab(dashboardData, activeTab);

    if (!tableData) {
        return (
            <div className="flex h-64 items-center justify-center rounded-[24px] border border-slate-200 bg-white text-sm text-slate-500">
                This section isn&apos;t available for your role.
            </div>
        );
    }

    return (
        <DashboardTableSection role={role} activeTab={activeTab} pagination={tableData} isLoading={isLoading} />
    );
};

export default memo(DashboardContent);