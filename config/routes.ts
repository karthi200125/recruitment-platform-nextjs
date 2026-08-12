export const routes = {    
    public: {
        home: "/",
        jobs: "/jobs",
        companies: "/companies",

        userProfile: (userId: string) => `/userProfile/${userId}`,
    },
    
    auth: {
        signin: "/signin",
        signup: "/signup",

        forgotPassword: "/forgot-password",
        resetPassword: "/reset-password",
    },
    
    dashboard: {
        root: "/dashboard",

        messages: "/messages",

        settings: "/setting",

        subscriptions: "/subscriptions",

        selectRole: "/selectrole",

        admin: "/admin",
    },
    
    candidate: {
        jobStatus: "/dashboard/jobStatus",
    },
    
    recruiter: {
        createJob: "/createJob",

        applicants: (jobId: string) =>
            `/dashboard/${jobId}/applicants`,
    },
    
    organization: {
        createCompany: "/create-company",
    },
    
    network: {
        profile: (userId: string) => `/network/${userId}`,
    },
} as const;

export type Routes = typeof routes;