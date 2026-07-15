import { DashboardTableConfig } from "@/types/dashboard";

export const DASHBOARD_TABLE_CONFIG: Record<
    string,
    DashboardTableConfig
> = {
    /* -------------------------------------------------------------------------- */
    /* Candidate                                                                  */
    /* -------------------------------------------------------------------------- */

    applied: {
        title: "Applied Jobs",
        description: "Track all jobs you've applied for.",
        searchPlaceholder: "Search applied jobs...",
        emptyTitle: "No applied jobs",
        emptyDescription:
            "You haven't applied for any jobs yet.",
    },

    saved: {
        title: "Saved Jobs",
        description: "Jobs you've saved for later.",
        searchPlaceholder: "Search saved jobs...",
        emptyTitle: "No saved jobs",
        emptyDescription:
            "You haven't saved any jobs yet.",
    },

    interviews: {
        title: "Interviews",
        description: "Manage your interview schedule.",
        searchPlaceholder: "Search interviews...",
        emptyTitle: "No interviews",
        emptyDescription:
            "No interviews have been scheduled yet.",
    },

    profileViews: {
        title: "Profile Views",
        description: "People who viewed your profile.",
        searchPlaceholder: "Search profile views...",
        emptyTitle: "No profile views",
        emptyDescription:
            "Nobody has viewed your profile yet.",
    },

    followers: {
        title: "Followers",
        description: "People following your profile.",
        searchPlaceholder: "Search followers...",
        emptyTitle: "No followers",
        emptyDescription:
            "You don't have any followers yet.",
    },

    following: {
        title: "Following",
        description: "People you follow.",
        searchPlaceholder: "Search following...",
        emptyTitle: "Not following anyone",
        emptyDescription:
            "Start following professionals to stay updated.",
    },

    /* -------------------------------------------------------------------------- */
    /* Recruiter                                                                  */
    /* -------------------------------------------------------------------------- */

    postedJobs: {
        title: "Posted Jobs",
        description: "Manage all your published jobs.",
        searchPlaceholder: "Search jobs...",
        emptyTitle: "No jobs",
        emptyDescription:
            "You haven't posted any jobs yet.",
        actionLabel: "Post Job",
    },

    applicants: {
        title: "Applicants",
        description: "Manage all job applicants.",
        searchPlaceholder: "Search applicants...",
        emptyTitle: "No applicants",
        emptyDescription:
            "No candidates have applied yet.",
    },

    hired: {
        title: "Hired Candidates",
        description: "Candidates you've hired.",
        searchPlaceholder: "Search hired candidates...",
        emptyTitle: "No hired candidates",
        emptyDescription:
            "You haven't hired anyone yet.",
    },

    /* -------------------------------------------------------------------------- */
    /* Organization                                                               */
    /* -------------------------------------------------------------------------- */

    jobs: {
        title: "Jobs",
        description: "Manage organization jobs.",
        searchPlaceholder: "Search jobs...",
        emptyTitle: "No jobs",
        emptyDescription:
            "No jobs have been created.",
        actionLabel: "Create Job",
    },

    employees: {
        title: "Employees",
        description: "Manage company employees.",
        searchPlaceholder: "Search employees...",
        emptyTitle: "No employees",
        emptyDescription:
            "No employees found.",
    },
};