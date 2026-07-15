import { DashboardTab } from "@/types/dashboard";

// maps a tab to the exact property name it lives under in DashboardData.tables
// note "jobs" (org tab) intentionally points at the same "postedJobs" key
// recruiter uses — same underlying Job query, different tab label
export const TAB_TABLE_KEY: Partial<Record<DashboardTab, string>> = {
    applied: "appliedJobs",
    saved: "savedJobs",
    interviews: "interviews",
    followers: "followers",
    following: "following",
    postedJobs: "postedJobs",
    applicants: "applicants",
    hired: "hiredCandidates",
    jobs: "postedJobs",
    employees: "employees",
};

// per-tab page query-param name — must stay in sync with page.tsx's searchParams
export const TAB_PAGE_PARAM: Partial<Record<DashboardTab, string>> = {
    applied: "appliedPage",
    saved: "savedPage",
    interviews: "interviewsPage",
    profileViews: "profileViewsPage",
    followers: "followersPage",
    following: "followingPage",
    postedJobs: "postedJobsPage",
    applicants: "applicantsPage",
    hired: "hiredPage",
    jobs: "jobsPage",
    employees: "employeesPage",
};