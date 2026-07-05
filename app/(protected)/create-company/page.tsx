import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Building2 } from "lucide-react";

import CompanyForm from "@/components/forms/CompanyForm";
import { authOptions } from "@/lib/auth/authOptions";
import { db } from "@/lib/db";

export const metadata: Metadata = {
    title: "Create Your Company — Jobify",
    description:
        "Set up your organization's company profile on Jobify to start posting jobs and attracting top candidates.",
    robots: { index: false, follow: false },
};

export default async function CreateCompanyPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        redirect("/signin");
    }

    if (session.user.role !== "ORGANIZATION") {
        redirect("/");
    }

    const existingCompany = await db.company.findFirst({
        where: { userId: session.user.id },
        select: { id: true },
    });

    if (existingCompany) {
        redirect("/organization");
    }

    return (
        <main className="min-h-screen ">
            <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6">

                {/* Page header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-900">
                            <Building2 className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
                                Create your company profile
                            </h1>
                            <p className="mt-0.5 text-sm text-neutral-500">
                                Takes about 3 minutes · You can edit everything later
                            </p>
                        </div>
                    </div>

                    {/* Progress hints */}
                    <div className="mt-6 flex flex-wrap gap-3">
                        {[
                            "Company identity",
                            "Location",
                            "About & culture",
                            "Logo",
                        ].map((step, i) => (
                            <div
                                key={step}
                                className="flex items-center gap-1.5 text-xs text-neutral-400"
                            >
                                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-neutral-200 font-semibold text-neutral-600">
                                    {i + 1}
                                </span>
                                {step}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Form card */}
                <CompanyForm />

            </div>
        </main>
    );
}