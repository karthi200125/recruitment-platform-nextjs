import { routes } from "./routes";


export const navigation = {
    main: [
        {
            title: "Home",
            href: routes.public.home,
        },
        {
            title: "Jobs",
            href: routes.public.jobs,
        },
        {
            title: "Companies",
            href: routes.public.companies,
        },
    ],

    auth: [
        {
            title: "Sign In",
            href: routes.auth.signin,
        },
        {
            title: "Sign Up",
            href: routes.auth.signup,
        },
    ],

    candidate: [
        {
            title: "Dashboard",
            href: routes.dashboard.root,
        },
        {
            title: "Application Status",
            href: routes.candidate.jobStatus,
        },
        {
            title: "Messages",
            href: routes.dashboard.messages,
        },
        {
            title: "Subscriptions",
            href: routes.dashboard.subscriptions,
        },
        {
            title: "Settings",
            href: routes.dashboard.settings,
        },
    ],

    recruiter: [
        {
            title: "Dashboard",
            href: routes.dashboard.root,
        },
        {
            title: "Create Job",
            href: routes.recruiter.createJob,
        },
        {
            title: "Messages",
            href: routes.dashboard.messages,
        },
        {
            title: "Subscriptions",
            href: routes.dashboard.subscriptions,
        },
        {
            title: "Settings",
            href: routes.dashboard.settings,
        },
    ],

    organization: [
        {
            title: "Dashboard",
            href: routes.dashboard.root,
        },
        {
            title: "Create Company",
            href: routes.organization.createCompany,
        },
        {
            title: "Messages",
            href: routes.dashboard.messages,
        },
        {
            title: "Subscriptions",
            href: routes.dashboard.subscriptions,
        },
        {
            title: "Settings",
            href: routes.dashboard.settings,
        },
    ],

    footer: {
        product: [
            {
                title: "Jobs",
                href: routes.public.jobs,
            },
            {
                title: "Companies",
                href: routes.public.companies,
            },
        ],

        account: [
            {
                title: "Sign In",
                href: routes.auth.signin,
            },
            {
                title: "Sign Up",
                href: routes.auth.signup,
            },
        ],
    },
} as const;

export type Navigation = typeof navigation;