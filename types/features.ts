// /lib/features.ts
export type Role = "CANDIDATE" | "RECRUITER" | "ORGANIZATION";
export type Tier = "FREE" | "PRO";
type Limit = number | "UNLIMITED";

export type RecruiterFeatures = {
    MAX_ACTIVE_JOBS: number;
    JOBS_PER_MONTH: number;
};

export type OrganizationFeatures = {
    MAX_ACTIVE_JOBS: number;
};

export const FEATURES = {
    RECRUITER: {
        FREE: { MAX_ACTIVE_JOBS: 2, JOBS_PER_MONTH: 5 },
        PRO: { MAX_ACTIVE_JOBS: 20, JOBS_PER_MONTH: 50 },
    },
    ORGANIZATION: {
        FREE: { MAX_ACTIVE_JOBS: 3 },
        PRO: { MAX_ACTIVE_JOBS: 50 },
    },
} as const;