import { BarChart3, Briefcase, MessageSquare, ShieldCheck, Users, Zap } from "lucide-react";

type Benefit = {
    id: number;
    title: string;
    description: string;
    icon: React.ElementType;
    stat: string;
    statLabel: string;
    iconBg: string;
};

export const benefits: Benefit[] = [
    {
        id: 1,
        title: "Reach Quality Candidates",
        description: "Access a large pool of verified professionals actively seeking new opportunities — filtered by skill, location, and availability.",
        icon: Users,
        stat: "50K+",
        statLabel: "active candidates",
        iconBg: "bg-indigo-500/15 text-indigo-400",
    },
    {
        id: 2,
        title: "Post Jobs in Minutes",
        description: "Create and publish job listings instantly with an intuitive editor. Go live in under 5 minutes with zero back-and-forth.",
        icon: Briefcase,
        stat: "< 5 min",
        statLabel: "time to go live",
        iconBg: "bg-violet-500/15 text-violet-400",
    },
    {
        id: 3,
        title: "Hire 3x Faster",
        description: "Smart AI-powered filters surface the best-fit candidates so you spend time interviewing, not sorting through applications.",
        icon: Zap,
        stat: "3x",
        statLabel: "faster time-to-hire",
        iconBg: "bg-sky-500/15 text-sky-400",
    },
    {
        id: 4,
        title: "Advanced Analytics",
        description: "Track views, applications, and conversion rates per listing. Make data-driven decisions about your job descriptions.",
        icon: BarChart3,
        stat: "Real-time",
        statLabel: "hiring insights",
        iconBg: "bg-emerald-500/15 text-emerald-400",
    },
    {
        id: 5,
        title: "Direct Messaging",
        description: "Message shortlisted candidates instantly — no email chains or scheduling tools needed. Everything in one inbox.",
        icon: MessageSquare,
        stat: "Zero",
        statLabel: "middlemen",
        iconBg: "bg-amber-500/15 text-amber-400",
    },
    {
        id: 6,
        title: "Verified Listings Only",
        description: "Every employer profile is verified before going live, so candidates trust your listing and apply with confidence.",
        icon: ShieldCheck,
        stat: "100%",
        statLabel: "verified employers",
        iconBg: "bg-rose-500/15 text-rose-400",
    },
];
