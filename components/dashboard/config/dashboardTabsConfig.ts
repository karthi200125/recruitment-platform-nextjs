// config/dashboard/dashboardTabsConfig.ts

import { Role } from "@prisma/client";

export const DASHBOARD_TABS = {
    CANDIDATE: [
        {
            label: "Overview",
            value: "overview",
        },

        {
            label: "Applied Jobs",
            value: "applied",
        },

        {
            label: "Saved Jobs",
            value: "saved",
        },

        {
            label: "Interviews",
            value: "interviews",
        },

        {
            label: "Profile Views",
            value: "profileViews",
        },
    ],

    RECRUITER: [
        {
            label: "Overview",
            value: "overview",
        },

        {
            label: "Posted Jobs",
            value: "postedJobs",
        },

        {
            label: "Applicants",
            value: "applicants",
        },

        {
            label: "Interviews",
            value: "interviews",
        },

        {
            label: "Hired",
            value: "hired",
        },
    ],

    ORGANIZATION: [
        {
            label: "Overview",
            value: "overview",
        },

        {
            label: "Jobs",
            value: "jobs",
        },

        {
            label: "Applicants",
            value: "applicants",
        },

        {
            label: "Hired",
            value: "hired",
        },
    ],
} satisfies Record<
    Role,
    {
        label: string;
        value: string;
    }[]
>;