import { Metadata } from "next";

import { redirect } from "next/navigation";

import { getServerSession } from "next-auth";

import { Role } from "@prisma/client";

import { authOptions } from "@/lib/authOptions";

import { db } from "@/lib/db";

import DashboardClient from "@/components/dashboard/DashboardClient";
import { getRecruiterDashboardData } from "@/actions/dashboard/getRecruiterDashboardData";
import { getOrganizationDashboardData } from "@/actions/dashboard/getOrganizationDashboardData";
import { getCandidateDashboardData } from "@/actions/dashboard/getCandidateDashboardData";


// ─────────────────────────────────────────────
// Metadata
// ─────────────────────────────────────────────

export const metadata: Metadata = {
    title: "Dashboard | Job Portal",

    description:
        "Manage your jobs, applications, and profile",

    robots: {
        index: false,
        follow: false,
    },
};

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

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

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

const getPageNumber = (
    value?: string
) => {
    const page = Number(value);

    return Number.isNaN(page) ||
        page <= 0
        ? 1
        : page;
};

// ─────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────

const DashboardPage = async ({
    searchParams,
}: DashboardPageProps) => {
    // Session
    const session =
        await getServerSession(
            authOptions
        );

    if (!session?.user?.id) {
        redirect("/signin");
    }

    // User
    const user = session.user;

    const userId = Number(user.id);

    if (!userId) {
        redirect("/signin");
    }

    // Role
    const role = (user.role ??
        "CANDIDATE") as Role;

    // ─────────────────────────────────────────
    // Pagination
    // ─────────────────────────────────────────

    const appliedPage =
        getPageNumber(
            searchParams?.appliedPage
        );

    const savedPage =
        getPageNumber(
            searchParams?.savedPage
        );

    const interviewsPage =
        getPageNumber(
            searchParams?.interviewsPage
        );

    const profileViewsPage =
        getPageNumber(
            searchParams?.profileViewsPage
        );

    const postedJobsPage =
        getPageNumber(
            searchParams?.postedJobsPage
        );

    const applicantsPage =
        getPageNumber(
            searchParams?.applicantsPage
        );

    const hiredPage =
        getPageNumber(
            searchParams?.hiredPage
        );

    const jobsPage =
        getPageNumber(
            searchParams?.jobsPage
        );

    // ─────────────────────────────────────────
    // Dashboard Data
    // ─────────────────────────────────────────

    let dashboardData = null;

    // Candidate
    if (role === "CANDIDATE") {
        dashboardData =
            await getCandidateDashboardData(
                {
                    userId,

                    appliedPage,

                    savedPage,

                    interviewsPage,

                    profileViewsPage,

                    limit: 10,
                }
            );
    }

    // Recruiter
    if (role === "RECRUITER") {
        dashboardData =
            await getRecruiterDashboardData(
                {
                    userId,

                    postedJobsPage,

                    applicantsPage,

                    interviewsPage,

                    hiredPage,

                    limit: 10,
                }
            );
    }

    // Organization
    if (role === "ORGANIZATION") {
        const company =
            await db.company.findFirst({
                where: {
                    userId,
                },

                select: {
                    id: true,
                },
            });

        if (!company) {
            redirect(
                "/dashboard/create-company"
            );
        }

        dashboardData =
            await getOrganizationDashboardData(
                {
                    companyId:
                        company.id,

                    jobsPage,

                    applicantsPage,

                    hiredPage,

                    limit: 10,
                }
            );
    }

    // ─────────────────────────────────────────
    // Render
    // ─────────────────────────────────────────

    return (
        <DashboardClient
            user={{
                id: userId,

                role,

                username:
                    user.username,

                userImage:
                    user.profileImage,
            }}
            role={role}
            dashboardData={
                dashboardData
            }
        />
    );
};

export default DashboardPage;