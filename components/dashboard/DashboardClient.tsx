"use client";

import { Role } from "@prisma/client";
import { useSearchParams } from "next/navigation";
import { memo } from "react";

import { User } from "@/types";
import { DashboardData } from "@/types/dashboard";

import CompanyVerificationBanner from "@/app/(protected)/create-company/CompanyVerificationBanner";
import CompanyInvitationBanner from "@/app/(protected)/dashboard/(inviteRecruiter)/CompanyInvitationBanner";
import { PendingCompanyInvitation } from "@/types/company-employee";
import { DASHBOARD_TABS } from "./config/dashboardTabsConfig";
import DashboardNavbar from "./dashboard-navbar";
import DashboardContent from "./DashboardContent";

interface DashboardCompany {
  id: number;
  companyIsVerified: boolean;
}

interface DashboardClientProps {
  user: Omit<Pick<User, "id" | "role" | "username" | "userImage">, "role"> & { role: Role };
  dashboardData: DashboardData;
  company: DashboardCompany | null;
  pendingInvitation: PendingCompanyInvitation | null;
  isCompanyMember: boolean;
}

const DashboardClient = ({ user, dashboardData, company, isCompanyMember, pendingInvitation }: DashboardClientProps) => {
  const searchParams = useSearchParams();

  const allowedTabs = DASHBOARD_TABS[user.role];
  const requestedTab = searchParams.get("tab") ?? "overview";

  const activeTab = allowedTabs.some(({ value }) => value === requestedTab) ? requestedTab : "overview";

  return (
    <main className="min-h-screen space-y-6">

      {user.role === Role.ORGANIZATION &&
        company &&
        !company.companyIsVerified && (
          <CompanyVerificationBanner
            companyIsVerified={company.companyIsVerified}
          />
        )}

      {user.role === Role.RECRUITER &&
        pendingInvitation && (
          <CompanyInvitationBanner
            invitation={pendingInvitation}
          />
        )}

      <DashboardNavbar role={user.role} isCompanyMember={isCompanyMember} activeTab={activeTab} />

      <DashboardContent role={user.role} activeTab={activeTab as any} dashboardData={dashboardData} />
    </main>
  );
};

export default memo(DashboardClient);