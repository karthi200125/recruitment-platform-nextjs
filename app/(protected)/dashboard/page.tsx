import { Role } from "@prisma/client";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth/authOptions";
import { db } from "@/lib/db";

import DashboardClient from "@/components/dashboard/DashboardClient";

import { getCandidateDashboardData } from "@/actions/dashboard/get-candidate-dashboard-data";
import { getOrganizationDashboardData } from "@/actions/dashboard/get-organization-dashboard-data";
import { getRecruiterDashboardData } from "@/actions/dashboard/get-recruiter-dashboard-data";

export const metadata: Metadata = {
    title: "Dashboard | Job Portal",
    description: "Manage your jobs, applications and profile.",
    robots: {
        index: false,
        follow: false,
    },
};

const PAGE_SIZE = 10;

interface DashboardPageProps {
    searchParams?: {
        tab?: string;

        appliedPage?: string;
        savedPage?: string;
        interviewsPage?: string;
        profileViewsPage?: string;

        postedJobsPage?: string;
        applicantsPage?: string;
        hiredPage?: string;
        jobsPage?: string;
    };
}

const getPageNumber = (value?: string) => {
    const page = Number(value);

    return Number.isInteger(page) && page > 0
        ? page
        : 1;
};

const DashboardPage = async ({
    searchParams,
}: DashboardPageProps) => {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        redirect("/signin");
    }

    const userId = Number(session.user.id);

    if (!userId) {
        redirect("/signin");
    }

    const role: Role = session.user.role ?? Role.CANDIDATE;

    const pages = {
        applied: getPageNumber(searchParams?.appliedPage),
        saved: getPageNumber(searchParams?.savedPage),
        interviews: getPageNumber(searchParams?.interviewsPage),
        profileViews: getPageNumber(searchParams?.profileViewsPage),
        postedJobs: getPageNumber(searchParams?.postedJobsPage),
        applicants: getPageNumber(searchParams?.applicantsPage),
        hired: getPageNumber(searchParams?.hiredPage),
        jobs: getPageNumber(searchParams?.jobsPage),
    };

    let dashboardData = null;
    let company: {
        id: number;
        companyIsVerified: boolean;
    } | null = null;

    switch (role) {
        case Role.CANDIDATE:
            dashboardData =
                await getCandidateDashboardData({
                    userId,
                    appliedPage: pages.applied,
                    savedPage: pages.saved,
                    interviewsPage: pages.interviews,
                    profileViewsPage:
                        pages.profileViews,
                    limit: PAGE_SIZE,
                });
            break;

        case Role.RECRUITER:
            dashboardData =
                await getRecruiterDashboardData({
                    userId,
                    postedJobsPage:
                        pages.postedJobs,
                    applicantsPage:
                        pages.applicants,
                    interviewsPage:
                        pages.interviews,
                    hiredPage:
                        pages.hired,
                    limit: PAGE_SIZE,
                });
            break;

        case Role.ORGANIZATION:
            company =
                await db.company.findFirst({
                    where: {
                        userId,
                    },
                    select: {
                        id: true,
                        companyIsVerified: true,
                    },
                });

            if (!company) {
                redirect("/create-company");
            }

            dashboardData =
                await getOrganizationDashboardData({
                    companyId: company.id,
                    jobsPage: pages.jobs,
                    applicantsPage:
                        pages.applicants,
                    hiredPage: pages.hired,
                    limit: PAGE_SIZE,
                });

            break;

        default:
            redirect("/signin");
    }


    return (
        <DashboardClient
            user={{
                id: userId,
                role,
                username: session.user.username,
                userImage:
                    session.user.profileImage,
            }}
            company={company}
            role={role}
            dashboardData={dashboardData}
        />
    );
};

export default DashboardPage;