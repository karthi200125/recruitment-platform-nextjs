import { DashboardData } from "@/types/dashboard";
import CandidateOverview from "./CandidateOverviewtab";
import { Role } from "@prisma/client";

interface DashboardOverviewSectionProps {
  activeTab: string;
  role?: Role;
  dashboardData?: DashboardData;
}

const DashboardOverviewSection =
  ({
    activeTab,
    role,
    dashboardData
  }: DashboardOverviewSectionProps) => {

    const isCandidate = role === "CANDIDATE";
    const isRecruiter = role === "RECRUITER";
    const isOrganization = role === "ORGANIZATION";

    return (
      <section className="space-y-4">
        <div className="min-h-[500px]">
          {/* Candidate Overview */}
          {activeTab ===
            "overview" &&
            isCandidate && (
              <CandidateOverview
                role={role}
                dashboardData={
                  dashboardData
                }
              />
            )}

          {/* Recruiter Overview */}
          {activeTab ===
            "overview" &&
            isRecruiter && (
              <div>
                Recruiter Overview
              </div>
            )}

          {/* Organization Overview */}
          {activeTab ===
            "overview" &&
            isOrganization && (
              <div>
                Organization
                Overview
              </div>
            )}
        </div>
      </section>
    );
  };

export default DashboardOverviewSection;