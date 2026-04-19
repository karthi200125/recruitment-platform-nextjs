import { Sparkles, Send, ShieldCheck, TrendingUp, Bell, Users } from "lucide-react";

type Feature = {
    id: number;
    title: string;
    description: string;
    icon: React.ElementType;
    accent: string;
    iconBg: string;
    stat: string;
    statLabel: string;
};

export const featuresdata: Feature[] = [
    {
        id: 1,
        title: "AI-Powered Matching",
        description:
            "Our intelligent system recommends jobs tailored to your skills, experience, and preferences — helping you find the right opportunity faster.",
        icon: Sparkles,
        accent: "from-violet-500/20 to-indigo-500/5",
        iconBg: "bg-violet-500/15 text-violet-400",
        stat: "3x",
        statLabel: "faster placements",
    },
    {
        id: 2,
        title: "One-Click Apply",
        description:
            "Apply to jobs in seconds with a streamlined process. No lengthy forms — just quick, efficient applications that get noticed.",
        icon: Send,
        accent: "from-sky-500/20 to-cyan-500/5",
        iconBg: "bg-sky-500/15 text-sky-400",
        stat: "8s",
        statLabel: "avg. apply time",
    },
    {
        id: 3,
        title: "Verified Companies",
        description:
            "Every listing is reviewed for legitimacy before going live. Apply confidently knowing every opportunity is real and trustworthy.",
        icon: ShieldCheck,
        accent: "from-emerald-500/20 to-teal-500/5",
        iconBg: "bg-emerald-500/15 text-emerald-400",
        stat: "100%",
        statLabel: "verified listings",
    },
    {
        id: 4,
        title: "Real-Time Alerts",
        description:
            "Get notified the moment a job matching your profile goes live. Never miss an opportunity with smart, instant alerts.",
        icon: Bell,
        accent: "from-amber-500/20 to-yellow-500/5",
        iconBg: "bg-amber-500/15 text-amber-400",
        stat: "<1m",
        statLabel: "alert delivery",
    },
    {
        id: 5,
        title: "Salary Insights",
        description:
            "Make informed decisions with real market salary data. Know your worth before you walk into any negotiation.",
        icon: TrendingUp,
        accent: "from-rose-500/20 to-pink-500/5",
        iconBg: "bg-rose-500/15 text-rose-400",
        stat: "50K+",
        statLabel: "salary data points",
    },
    {
        id: 6,
        title: "Direct Recruiter Access",
        description:
            "Message hiring managers directly — no middlemen, no black holes. Build real connections that actually lead to interviews.",
        icon: Users,
        accent: "from-indigo-500/20 to-blue-500/5",
        iconBg: "bg-indigo-500/15 text-indigo-400",
        stat: "12K+",
        statLabel: "active recruiters",
    },
];