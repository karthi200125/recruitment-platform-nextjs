import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { Building2, CalendarDays, Mail, MapPin } from "lucide-react";
import { format } from "date-fns";

import { authOptions } from "@/lib/auth/authOptions";
import { getPendingCompanies } from "@/actions/admin/get-pending-companies";
import { ADMIN_EMAIL } from "@/lib/admin";
import ApproveCompanyButton from "./ApproveCompanyButton";


export const metadata = {
    title: "Admin",
};

const AdminPage = async () => {
    const session = await getServerSession(authOptions);

    if (
        !session?.user?.email ||
        session.user.email !== ADMIN_EMAIL
    ) {
        redirect("/dashboard");
    }

    const companies =
        await getPendingCompanies();

    return (
        <main className="mx-auto max-w-5xl space-y-8 p-6">

            <div>

                <h1 className="text-3xl font-bold text-slate-900">
                    Pending Company Verifications
                </h1>

                <p className="mt-2 text-sm text-slate-500">
                    Approve newly created companies before
                    they become publicly visible.
                </p>

            </div>

            {companies.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 py-16 text-center">

                    <Building2 className="mx-auto h-10 w-10 text-slate-400" />

                    <h2 className="mt-4 text-lg font-semibold text-slate-900">
                        No pending companies
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        Everything has already been verified.
                    </p>

                </div>
            ) : (
                <div className="space-y-5">

                    {companies.map((company: any) => (
                        <div
                            key={company.id}
                            className="rounded-2xl border border-slate-200 bg-white p-6"
                        >

                            <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">

                                <div className="space-y-4">

                                    <div>

                                        <h2 className="text-xl font-semibold text-slate-900">
                                            {company.companyName}
                                        </h2>

                                        <p className="mt-1 text-sm text-slate-500">
                                            Company waiting for verification.
                                        </p>

                                    </div>

                                    <div className="grid gap-3 text-sm text-slate-600">

                                        <div className="flex items-center gap-2">

                                            <Mail className="h-4 w-4 text-slate-400" />

                                            <span>
                                                {company.user.email}
                                            </span>

                                        </div>

                                        <div className="flex items-center gap-2">

                                            <MapPin className="h-4 w-4 text-slate-400" />

                                            <span>
                                                {[company.companyCity, company.companyState, company.companyCountry]
                                                    .filter(Boolean)
                                                    .join(", ") || "Location not provided"}
                                            </span>

                                        </div>

                                        <div className="flex items-center gap-2">

                                            <CalendarDays className="h-4 w-4 text-slate-400" />

                                            <span>
                                                {format(
                                                    new Date(
                                                        company.createdAt
                                                    ),
                                                    "dd MMM yyyy"
                                                )}
                                            </span>

                                        </div>

                                    </div>

                                </div>

                                <ApproveCompanyButton
                                    companyId={company.id}
                                />

                            </div>

                        </div>
                    ))}

                </div>
            )}

        </main>
    );
};

export default AdminPage;