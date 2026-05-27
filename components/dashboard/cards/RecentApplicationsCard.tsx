import Image from "next/image";
import Link from "next/link";

import {
    MoreVertical,
} from "lucide-react";

type ApplicationStatus =
    | "INTERVIEW_SCHEDULED"
    | "UNDER_REVIEW"
    | "APPLIED"
    | "REJECTED"
    | "INTERVIEWED";

type RecentApplication = {
    id: number;

    jobTitle: string;

    skills: string;

    company: string;

    companyLogo: string;

    appliedDate: string;

    status: ApplicationStatus;

    applicantImage: string;
};

const applications: RecentApplication[] = [
    {
        id: 1,

        jobTitle:
            "Frontend Developer",

        skills:
            "React, Next.js",

        company: "Google",

        companyLogo:
            "/logos/google.png",

        appliedDate:
            "2 Jun 2024",

        status:
            "INTERVIEW_SCHEDULED",

        applicantImage:
            "/profile.webp",
    },

    {
        id: 2,

        jobTitle:
            "UI/UX Designer",

        skills:
            "Figma, Adobe XD",

        company: "Microsoft",

        companyLogo:
            "/logos/microsoft.png",

        appliedDate:
            "30 May 2024",

        status:
            "UNDER_REVIEW",

        applicantImage:
            "/profile.webp",
    },

    {
        id: 3,

        jobTitle:
            "Full Stack Developer",

        skills:
            "MERN Stack",

        company: "Amazon",

        companyLogo:
            "/logos/amazon.png",

        appliedDate:
            "28 May 2024",

        status:
            "APPLIED",

        applicantImage:
            "/profile.webp",
    },

    {
        id: 4,

        jobTitle:
            "Frontend Developer",

        skills:
            "React, TypeScript",

        company: "Netflix",

        companyLogo:
            "/logos/netflix.png",

        appliedDate:
            "25 May 2024",

        status:
            "REJECTED",

        applicantImage:
            "/profile.webp",
    },

    {
        id: 5,

        jobTitle:
            "Software Engineer",

        skills:
            "Java, Spring Boot",

        company: "Spotify",

        companyLogo:
            "/logos/spotify.png",

        appliedDate:
            "22 May 2024",

        status:
            "INTERVIEWED",

        applicantImage:
            "/profile.webp",
    },
];

const STATUS_STYLES: Record<
    ApplicationStatus,
    string
> = {
    INTERVIEW_SCHEDULED:
        "bg-violet-50 text-violet-700 border border-violet-200",

    UNDER_REVIEW:
        "bg-blue-50 text-blue-700 border border-blue-200",

    APPLIED:
        "bg-orange-50 text-orange-700 border border-orange-200",

    REJECTED:
        "bg-red-50 text-red-700 border border-red-200",

    INTERVIEWED:
        "bg-emerald-50 text-emerald-700 border border-emerald-200",
};

const STATUS_LABELS: Record<
    ApplicationStatus,
    string
> = {
    INTERVIEW_SCHEDULED:
        "Interview Scheduled",

    UNDER_REVIEW:
        "Under Review",

    APPLIED:
        "Applied",

    REJECTED:
        "Rejected",

    INTERVIEWED:
        "Interviewed",
};

type RecentApplicationsCardProps =
    {
        data?: RecentApplication[];
    };

