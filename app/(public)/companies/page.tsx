import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { MapPin , BriefcaseBusiness } from "lucide-react";

import Batch from "@/components/Batch";
import noImage from "../../../public/noImage.webp";
import { getCompanies } from "@/actions/company/get-companies";

export const metadata: Metadata = {
    title: "Top Companies Hiring | Explore Verified Companies",
    description:
        "Browse verified companies hiring right now. Discover job opportunities, company profiles, and open roles.",
};

interface Company {
    id: number;
    companyName: string;
    companyImage?: string | null;
    companyCity?: string | null;
    companyCountry?: string | null;
    jobsCount: number;
}

export default async function CompaniesPage() {
    const companies: Company[] = await getCompanies();

    return (
        <main className="py-10">

            {/* SEO STRUCTURED DATA */}
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
                            url: `${process.env.NEXT_PUBLIC_APP_URL}/userProfile/${company.id}`,
                        })),
                    }),
                }}
            />

            {/* HEADER */}
            <div className="mb-8 flex flex-col gap-2">
                <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
                    Explore Companies
                </h1>

                <p className="text-sm text-muted-foreground md:text-base">
                    Discover verified companies and explore open opportunities
                </p>
            </div>

            {/* GRID */}
            <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">

                {companies.map((company) => {
                    const imageSrc: string | StaticImageData =
                        company.companyImage || noImage;

                    return (
                        <article
                            key={company.id}
                            className="
                group
                relative
                rounded-2xl
                border
                border-black/10
                bg-white/60
                p-5
                shadow-sm
                backdrop-blur-md
                transition-all
                duration-300
                hover:-translate-y-1
                hover:shadow-xl
              "
                        >
                            {/* TOP */}
                            <div className="flex items-start gap-4">

                                {/* LOGO */}
                                <div className="relative h-14 w-14 overflow-hidden rounded-xl border bg-white md:h-16 md:w-16">

                                    <Image
                                        src={imageSrc}
                                        alt={`${company.companyName} logo`}
                                        fill
                                        sizes="64px"
                                        className="object-cover"
                                    />
                                </div>

                                {/* INFO */}
                                <div className="flex flex-1 flex-col gap-1">

                                    <div className="flex items-center gap-3">

                                        <Link
                                            href={`/userProfile/${company.id}`}
                                            className="
                        line-clamp-1
                        text-base
                        font-semibold
                        leading-tight
                        transition-colors
                        group-hover:text-primary
                        md:text-lg
                      "
                                        >
                                            {company.companyName}
                                        </Link>

                                        <Batch type="ORGANIZATION" />
                                    </div>

                                    <div className="flex items-center gap-1 text-xs text-muted-foreground">

                                        <MapPin size={14} />

                                        <span className="line-clamp-1">
                                            {company.companyCity || "Unknown City"}

                                            {company.companyCountry
                                                ? `, ${company.companyCountry}`
                                                : ""}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* DIVIDER */}
                            <div className="my-4 h-px bg-neutral-200" />

                            {/* FOOTER */}
                            <div className="flex items-center justify-between">

                                <Link
                                    href={`/jobs?company=${encodeURIComponent(
                                        company.companyName
                                    )}`}
                                    className="
                    flex
                    items-center
                    gap-2
                    text-sm
                    font-medium
                    text-primary
                    hover:underline
                  "
                                >
                                    <BriefcaseBusiness />

                                    <span>
                                        {company.jobsCount} Open Jobs
                                    </span>
                                </Link>

                                <Link
                                    href={`/userProfile/${company.id}`}
                                    className="
                    rounded-full
                    border
                    px-3
                    py-1.5
                    text-xs
                    font-medium
                    transition-all
                    hover:bg-black
                    hover:text-white
                  "
                                >
                                    View
                                </Link>
                            </div>

                            {/* HOVER EFFECT */}
                            <div
                                className="
                  pointer-events-none
                  absolute
                  inset-0
                  rounded-2xl
                  ring-1
                  ring-transparent
                  transition
                  group-hover:ring-black/10
                "
                            />
                        </article>
                    );
                })}
            </section>
        </main>
    );
}