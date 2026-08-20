"use client";

import { memo, useState } from "react";
import { Briefcase, Users, Building2, LayoutDashboard } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import noProfile from "@/public/noProfile.webp";
import JobList from "@/components/Job/JobLists/JobList";

// ─── Types ────────────────────────────────────────────────────────────────────

interface EmployeeUser {
    id: number;
    username: string;
    userImage?: string | null;
}

interface Company {
    companyAbout?: string | null;
    jobs?: any[];
}

interface ProfileUser {
    id: number;
    employeeUsers?: EmployeeUser[];
}

interface CompanySlidesProps {
    company?: Company | null;
    profileUser?: ProfileUser | null;
}

type TabKey = "Home" | "Employees" | "Jobs";

// ─── CompanyAvatar ────────────────────────────────────────────────────────────

function CompanyAvatar({ name, image, id }: { name: string; image?: string | null; id: number }) {
    const initials = name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    return (
        <Link
            href={`/userProfile/${id}`}
            className="group flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 hover:border-indigo-200 hover:shadow-sm hover:-translate-y-0.5 transition-all duration-200"
        >
            {/* Avatar */}
            <div className="relative w-11 h-11 flex-shrink-0">
                {image ? (
                    <Image
                        src={image}
                        alt={name}
                        width={44}
                        height={44}
                        className="w-11 h-11 rounded-full object-cover border border-slate-200"
                    />
                ) : (
                    <div className="w-11 h-11 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-sm font-bold text-indigo-600">
                        {initials}
                    </div>
                )}
            </div>

            {/* Name */}
            <p className="text-sm font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors duration-200 capitalize truncate">
                {name}
            </p>
        </Link>
    );
}

// ─── Tab config ───────────────────────────────────────────────────────────────

const TABS: { key: TabKey; icon: React.ElementType; label: string }[] = [
    { key: "Home", icon: LayoutDashboard, label: "Overview" },
    { key: "Employees", icon: Users, label: "Employees" },
    { key: "Jobs", icon: Briefcase, label: "Jobs" },
];

// ─── Empty state ──────────────────────────────────────────────────────────────

function Empty({ icon: Icon, text }: { icon: React.ElementType; text: string }) {
    return (
        <div className="flex flex-col items-center justify-center gap-3 py-14 text-center">
            <div className="w-11 h-11 rounded-2xl bg-slate-100 flex items-center justify-center">
                <Icon className="w-5 h-5 text-slate-400" strokeWidth={1.75} />
            </div>
            <p className="text-sm text-slate-400">{text}</p>
        </div>
    );
}

// ─── Main component ───────────────────────────────────────────────────────────

const CompanySlides = ({ company, profileUser }: CompanySlidesProps) => {
    const [tab, setTab] = useState<TabKey>("Home");

    const jobs = company?.jobs ?? [];
    const employees = profileUser?.employeeUsers ?? [];

    const countMap: Record<TabKey, number | null> = {
        Home: null,
        Employees: employees.length,
        Jobs: jobs.length,
    };

    return (
        <div className="w-full rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">

            {/* Tab bar */}
            <div className="flex items-center border-b border-slate-100 px-1 overflow-x-auto">
                {TABS.map(({ key, icon: Icon, label }) => {
                    const isActive = tab === key;
                    const count = countMap[key];
                    return (
                        <button
                            key={key}
                            onClick={() => setTab(key)}
                            className={`inline-flex items-center gap-1.5 px-5 py-3.5 text-sm font-semibold border-b-2 transition-all duration-200 whitespace-nowrap -mb-px flex-shrink-0 ${isActive
                                    ? "border-indigo-600 text-indigo-600"
                                    : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                                }`}
                        >
                            <Icon className={`w-4 h-4 ${isActive ? "" : "opacity-70"}`} strokeWidth={isActive ? 2.5 : 1.75} />
                            {label}
                            {count !== null && count > 0 && (
                                <span className={`text-[11px] font-bold rounded-full px-1.5 py-0.5 ${isActive ? "bg-indigo-100 text-indigo-700" : "bg-slate-100 text-slate-500"
                                    }`}>
                                    {count}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Content */}
            <div className="p-5">

                {/* Overview */}
                {tab === "Home" && (
                    company?.companyAbout
                        ? <p className="text-sm text-slate-600 leading-relaxed">{company.companyAbout}</p>
                        : <Empty icon={Building2} text="No company description provided yet." />
                )}

                {/* Jobs */}
                {tab === "Jobs" && (
                    jobs.length > 0
                        ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {jobs.map((job) => (
                                    <div key={job.id} className="rounded-2xl border border-slate-200 bg-white p-4 hover:border-indigo-200 hover:shadow-sm hover:-translate-y-0.5 transition-all duration-200">
                                        <JobList job={job} />
                                    </div>
                                ))}
                            </div>
                        )
                        : <Empty icon={Briefcase} text="No jobs posted yet." />
                )}

                {/* Employees */}
                {tab === "Employees" && (
                    employees.length > 0
                        ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                {employees.map((emp) => (
                                    <CompanyAvatar
                                        key={emp.id}
                                        id={emp.id}
                                        name={emp.username}
                                        image={emp.userImage}
                                    />
                                ))}
                            </div>
                        )
                        : <Empty icon={Users} text="No employees yet." />
                )}
            </div>
        </div>
    );
};

export default memo(CompanySlides);