export default function RecentApplicationsCard({
    data = applications,
}: RecentApplicationsCardProps) {
    return (
        <section className="w-full rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">

            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-6 pb-5">

                <h2 className="text-[22px] font-semibold tracking-tight text-slate-900">
                    Recent Applications
                </h2>

                <Link
                    href="/dashboard/applications"
                    className="text-[14px] font-medium text-blue-600 hover:text-blue-700 transition-colors"
                >
                    View all
                </Link>
            </div>

            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">

                <table className="w-full border-collapse">

                    <thead>
                        <tr className="border-b border-slate-200">

                            <th className="px-6 pb-4 text-left text-[13px] font-medium text-slate-500">
                                Job
                            </th>

                            <th className="px-6 pb-4 text-left text-[13px] font-medium text-slate-500">
                                Company
                            </th>

                            <th className="px-6 pb-4 text-left text-[13px] font-medium text-slate-500">
                                Status
                            </th>

                            <th className="px-6 pb-4 text-left text-[13px] font-medium text-slate-500">
                                Applied On
                            </th>

                            <th className="w-[60px]" />
                        </tr>
                    </thead>

                    <tbody>

                        {data.map((item) => (
                            <tr
                                key={item.id}
                                className="border-b border-slate-100 last:border-0 hover:bg-slate-50/70 transition-colors"
                            >

                                {/* Job */}
                                <td className="px-6 py-4">

                                    <div className="flex items-center gap-3">

                                        <div className="relative w-10 h-10 rounded-full overflow-hidden border border-slate-200 flex-shrink-0">

                                            <Image
                                                src={
                                                    item.applicantImage
                                                }
                                                alt={
                                                    item.jobTitle
                                                }
                                                fill
                                                className="object-cover"
                                            />
                                        </div>

                                        <div className="min-w-0">

                                            <h3 className="text-[15px] font-medium text-slate-900 truncate">
                                                {item.jobTitle}
                                            </h3>

                                            <p className="text-[14px] text-slate-500 truncate">
                                                {item.skills}
                                            </p>
                                        </div>
                                    </div>
                                </td>

                                {/* Company */}
                                <td className="px-6 py-4">

                                    <div className="flex items-center gap-3">

                                        <div className="relative w-6 h-6 flex-shrink-0">

                                            <Image
                                                src={
                                                    item.companyLogo
                                                }
                                                alt={
                                                    item.company
                                                }
                                                fill
                                                className="object-contain"
                                            />
                                        </div>

                                        <span className="text-[15px] font-medium text-slate-900">
                                            {item.company}
                                        </span>
                                    </div>
                                </td>

                                {/* Status */}
                                <td className="px-6 py-4">

                                    <span
                                        className={`inline-flex items-center rounded-full px-3 py-1 text-[13px] font-medium whitespace-nowrap ${STATUS_STYLES[item.status]}`}
                                    >
                                        {
                                            STATUS_LABELS[
                                            item.status
                                            ]
                                        }
                                    </span>
                                </td>

                                {/* Date */}
                                <td className="px-6 py-4">

                                    <span className="text-[15px] text-slate-700 whitespace-nowrap">
                                        {item.appliedDate}
                                    </span>
                                </td>

                                {/* Actions */}
                                <td className="px-6 py-4 text-right">

                                    <button
                                        aria-label="More options"
                                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg hover:bg-slate-100 transition-colors"
                                    >
                                        <MoreVertical className="w-4 h-4 text-slate-500" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile */}
            <div className="lg:hidden flex flex-col">

                {data.map((item) => (
                    <div
                        key={item.id}
                        className="border-b border-slate-100 p-5 last:border-0"
                    >

                        <div className="flex items-start justify-between gap-4 mb-4">

                            <div className="flex items-center gap-3 min-w-0">

                                <div className="relative w-11 h-11 rounded-full overflow-hidden border border-slate-200 flex-shrink-0">

                                    <Image
                                        src={
                                            item.applicantImage
                                        }
                                        alt={
                                            item.jobTitle
                                        }
                                        fill
                                        className="object-cover"
                                    />
                                </div>

                                <div className="min-w-0">

                                    <h3 className="text-[15px] font-semibold text-slate-900 truncate">
                                        {item.jobTitle}
                                    </h3>

                                    <p className="text-[14px] text-slate-500 truncate">
                                        {item.skills}
                                    </p>
                                </div>
                            </div>

                            <button
                                aria-label="More options"
                                className="flex-shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-lg hover:bg-slate-100 transition-colors"
                            >
                                <MoreVertical className="w-4 h-4 text-slate-500" />
                            </button>
                        </div>

                        <div className="flex items-center justify-between gap-4">

                            <div className="flex items-center gap-2">

                                <div className="relative w-5 h-5">

                                    <Image
                                        src={
                                            item.companyLogo
                                        }
                                        alt={
                                            item.company
                                        }
                                        fill
                                        className="object-contain"
                                    />
                                </div>

                                <span className="text-[14px] font-medium text-slate-800">
                                    {item.company}
                                </span>
                            </div>

                            <span
                                className={`inline-flex items-center rounded-full px-3 py-1 text-[12px] font-medium whitespace-nowrap ${STATUS_STYLES[item.status]}`}
                            >
                                {
                                    STATUS_LABELS[
                                    item.status
                                    ]
                                }
                            </span>
                        </div>

                        <p className="mt-3 text-[13px] text-slate-500">
                            Applied on{" "}
                            {item.appliedDate}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
}