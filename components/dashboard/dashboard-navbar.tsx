"use client";

import { Role } from "@prisma/client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { useDispatch } from "react-redux";
import RoleAction from "../RoleAction";
import { DASHBOARD_TABS } from "./config/dashboardTabsConfig";

interface DashboardNavbarProps {
    role: Role;
    activeTab: string;
    isCompanyMember: boolean;
}

const DashboardNavbar = ({ role, activeTab, isCompanyMember }: DashboardNavbarProps) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const dispatch = useDispatch()

    const tabs = DASHBOARD_TABS[role];

    const handleTabChange = (tab: string) => {
        // switching tabs resets search/filter/page params from the previous tab
        // so a stale "?search=foo&page=3" doesn't silently apply to a table it
        // was never meant to filter
        const params = new URLSearchParams();
        params.set("tab", tab);
        router.push(`${pathname}?${params.toString()}`);
    };

    return (
        <div className="scrollbar-hide w-full flex items-center gap-2 overflow-x-auto mt-2 justify-between">
            <div className="gap-2">
                {tabs.map((tab) => {
                    const isActive = activeTab === tab.value;

                    return (
                        <button
                            key={tab.value}
                            type="button"
                            onClick={() => handleTabChange(tab.value)}
                            aria-current={isActive ? "page" : undefined}
                            className={`whitespace-nowrap rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200 ${isActive
                                ? "bg-emerald-50 text-emerald-600"
                                : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                                }`}
                        >
                            {tab.label}
                            {typeof tab.badge === "number" && tab.badge > 0 && (
                                <span className="ml-2 rounded-full bg-slate-900 px-1.5 py-0.5 text-[11px] font-semibold text-white">
                                    {tab.badge}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>

            <RoleAction
                role={role}
                isCompanyMember={isCompanyMember}
            />

        </div>
    );
};

export default DashboardNavbar;