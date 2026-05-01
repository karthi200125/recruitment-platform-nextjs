"use client";

import { useState } from "react";

import AboutCompanyProfile from "./AboutCompanyProfile";
import CompanyEmployees from "./CompanyEmployees";
import CompanyJobProfile from "./CompanyJobProfile";

interface Company {
    companyAbout?: string | null;
    jobs?: any[];
}

interface ProfileUser {
    id: number;
    employees?: number[];
}

interface CompanySlidesProps {
    company?: Company | null;
    profileUser?: ProfileUser | null;
}

const CompanySlides = ({
    company,
    profileUser,
}: CompanySlidesProps) => {
    const [tab, setTab] = useState<"Home" | "Employees" | "Jobs">("Home");

    return (
        <div className="w-full space-y-5">

            {/* TABS */}
            <div className="flex items-center rounded-md pl-5">
                {["Home", "Employees", "Jobs"].map((t) => (
                    <button
                        key={t}
                        onClick={() => setTab(t as any)}
                        className={`px-5 py-2 ${tab === t
                                ? "border-b-2 border-black"
                                : ""
                            } hover:opacity-50`}
                    >
                        {t}
                    </button>
                ))}
            </div>

            {/* CONTENT */}
            <div className="w-full">
                {tab === "Home" && (
                    <AboutCompanyProfile company={company} />
                )}

                {tab === "Employees" && (
                    <CompanyEmployees
                        employeeIds={profileUser?.employees}
                    />
                )}

                {tab === "Jobs" && (
                    <CompanyJobProfile company={company} />
                )}
            </div>
        </div>
    );
};

export default CompanySlides;