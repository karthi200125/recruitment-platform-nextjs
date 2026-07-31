import { Metadata } from "next";

import { getCompanies } from "@/actions/company/get-companies";

import CompaniesClient from "./CompaniesClient";

export const metadata: Metadata = {
    title: "Companies",

    description:
        "Explore verified companies, discover employer profiles, and find exciting job opportunities from organizations hiring across multiple industries.",

    keywords: [
        "Companies",
        "Employers",
        "Hiring Companies",
        "Verified Companies",
        "Company Profiles",
        "Recruiters",
        "Jobify Companies",
        "Jobs",
    ],

    alternates: {
        canonical: "/companies",
    },

    openGraph: {
        title: "Companies | Jobify",

        description:
            "Browse verified companies, explore employer profiles, and discover open job opportunities.",

        url: "/companies",
    },

    twitter: {
        title: "Companies | Jobify",

        description:
            "Browse verified companies and discover exciting career opportunities.",
    },
};

export default async function CompaniesPage() {
    const companies = await getCompanies();

    return (
        <main className="py-10">

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "ItemList",
                        itemListElement: companies.map((company, index) => ({
                            "@type": "Organization",
                            position: index + 1,
                            name: company.companyName,
                            url: `${process.env.NEXT_PUBLIC_APP_URL}/userProfile/${company.userId}`,
                        })),
                    }),
                }}
            />

            <section className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                    Explore Companies
                </h1>

                <p className="mt-2 max-w-2xl text-sm text-slate-500 md:text-base">
                    Discover verified companies, explore their profiles, and find
                    exciting career opportunities from employers actively hiring.
                </p>
            </section>

            <CompaniesClient companies={companies} />

        </main>
    );
}