import Image from "next/image";
import Link from "next/link";
import { FaSuitcase } from "react-icons/fa";
import { MapPin } from "lucide-react";

import Batch from "@/components/Batch";
import noImage from "../../../public/noImage.webp";
import { getCompanies } from "@/actions/company/getCompanies";


export const metadata = {
    title: "Top Companies Hiring | Explore Verified Companies",
    description:
        "Browse verified companies hiring right now. Discover job opportunities, company profiles, and open roles.",
};

{/* <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{
        __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            itemListElement: companies.map((company, index) => ({
                "@type": "Organization",
                position: index + 1,
                name: company.companyName,
                url: `/userProfile/${company.id}`,
            })),
        }),
    }}
/> */}

export default async function CompaniesPage() {
    const companies = await getCompanies();

    return (
        <main className="px-4 py-10">
            {/* HEADER */}
            <div className="flex flex-col gap-2 mb-8">
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                    Explore Companies
                </h1>
                <p className="text-muted-foreground text-sm md:text-base">
                    Discover verified companies and explore open opportunities
                </p>
            </div>

            {/* GRID */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {companies.map((company) => (
                    <article
                        key={company.id}
                        className="group relative rounded-2xl border bg-white/60 backdrop-blur-md p-5 shadow-sm hover:shadow-xl transition-all duration-300"
                    >
                        {/* TOP */}
                        <div className="flex items-start gap-4">
                            {/* LOGO */}
                            <div className="relative w-14 h-14 md:w-16 md:h-16 rounded-xl overflow-hidden border bg-white">
                                <Image
                                    src={company.companyImage || noImage}
                                    alt={`${company.companyName} logo`}
                                    fill
                                    sizes="64px"
                                    className="object-cover"
                                    priority={false}
                                />
                            </div>

                            {/* INFO */}
                            <div className="flex flex-col gap-1 flex-1">
                                <div className="flex flex-row items-center gap-5">
                                <Link
                                    href={`/userProfile/${company.id}`}
                                    className="font-semibold text-base md:text-lg leading-tight group-hover:text-primary transition"
                                >
                                    {company.companyName}
                                </Link>

                                <div className="flex items-center gap-2">
                                    <Batch type="ORGANIZATION" />
                                </div>
                                </div>

                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <MapPin size={14} />
                                    <span className="line-clamp-1">
                                        {company.companyCity},{" "}
                                        {company.companyState}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* DIVIDER */}
                        <div className="my-4 h-[1px] bg-neutral-200" />

                        {/* FOOTER */}
                        <div className="flex items-center justify-between">
                            <Link
                                href={`/jobs?company=${company.companyName}`}
                                className="flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                            >
                                <FaSuitcase />
                                {company.jobs.length} Open Jobs
                            </Link>

                            <Link
                                href={`/userProfile/${company.id}`}
                                className="text-xs font-medium px-3 py-1.5 rounded-full border hover:bg-black hover:text-white transition"
                            >
                                View
                            </Link>
                        </div>

                        {/* HOVER EFFECT */}
                        <div className="absolute inset-0 rounded-2xl ring-1 ring-transparent group-hover:ring-black/10 transition pointer-events-none" />
                    </article>
                ))}
            </section>
        </main>
    );
}