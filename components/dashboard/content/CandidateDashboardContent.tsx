"use client";

import AppliedJobsTab from "@/components/dashboard/tabs/AppliedJobsTab";
import SavedJobsTab from "@/components/dashboard/tabs/SavedJobsTab";
import InterviewsTab from "@/components/dashboard/tabs/InterviewsTab";
import ProfileViewsTab from "@/components/dashboard/tabs/ProfileViewsTab";
import CandidateOverview from "../overview/CandidateOverviewtab";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

interface CandidateDashboardContentProps {
    activeTab: string;
    role: "CANDIDATE";
    dashboardData: any;
}

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────

const CandidateDashboardContent = ({
    activeTab,
    role,
    dashboardData,
}: CandidateDashboardContentProps) => {
    return (
        <section className="space-y-5">
            {/* Overview */}
            {activeTab ===
                "overview" && (
                    <CandidateOverview
                        role={role}
                        dashboardData={
                            dashboardData
                        }
                    />
                )}

            {/* Applied Jobs */}
            {activeTab ===
                "applied" && (
                    <AppliedJobsTab
                        dashboardData={
                            dashboardData
                        }
                    />
                )}

            {/* Saved Jobs */}
            {activeTab ===
                "saved" && (
                    <SavedJobsTab
                        dashboardData={
                            dashboardData
                        }
                    />
                )}

            {/* Interviews */}
            {activeTab ===
                "interviews" && (
                    <InterviewsTab
                        dashboardData={
                            dashboardData
                        }
                    />
                )}

            {/* Profile Views */}
            {activeTab ===
                "profileViews" && (
                    <ProfileViewsTab
                        dashboardData={
                            dashboardData
                        }
                    />
                )}
        </section>
    );
};

export default CandidateDashboardContent;