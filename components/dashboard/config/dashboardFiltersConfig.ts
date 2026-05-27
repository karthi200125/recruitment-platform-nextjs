// config/dashboard/dashboardFiltersConfig.ts

import {
    ArrowUpDown,
    BriefcaseBusiness,
    CalendarDays,
    Users,
} from "lucide-react";

export const DASHBOARD_FILTERS =
{
    applied: {
        placeholder:
            "Search applied jobs...",

        filters: [
            {
                key: "status",

                label:
                    "Application Status",

                icon: BriefcaseBusiness,

                options: [
                    {
                        label:
                            "Applied",

                        value:
                            "APPLIED",
                    },

                    {
                        label:
                            "Interview",

                        value:
                            "INTERVIEW",
                    },

                    {
                        label:
                            "Rejected",

                        value:
                            "REJECTED",
                    },
                ],
            },
        ],
    },

    saved: {
        placeholder:
            "Search saved jobs...",

        filters: [
            {
                key: "sort",

                label: "Sort",

                icon: ArrowUpDown,

                options: [
                    {
                        label:
                            "Newest",

                        value:
                            "newest",
                    },

                    {
                        label:
                            "Oldest",

                        value:
                            "oldest",
                    },
                ],
            },
        ],
    },

    profileViews: {
        placeholder:
            "Search recruiters or companies...",

        filters: [
            {
                key: "date",

                label: "Date",

                icon: CalendarDays,

                options: [
                    {
                        label:
                            "Today",

                        value:
                            "today",
                    },

                    {
                        label:
                            "Last 7 Days",

                        value:
                            "7days",
                    },
                ],
            },
        ],
    },

    applicants: {
        placeholder:
            "Search applicants...",

        filters: [
            {
                key: "status",

                label:
                    "Candidate Status",

                icon: Users,

                options: [
                    {
                        label:
                            "Shortlisted",

                        value:
                            "SHORTLISTED",
                    },

                    {
                        label:
                            "Interview",

                        value:
                            "INTERVIEW",
                    },
                ],
            },
        ],
    },
};