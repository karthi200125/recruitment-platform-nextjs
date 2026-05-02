"use client";

import { memo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Briefcase, Users, Building2, LayoutDashboard } from "lucide-react";

import { getCompaniesEmployees } from "@/actions/getCompanyEmployees";
import EmployeesSkeleton from "@/Skeletons/EmployeesSkeleton";
import Employee from "../../dashboard/employees/Employee";
import JobList from "../../jobs/JobLists/JobList";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Company {
    companyAbout?: string | null;
    jobs?: any[];
}

interface ProfileUser {
    id: number;
    employees?: number[];
}

// ─── Empty state ──────────────────────────────────────────────────────────────

const Empty = ({ icon: Icon, text }: { icon: React.ElementType; text: string }) => (
    <div className="flex flex-col items-center justify-center gap-3 py-14 text-center">
        <div className="w-11 h-11 rounded-2xl bg-slate-100 flex items-center justify-center">
            <Icon className="w-5 h-5 text-slate-400" strokeWidth={1.75} />
        </div>
        <p className="text-sm text-slate-400">{text}</p>
    </div>
);

// ─── AboutCompanyProfile ──────────────────────────────────────────────────────

export const AboutCompanyProfile = memo(({ company }: { company?: Company | null }) => (
    <div className="space-y-3">
        {company?.companyAbout ? (
            <p className="text-sm text-slate-600 leading-relaxed">{company.companyAbout}</p>
        ) : (
            <Empty icon={Building2} text="No company description provided yet." />
        )}
    </div>
));
AboutCompanyProfile.displayName = "AboutCompanyProfile";

// ─── CompanyJobProfile ────────────────────────────────────────────────────────

export const CompanyJobProfile = memo(({ company }: { company?: Company | null }) => {
    const jobs = company?.jobs ?? [];

    if (!jobs.length) return <Empty icon={Briefcase} text="No jobs posted yet." />;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {jobs.map((job) => (
                <div key={job.id} className="rounded-2xl border border-slate-200 bg-white p-4 hover:border-indigo-200 hover:shadow-sm hover:-translate-y-0.5 transition-all duration-200">
                    <JobList job={job} />
                </div>
            ))}
        </div>
    );
});
CompanyJobProfile.displayName = "CompanyJobProfile";

// ─── CompanyEmployees ─────────────────────────────────────────────────────────

export const CompanyEmployees = memo(({ employeeIds }: { employeeIds?: number[] }) => {
    const { data = [], isPending } = useQuery({
        queryKey: ["company-employees", employeeIds],
        queryFn: () => getCompaniesEmployees(employeeIds || []),
        enabled: !!employeeIds?.length,
    });

    if (isPending) return <EmployeesSkeleton />;
    if (!data.length) return <Empty icon={Users} text="No employees yet." />;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {data.map((emp: any) => (
                <Employee key={emp.id} user={emp} isVerify={false} />
            ))}
        </div>
    );
});
CompanyEmployees.displayName = "CompanyEmployees";

// ─── CompanySlides ────────────────────────────────────────────────────────────

type TabKey = "Home" | "Employees" | "Jobs";

const TABS: { key: TabKey; icon: React.ElementType; label: string }[] = [
    { key: "Home", icon: LayoutDashboard, label: "Overview" },
    { key: "Employees", icon: Users, label: "Employees" },
    { key: "Jobs", icon: Briefcase, label: "Jobs" },
];

interface CompanySlidesProps {
    company?: Company | null;
    profileUser?: ProfileUser | null;
}

const CompanySlides = ({ company, profileUser }: CompanySlidesProps) => {
    const [tab, setTab] = useState<TabKey>("Home");

    const jobCount = company?.jobs?.length ?? 0;
    const empCount = profileUser?.employees?.length ?? 0;

    const countMap: Record<TabKey, number | null> = {
        Home: null,
        Employees: empCount,
        Jobs: jobCount,
    };

    return (
        <div className="w-full rounded-2xl border border-slate-200 bg-white overflow-hidden">

            {/* Tab bar */}
            <div className="flex items-center border-b border-slate-100 px-1">
                {TABS.map(({ key, icon: Icon, label }) => {
                    const isActive = tab === key;
                    const count = countMap[key];
                    return (
                        <button
                            key={key}
                            onClick={() => setTab(key)}
                            className={`inline-flex items-center gap-1.5 px-4 py-3 text-sm font-semibold border-b-2 transition-all duration-200 whitespace-nowrap -mb-px ${isActive
                                    ? "border-indigo-600 text-indigo-600"
                                    : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                                }`}
                        >
                            <Icon className={`w-4 h-4 ${isActive ? "" : "opacity-70"}`} strokeWidth={isActive ? 2.5 : 1.75} />
                            {label}
                            {count !== null && count > 0 && (
                                <span className={`text-[11px] font-bold rounded-full px-1.5 py-0.5 ${isActive ? "bg-indigo-100 text-indigo-700" : "bg-slate-100 text-slate-500"}`}>
                                    {count}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Tab content */}
            <div className="p-5">
                {tab === "Home" && <AboutCompanyProfile company={company} />}
                {tab === "Employees" && <CompanyEmployees employeeIds={profileUser?.employees} />}
                {tab === "Jobs" && <CompanyJobProfile company={company} />}
            </div>
        </div>
    );
};

export default CompanySlides;