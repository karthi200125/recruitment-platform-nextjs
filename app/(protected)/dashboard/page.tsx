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

export const metadata: Metadata = {
    title: "Dashboard | Job Portal",
    description: "Manage your jobs, applications and profile.",
    robots: { index: false, follow: false },
};

interface DashboardPageProps {
    searchParams?: Record<string, string | string[] | undefined>;
}

// only trust a tab value that's actually configured for this role — otherwise
// fall back to overview instead of trying to fetch a table that doesn't exist
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

    const userId = Number(session.user.id);

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
            company={company}
            dashboardData={dashboardData}
        />
    );
};

// fetches ONLY the active tab's table, and also needs a minimal overview shell
// since DashboardData always carries `overview` — but DashboardContent never
// renders it outside the "overview" tab, so this is cheap/unused in practice.
// (see note below on the alternative if you'd rather skip this entirely)
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

// placeholder shape — never rendered when activeTab !== "overview", exists
// purely to satisfy DashboardData's required `overview` field cheaply
const EMPTY_OVERVIEW = {
    stats: {},
    charts: {
        statusChart: { title: "", total: 0, data: [] },
        activityChart: { title: "", data: [] },
    },
    recentActivity: [],
};

export default DashboardPage;