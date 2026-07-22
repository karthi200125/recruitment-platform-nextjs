"use client";

import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { BriefcaseBusiness, MapPin } from "lucide-react";

import Batch from "@/components/Batch";
import noImage from "../../../public/noImage.webp";

import type { CompanyWithJobsCount } from "@/actions/company/get-companies";

interface CompanyCardProps {
    company: CompanyWithJobsCount;
}

const CompanyCard = ({ company }: CompanyCardProps) => {
    const imageSrc: string | StaticImageData =
        company.companyImage || noImage;

    return (
        <article className="group rounded-2xl border border-slate-200 bg-white p-5 transition-all duration-200 hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg">

            <div className="flex items-start gap-4">

                <Link
                    href={`/userProfile/${company.userId}`}
                    className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-50 md:h-16 md:w-16"
                >
                    <Image
                        src={imageSrc}
                        alt={`${company.companyName} logo`}
                        fill
                        sizes="64px"
                        className="object-cover"
                    />
                </Link>

                <div className="min-w-0 flex-1">

                    <div className="flex items-center gap-2">

                        <Link
                            href={`/userProfile/${company.userId}`}
                            className="truncate text-lg font-semibold text-slate-900 transition-colors hover:text-[var(--primary-clr)]"
                        >
                            {company.companyName}
                        </Link>

                        <Batch type="ORGANIZATION" />

                    </div>

                    <div className="mt-2 flex items-center gap-1 text-sm text-slate-500">

                        <MapPin className="h-4 w-4 flex-shrink-0" />

                        <span className="truncate">
                            {company.companyCity || "Unknown City"}
                            {company.companyCountry &&
                                `, ${company.companyCountry}`}
                        </span>

                    </div>

                </div>

            </div>

            <div className="my-5 h-px bg-slate-100" />

            <div className="flex items-center justify-between gap-3">

                <Link
                    href={`/jobs?company=${encodeURIComponent(
                        company.companyName
                    )}`}
                    className="inline-flex items-center gap-2 text-sm font-medium text-[var(--primary-clr)] transition-colors hover:underline"
                >
                    <BriefcaseBusiness className="h-4 w-4" />

                    <span>
                        {company.jobsCount}{" "}
                        {company.jobsCount === 1
                            ? "Open Job"
                            : "Open Jobs"}
                    </span>

                </Link>

                <Link
                    href={`/userProfile/${company.userId}`}
                    className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100"
                >
                    View Company
                </Link>

            </div>

        </article>
    );
};

export default CompanyCard;