import CandidateOverview from "./CandidateOverviewtab";

interface DashboardOverviewSectionProps {
  activeTab: string;
  role?: any;
  dashboardData?: any;
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