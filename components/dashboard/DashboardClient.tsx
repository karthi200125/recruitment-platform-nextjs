"use client";

import dynamic from "next/dynamic";
import { memo, Suspense } from "react";
import { Role } from "@prisma/client";
import { useSearchParams } from "next/navigation";

import { User } from "@/types";
import { DashboardData } from "@/types/dashboard";
import { PendingCompanyInvitation } from "@/types/company-employee";
import { DASHBOARD_TABS } from "./config/dashboardTabsConfig";
import DashboardNavbar from "./DashboardNavbar";

const DashboardContent = dynamic(() => import("./DashboardContent"), {
  ssr: true,
  loading: () => <ContentSkeleton />,
});

const CompanyVerificationBanner = dynamic(
  () => import("@/app/(protected)/create-company/CompanyVerificationBanner")
);
const CompanyInvitationBanner = dynamic(
  () => import("@/app/(protected)/dashboard/(inviteRecruiter)/CompanyInvitationBanner")
);

const ContentSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-28 rounded-[24px] border border-slate-200 bg-slate-100" />
      ))}
    </div>
    <div className="h-[360px] rounded-[24px] border border-slate-200 bg-slate-100" />
  </div>
);


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

const DashboardClient = ({
  user, dashboardData, company, isCompanyMember, pendingInvitation,
}: DashboardClientProps) => {
  const searchParams = useSearchParams();

  const allowedTabs = DASHBOARD_TABS[user.role];
  const requestedTab = searchParams.get("tab") ?? "overview";
  const activeTab = allowedTabs.some(({ value }) => value === requestedTab)
    ? requestedTab
    : "overview";

  return (
    <main className="min-h-screen space-y-6">

      {user.role === Role.ORGANIZATION && company && !company.companyIsVerified && (
        <CompanyVerificationBanner companyIsVerified={company.companyIsVerified} />
      )}

      {user.role === Role.RECRUITER && pendingInvitation && (
        <CompanyInvitationBanner invitation={pendingInvitation} />
      )}

      <DashboardNavbar
        role={user.role}
        isCompanyMember={isCompanyMember}
        activeTab={activeTab}
      />

      <Suspense fallback={<ContentSkeleton />}>
        <DashboardContent
          role={user.role}
          activeTab={activeTab as any}
          dashboardData={dashboardData}
        />
      </Suspense>

    </main>
  );
};

export default memo(DashboardClient);