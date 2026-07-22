"use client";

import { Role } from "@prisma/client";
import {
    usePathname,
    useRouter,
    useSearchParams,
} from "next/navigation";

import RoleAction from "../RoleAction";
import { DASHBOARD_TABS } from "./config/dashboardTabsConfig";

interface DashboardNavbarProps {
    role: Role;
    activeTab: string;
    isCompanyMember: boolean;
}

const DashboardNavbar = ({
    role,
    activeTab,
    isCompanyMember,
}: DashboardNavbarProps) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const tabs = DASHBOARD_TABS[role];

    const handleTabChange = (tab: string) => {
        if (tab === activeTab) return;

        const params = new URLSearchParams(
            searchParams.toString()
        );

        params.set("tab", tab);
        router.push(`${pathname}?${params.toString()}`);
    };

    return (
        <div className="sticky top-[60px] z-20 -mx-4 border-b border-slate-200 bg-white px-4 py-3 sm:static sm:mx-0 sm:border-0 sm:px-0 sm:py-2">

            <div className="flex items-center gap-3">
                {/* Tabs */}
                <div className="scrollbar-hide flex-1 overflow-x-auto">
                    <div className="flex min-w-max items-center gap-2 pr-2">
                        {tabs.map((tab) => {
                            const isActive =
                                activeTab === tab.value;

                            return (
                                <button
                                    key={tab.value}
                                    type="button"
                                    onClick={() =>
                                        handleTabChange(
                                            tab.value
                                        )
                                    }
                                    aria-current={
                                        isActive
                                            ? "page"
                                            : undefined
                                    }
                                    className={`flex snap-start items-center whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium transition-all duration-200 ${isActive
                                        ? "bg-emerald-50 text-emerald-600"
                                        : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                                        }`}
                                >
                                    {tab.label}

                                    {typeof tab.badge ===
                                        "number" &&
                                        tab.badge > 0 && (
                                            <span className="ml-2 rounded-full bg-slate-900 px-1.5 py-0.5 text-[11px] font-semibold text-white">
                                                {tab.badge}
                                            </span>
                                        )}
                                </button>
                            );
                        })}

                    </div>

                </div>

                {/* Fixed Action Button */}
                <div className="flex-shrink-0">

                    <RoleAction
                        role={role}
                        isCompanyMember={
                            isCompanyMember
                        }
                    />

                </div>

            </div>

        </div>
    );
};

export default DashboardNavbar;