import { Role } from "@prisma/client";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth/authOptions";
import { db } from "@/lib/db";

import DashboardClient from "@/components/dashboard/DashboardClient";
import { DASHBOARD_TABS } from "@/components/dashboard/config/dashboardTabsConfig";
import { DashboardData, DashboardTab } from "@/types/dashboard";
import { TAB_PAGE_PARAM, TAB_TABLE_KEY } from "@/actions/dashboard/utils/tabTableKey";
import { getDashboardTable } from "@/actions/dashboard/getDashboardTable";
import { getDashboardOverview } from "@/actions/dashboard/getDashboardOverview";
import { getPendingCompanyInvitation } from "@/actions/company/getPendingCompanyInvitation";
import { getAcceptedCompanyMembership } from "@/actions/company/getAcceptedCompanyMembership";

export const metadata: Metadata = {
    title: "Dashboard | Job Portal",
    description: "Manage your jobs, applications and profile.",
    robots: { index: false, follow: false },
};

interface DashboardPageProps {
    searchParams?: Record<string, string | string[] | undefined>;
}

const resolveActiveTab = (role: Role, requested: string | undefined): DashboardTab => {
    const allowed = DASHBOARD_TABS[role];
    const match = allowed.find((tab) => tab.value === requested);
    return match?.value ?? "overview";
};

const DashboardPage = async ({ searchParams = {} }: DashboardPageProps) => {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        redirect("/signin");
    }

    const userId = session.user.id;

    if (!userId) {
        redirect("/signin");
    }

    const role: Role = (session.user.role as Role | null) ?? Role.CANDIDATE;
    const requestedTab = Array.isArray(searchParams.tab) ? searchParams.tab[0] : searchParams.tab;
    const activeTab = resolveActiveTab(role, requestedTab);

    const company =
        role === "ORGANIZATION"
            ? await db.company.findUnique({
                where: { userId },
                select: { id: true, companyIsVerified: true },
            })
            : null;

    const pendingInvitation =
        role === Role.RECRUITER
            ? await getPendingCompanyInvitation()
            : null;

    // const isCompanyMember = role === Role.RECRUITER
    //     ? await getAcceptedCompanyMembership(userId)
    //     : false;

    const membership = await getAcceptedCompanyMembership(userId);
    const isCompanyMember = !!membership;

    const dashboardData: DashboardData =
        activeTab === "overview"
            ? { role, overview: await getDashboardOverview(userId, role), tables: {} }
            : await buildTableDashboardData(role, userId, activeTab, searchParams);

    return (
        <DashboardClient
            user={{
                id: userId,
                role,
                username: session.user.username,
                userImage: session.user.profileImage,
            }}
            isCompanyMember={isCompanyMember}
            company={company}
            dashboardData={dashboardData}
            pendingInvitation={pendingInvitation}
        />
    );
};

const buildTableDashboardData = async (
    role: Role,
    userId: number,
    activeTab: DashboardTab,
    searchParams: Record<string, string | string[] | undefined>
): Promise<DashboardData> => {
    const pageParamKey = TAB_PAGE_PARAM[activeTab] ?? "page";
    const tableKey = TAB_TABLE_KEY[activeTab];

    const tableData = await getDashboardTable({ userId, role, tab: activeTab, pageParamKey, searchParams });

    const tables = tableKey && tableData ? { [tableKey]: tableData } : {};

    return {
        role,
        overview: EMPTY_OVERVIEW,
        tables,
    } as DashboardData;
};

const EMPTY_OVERVIEW = {
    stats: {},
    charts: {
        statusChart: { title: "", total: 0, data: [] },
        activityChart: { title: "", data: [] },
    },
    recentActivity: [],
};

export default DashboardPage;