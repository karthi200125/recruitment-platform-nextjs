"use client";

import {
    ArrowRight,
    BriefcaseBusiness,
    MapPin,
} from "lucide-react";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";

import type { CompanyWithJobsCount } from "@/actions/company/get-companies";
import Batch from "@/components/Batch";

interface CompanyCardProps {
    company: CompanyWithJobsCount;
}

const CompanyCard = ({
    company,
}: CompanyCardProps) => {
    const imageSrc: string | StaticImageData =
        company.companyImage || '/noImage.webp';

    return (
        <article className="group mx-auto w-full max-w-[340px] rounded-2xl border border-slate-200 bg-white p-3.5 transition-all duration-200 hover:border-slate-300 hover:shadow-md sm:max-w-none sm:p-5">

            {/* Header */}
            <div className="flex items-start gap-3">

                <Link
                    href={`/userProfile/${company.userId}`}
                    className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-50 sm:h-14 sm:w-14"
                >
                    <Image
                        src={imageSrc}
                        alt={`${company.companyName} logo`}
                        fill
                        sizes="56px"
                        className="object-cover"
                    />
                </Link>

                <div className="min-w-0 flex-1">

                    <div className="flex items-center gap-1.5">

                        <Link
                            href={`/userProfile/${company.userId}`}
                            className="truncate text-[15px] font-semibold text-slate-900 transition-colors hover:text-[var(--primary-clr)] sm:text-lg"
                        >
                            {company.companyName}
                        </Link>

                        <div className="scale-90 sm:scale-100">
                            <Batch type="ORGANIZATION" />
                        </div>

                    </div>

                    <div className="mt-1 flex items-center gap-1 text-xs text-slate-500 sm:text-sm">

                        <MapPin className="h-3.5 w-3.5 flex-shrink-0" />

                        <span className="truncate">
                            {company.companyCity || "Unknown City"}
                            {company.companyCountry &&
                                `, ${company.companyCountry}`}
                        </span>

                    </div>

                </div>

            </div>

            {/* Divider */}
            <div className="my-3 h-px bg-slate-100 sm:my-4" />

            {/* Footer */}
            <div className="flex items-center justify-between">

                <Link
                    href={`/jobs?company=${encodeURIComponent(
                        company.companyName
                    )}`}
                    className="inline-flex items-center gap-1.5 rounded-lg text-[13px] font-medium text-[var(--primary-clr)] transition-colors hover:text-[var(--primary-hover-clr)]"
                >
                    <BriefcaseBusiness className="h-3.5 w-3.5 flex-shrink-0" />

                    <span>
                        {company.jobsCount}{" "}
                        {company.jobsCount === 1
                            ? "Open Job"
                            : "Open Jobs"}
                    </span>

                </Link>

                <Link
                    href={`/userProfile/${company.userId}`}
                    className="inline-flex items-center gap-1 rounded-lg text-[13px] font-medium text-slate-700 transition-colors hover:text-[var(--primary-clr)]"
                >
                    <span>View</span>

                    <ArrowRight className="h-3.5 w-3.5" />

                </Link>

            </div>

        </article>
    );
};

export default CompanyCard;