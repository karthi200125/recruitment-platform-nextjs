export type Plan = {
    id: string;
    name: string;
    priceId: string;
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

// ✅ safe env reader
function getEnv(name: string): string {
    const value = process.env[name];

    if (!value) {
        throw new Error(`Missing env variable: ${name}`);
    }

    return value;
}

export function getPlans(): Record<
    "CANDIDATE" | "RECRUITER" | "ORGANIZATION",
    Plan[]
> {
    return {
        CANDIDATE: [
            {
                id: "candidate_pro_monthly",
                name: "Pro Monthly",
                priceId: getEnv("STRIPE_PRICE_CANDIDATE_PRO_MONTHLY"),
                price: 199,
                interval: "month",
                features: [
                    "Unlimited job applications",
                    "Priority visibility",
                    "Direct messaging",
                ],
                limits: { applications: -1 },
                popular: true,
            },
            {
                id: "candidate_pro_yearly",
                name: "Pro Yearly",
                priceId: getEnv("STRIPE_PRICE_CANDIDATE_PRO_YEARLY"),
                price: 1999,
                interval: "year",
                features: [
                    "Save 20%",
                    "Unlimited applications",
                    "Advanced insights",
                ],
                limits: { applications: -1 },
            },
        ],

        RECRUITER: [
            {
                id: "recruiter_starter_monthly",
                name: "Starter Monthly",
                priceId: getEnv("STRIPE_PRICE_RECRUITER_STARTER_MONTHLY"),
                price: 999,
                interval: "month",
                features: [
                    "10 job posts",
                    "Basic candidate access",
                ],
                limits: { jobPosts: 10 },
            },
            {
                id: "recruiter_pro_monthly",
                name: "Pro Monthly",
                priceId: getEnv("STRIPE_PRICE_RECRUITER_PRO_MONTHLY"),
                price: 1999,
                interval: "month",
                features: [
                    "Unlimited job posts",
                    "Advanced analytics",
                    "Direct messaging",
                ],
                limits: { jobPosts: -1 },
                popular: true,
            },
        ],

        ORGANIZATION: [
            {
                id: "org_team_monthly",
                name: "Team Monthly",
                priceId: getEnv("STRIPE_PRICE_ORG_TEAM_MONTHLY"),
                price: 4999,
                interval: "month",
                features: [
                    "Unlimited job postings",
                    "Company branding page",
                    "Team hiring access",
                    "Advanced analytics",
                ],
                limits: { jobPosts: -1 },
                popular: true,
            },
            {
                id: "org_team_yearly",
                name: "Team Yearly",
                priceId: getEnv("STRIPE_PRICE_ORG_TEAM_YEARLY"),
                price: 49999,
                interval: "year",
                features: [
                    "Save 20%",
                    "Unlimited hiring",
                    "Priority support",
                    "Full analytics dashboard",
                ],
                limits: { jobPosts: -1 },
            },
        ],
    };
}