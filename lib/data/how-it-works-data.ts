import { Briefcase, Search, Send, UserCheck, Building2, BarChart3 } from "lucide-react";

type Step = {
    id: number;
    title: string;
    description: string;
    icon: React.ElementType;
    detail: string;
};

export const jobSeekerStepsdata: Step[] = [
    {
        id: 1,
        title: "Search Jobs",
        description: "Browse thousands of verified listings filtered by role, location, salary, and skill.",
        icon: Search,
        detail: "10K+ live jobs",
    },
    {
        id: 2,
        title: "Apply in Seconds",
        description: "Submit applications instantly — no lengthy forms, just a streamlined one-click process.",
        icon: Send,
        detail: "Avg. 8s to apply",
    },
    {
        id: 3,
        title: "Get Hired",
        description: "Track every application, get recruiter messages, and land your next role faster.",
        icon: UserCheck,
        detail: "3x faster placement",
    },
];

export const recruiterStepsdata: Step[] = [
    {
        id: 1,
        title: "Post a Job",
        description: "Create a detailed listing in minutes and instantly reach thousands of qualified candidates.",
        icon: Building2,
        detail: "Goes live instantly",
    },
    {
        id: 2,
        title: "Review Candidates",
        description: "Filter, shortlist, and evaluate applicants using smart AI-assisted tools and insights.",
        icon: Briefcase,
        detail: "AI-assisted ranking",
    },
    {
        id: 3,
        title: "Hire Faster",
        description: "Message candidates directly, schedule interviews, and close positions in record time.",
        icon: BarChart3,
        detail: "40% less time-to-hire",
    },
];


