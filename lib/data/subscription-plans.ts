
export type Plan = {
    name: string;
    priceId: string;
    price: number;
    interval: "month" | "year";
    features: string[];
    popular?: boolean;
};

export const PLANS: Record<
    "CANDIDATE" | "RECRUITER" | "ORGANIZATION",
    Plan[]
> = {
    CANDIDATE: [
        {
            name: "Pro Monthly",
            priceId: process.env.STRIPE_PRICE_CANDIDATE_PRO_MONTHLY!,
            price: 199,
            interval: "month",
            features: [
                "Unlimited job applications",
                "Priority visibility",
                "Direct messaging",
            ],
            popular: true,
        },
        {
            name: "Pro Yearly",
            priceId: process.env.STRIPE_PRICE_CANDIDATE_PRO_YEARLY!,
            price: 1999,
            interval: "year",
            features: [
                "Save 20%",
                "Unlimited applications",
                "Advanced insights",
            ],
        },
    ],

    RECRUITER: [
        {
            name: "Starter Monthly",
            priceId: process.env.STRIPE_PRICE_RECRUITER_STARTER_MONTHLY!,
            price: 999,
            interval: "month",
            features: [
                "10 job posts",
                "Basic candidate access",
            ],
        },
        {
            name: "Pro Monthly",
            priceId: process.env.STRIPE_PRICE_RECRUITER_PRO_MONTHLY!,
            price: 1999,
            interval: "month",
            features: [
                "Unlimited job posts",
                "Advanced analytics",
                "Direct messaging",
            ],
            popular: true,
        },
    ],

    ORGANIZATION: [
        {
            name: "Business Monthly",
            priceId: process.env.STRIPE_PRICE_ORG_BUSINESS_MONTHLY!,
            price: 4999,
            interval: "month",
            features: [
                "Unlimited job postings",
                "Company branding page",
                "Team hiring access",
                "Advanced analytics",
            ],
            popular: true,
        },
        {
            name: "Business Yearly",
            priceId: process.env.STRIPE_PRICE_ORG_BUSINESS_YEARLY!,
            price: 49999,
            interval: "year",
            features: [
                "Save 20%",
                "Unlimited hiring",
                "Priority support",
                "Full analytics dashboard",
            ],
        },
    ],
};