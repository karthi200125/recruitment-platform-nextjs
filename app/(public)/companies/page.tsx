import { Metadata } from "next";

import { getCompanies } from "@/actions/company/get-companies";

import CompaniesClient from "./CompaniesClient";

export const metadata: Metadata = {
    title: "Companies | Find Verified Companies Hiring Now",
    description:
        "Explore verified companies, discover open job opportunities, and learn more about employers hiring across multiple industries.",
    alternates: {
        canonical: "/companies",
    },
    openGraph: {
        title: "Companies | Find Verified Companies Hiring Now",
        description:
            "Browse verified companies, explore employer profiles, and discover available job opportunities.",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Companies | Find Verified Companies Hiring Now",
        description:
            "Browse verified companies and discover open positions.",
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