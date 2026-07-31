/**
 * -----------------------------------------------------------------------------
 * Application Routes
 * -----------------------------------------------------------------------------
 *
 * Single source of truth for all application routes.
 *
 * Used by:
 * - Navigation
 * - Sidebar
 * - Breadcrumbs
 * - Redirects
 * - Middleware
 * - Sitemap
 * - Metadata
 *
 * NOTE:
 * This file contains only application page routes.
 * API endpoints and framework routes are intentionally excluded.
 * -----------------------------------------------------------------------------
 */

export const routes = {
    /**
     * -------------------------------------------------------------------------
     * Public Routes
     * -------------------------------------------------------------------------
     */
    public: {
        home: "/",
        jobs: "/jobs",
        companies: "/companies",

        userProfile: (userId: string) => `/userProfile/${userId}`,
    },

    /**
     * -------------------------------------------------------------------------
     * Authentication
     * -------------------------------------------------------------------------
     */
    auth: {
        signin: "/signin",
        signup: "/signup",

        forgotPassword: "/forgot-password",
        resetPassword: "/reset-password",
    },

    /**
     * -------------------------------------------------------------------------
     * Shared Protected Routes
     * -------------------------------------------------------------------------
     */
    dashboard: {
        root: "/dashboard",

        messages: "/messages",

        settings: "/setting",

        subscriptions: "/subscriptions",

        selectRole: "/selectrole",

        admin: "/admin",
    },

    /**
     * -------------------------------------------------------------------------
     * Candidate
     * -------------------------------------------------------------------------
     */
    candidate: {
        jobStatus: "/dashboard/jobStatus",
    },

    /**
     * -------------------------------------------------------------------------
     * Recruiter
     * -------------------------------------------------------------------------
     */
    recruiter: {
        createJob: "/createJob",

        applicants: (jobId: string) =>
            `/dashboard/${jobId}/applicants`,
    },

    /**
     * -------------------------------------------------------------------------
     * Organization
     * -------------------------------------------------------------------------
     */
    organization: {
        createCompany: "/create-company",
    },

    /**
     * -------------------------------------------------------------------------
     * Network
     * -------------------------------------------------------------------------
     */
    network: {
        profile: (userId: string) => `/network/${userId}`,
    },
} as const;

export type Routes = typeof routes;