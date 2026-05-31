export type PublicPlan = {
    id: string;
    name: string;
    price: number;
    interval: "month" | "year";
    features: string[];
    popular?: boolean;

    limits?: {
        jobPosts?: number;
        applications?: number;
        aiMatches?: number;
    };
};

export function getPublicPlans(): Record<
    "CANDIDATE" | "RECRUITER" | "ORGANIZATION",
    PublicPlan[]
> {
    return {
        CANDIDATE: [
            {
                id: "candidate_pro_monthly",
                name: "Pro Monthly",
                price: 199,
                interval: "month",

                features: [
                    "Unlimited job applications",
                    "Priority visibility",
                    "Direct messaging",
                ],

                limits: {
                    applications: -1,
                },

                popular: true,
            },

            {
                id: "candidate_pro_yearly",
                name: "Pro Yearly",
                price: 1999,
                interval: "year",

                features: [
                    "Save 20%",
                    "Unlimited applications",
                    "Advanced insights",
                ],

                limits: {
                    applications: -1,
                },
            },
        ],

        RECRUITER: [
            {
                id: "recruiter_starter_monthly",
                name: "Starter Monthly",
                price: 999,
                interval: "month",

                features: [
                    "10 job posts",
                    "Basic candidate access",
                ],

                limits: {
                    jobPosts: 10,
                },
            },

            {
                id: "recruiter_pro_monthly",
                name: "Pro Monthly",
                price: 1999,
                interval: "month",

                features: [
                    "Unlimited job posts",
                    "Advanced analytics",
                    "Direct messaging",
                ],

                limits: {
                    jobPosts: -1,
                },

                popular: true,
            },
        ],

        ORGANIZATION: [
            {
                id: "org_team_monthly",
                name: "Team Monthly",
                price: 4999,
                interval: "month",

                features: [
                    "Unlimited job postings",
                    "Company branding page",
                    "Team hiring access",
                    "Advanced analytics",
                ],

                limits: {
                    jobPosts: -1,
                },

                popular: true,
            },

            {
                id: "org_team_yearly",
                name: "Team Yearly",
                price: 49999,
                interval: "year",

                features: [
                    "Save 20%",
                    "Unlimited hiring",
                    "Priority support",
                    "Full analytics dashboard",
                ],

                limits: {
                    jobPosts: -1,
                },
            },
        ],
    };
}