"use client";

import CompanyCard from "./CompanyCard";
import CompaniesEmpty from "./CompaniesEmpty";

import type { CompanyWithJobsCount } from "@/actions/company/get-companies";

interface CompaniesClientProps {
    companies: CompanyWithJobsCount[];
}

const CompaniesClient = ({
    companies,
}: CompaniesClientProps) => {
    if (!companies.length) {
        return <CompaniesEmpty />;
    }

    return (
        <section className="grid grid-cols-2 gap-6 md:grid-cols-3">
            {companies.map((company) => (
                <CompanyCard
                    key={company.id}
                    company={company}
                />
            ))}
        </section>
    );
};

export default CompaniesClient;