

import InterviewsTab from "@/components/dashboard/tabs/InterviewsTab";
import RecruiterOverviewTab from "../overview/RecruiterOverviewTab";
import HiredCandidatesTab from "../tabs/HiredCandidatesTab";
import ApplicantsTab from "../tabs/ApplicantsTab";
import PostedJobsTab from "../tabs/PostedJobsTab";
import { DashboardData } from "@/types/dashboard";

interface RecruiterDashboardContentProps {
    activeTab: string;
    role: "RECRUITER";
    dashboardData: DashboardData;
}

const RecruiterDashboardContent = ({
    activeTab,
    role,
    dashboardData,
}: RecruiterDashboardContentProps) => {
    return (
        <section className="space-y-5">
            {/* Overview */}
            {activeTab ===
                "overview" && (
                    <RecruiterOverviewTab
                        role={role}
                        dashboardData={
                            dashboardData
                        }
                    />
                )}

            {/* Posted Jobs */}
            {activeTab ===
                "postedJobs" && (
                    <PostedJobsTab
                        dashboardData={
                            dashboardData
                        }
                    />
                )}

            {/* Applicants */}
            {activeTab ===
                "applicants" && (
                    <ApplicantsTab
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

            {/* Hired */}
            {activeTab ===
                "hired" && (
                    <HiredCandidatesTab
                        dashboardData={
                            dashboardData
                        }
                    />
                )}
        </section>
    );
};

export default RecruiterDashboardContent;