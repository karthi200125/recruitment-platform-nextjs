'use client';

import { useMutation } from '@tanstack/react-query';
import { selectRole } from '@/actions/user/selectRole';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Briefcase, Users, Building2, ArrowRight, CheckCircle2 } from 'lucide-react';

type Role = "CANDIDATE" | "RECRUITER" | "ORGANIZATION";

const ROLES: {
    key: Role;
    title: string;
    subtitle: string;
    description: string;
    icon: React.ElementType;
    perks: string[];
    iconBg: string;
    iconColor: string;
    activeBorder: string;
    activeBg: string;
    activeSubtitle: string;
    checkColor: string;
    perkDot: string;
    ctaColor: string;
}[] = [
        {
            key: "CANDIDATE",
            title: "Job Seeker",
            subtitle: "Find your next role",
            description: "Browse thousands of verified jobs, apply in seconds, and track your applications in one place.",
            icon: Users,
            perks: ["AI-matched job recommendations", "One-click apply", "Application tracking"],
            iconBg: "bg-indigo-50",
            iconColor: "text-indigo-600",
            activeBorder: "border-indigo-400",
            activeBg: "bg-indigo-50/60",
            activeSubtitle: "text-indigo-500",
            checkColor: "text-indigo-500",
            perkDot: "bg-indigo-300",
            ctaColor: "text-indigo-500 group-hover:text-indigo-600",
        },
        {
            key: "RECRUITER",
            title: "Recruiter",
            subtitle: "Hire top talent",
            description: "Post jobs, access a verified candidate pool, and use smart tools to hire 3x faster.",
            icon: Briefcase,
            perks: ["Unlimited job postings", "Smart candidate filters", "Direct messaging"],
            iconBg: "bg-violet-50",
            iconColor: "text-violet-600",
            activeBorder: "border-violet-400",
            activeBg: "bg-violet-50/60",
            activeSubtitle: "text-violet-500",
            checkColor: "text-violet-500",
            perkDot: "bg-violet-300",
            ctaColor: "text-violet-500 group-hover:text-violet-600",
        },
        {
            key: "ORGANIZATION",
            title: "Organization",
            subtitle: "Scale your hiring",
            description: "Full-team hiring, company branding, advanced analytics, and priority support for growing teams.",
            icon: Building2,
            perks: ["Company profile page", "Team hiring access", "Advanced analytics"],
            iconBg: "bg-emerald-50",
            iconColor: "text-emerald-600",
            activeBorder: "border-emerald-400",
            activeBg: "bg-emerald-50/60",
            activeSubtitle: "text-emerald-500",
            checkColor: "text-emerald-500",
            perkDot: "bg-emerald-300",
            ctaColor: "text-emerald-500 group-hover:text-emerald-600",
        },
    ];

export default function RoleForm() {
    const router = useRouter();
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);

    const mutation = useMutation({
        mutationFn: async (role: Role) => {
            const res = await selectRole(role);
            if (!res.success) throw new Error(res.error || 'Something went wrong');
            return role;
        },
        onSuccess: (role) => {
            router.push(role === "CANDIDATE" ? '/jobs' : '/dashboard');
            router.refresh();
        },
        onError: (error: Error) => {
            console.error('[ROLE_SELECT_ERROR]', error.message);
            setSelectedRole(null);
        },
    });

    const handleSelectRole = (role: Role) => {
        if (mutation.isPending) return;
        setSelectedRole(role);
        mutation.mutate(role);
    };

    return (
        <main className="relative w-full flex items-center justify-center px-4 py-16 overflow-hidden">

            {/* Decorative blobs */}
            <div className="pointer-events-none absolute top-0 left-0 w-[500px] h-[500px] rounded-full bg-indigo-100/60 blur-[100px] -translate-x-1/2 -translate-y-1/2" />
            <div className="pointer-events-none absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-violet-100/50 blur-[100px] translate-x-1/3 translate-y-1/3" />

            {/* Subtle dot pattern */}
            <div
                className="pointer-events-none absolute inset-0 opacity-[0.4]"
                style={{
                    backgroundImage: "radial-gradient(circle, #cbd5e1 1px, transparent 1px)",
                    backgroundSize: "28px 28px",
                }}
            />

            <div className="relative w-full max-w-4xl mx-auto">

                {/* Heading */}
                <div className="text-center mb-10">
                    <div className="flex justify-center mb-4">
                        <span className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-indigo-600">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                            One-time setup
                        </span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 leading-[1.1] mb-3">
                        How will you use{" "}
                        <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                            Jobify?
                        </span>
                    </h1>
                    <p className="text-slate-500 text-base max-w-sm mx-auto leading-relaxed">
                        Choose your role to get a personalized experience. You can always update this later.
                    </p>
                </div>

                {/* Role cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    {ROLES.map((role) => {
                        const Icon = role.icon;
                        const isSelected = selectedRole === role.key;
                        const isLoading = mutation.isPending && isSelected;
                        const isDisabled = mutation.isPending && !isSelected;

                        return (
                            <button
                                key={role.key}
                                onClick={() => handleSelectRole(role.key)}
                                disabled={mutation.isPending}
                                aria-pressed={isSelected}
                                className={`group relative flex flex-col text-left rounded-2xl border-2 p-6 transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white shadow-sm ${isSelected
                                        ? `${role.activeBorder} ${role.activeBg} shadow-lg -translate-y-1`
                                        : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5'
                                    } ${isDisabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
                            >
                                {/* Icon + check */}
                                <div className="flex items-start justify-between mb-5">
                                    <div className={`w-11 h-11 flex items-center justify-center rounded-xl ${role.iconBg} transition-colors duration-300`}>
                                        {isLoading ? (
                                            <svg className={`w-5 h-5 animate-spin ${role.iconColor}`} viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                            </svg>
                                        ) : (
                                            <Icon className={`w-5 h-5 ${role.iconColor}`} strokeWidth={1.75} />
                                        )}
                                    </div>
                                    {isSelected && !isLoading && (
                                        <CheckCircle2 className={`w-5 h-5 flex-shrink-0 ${role.checkColor}`} strokeWidth={2} />
                                    )}
                                </div>

                                {/* Title + subtitle */}
                                <p className="text-base font-bold text-slate-800 mb-0.5">{role.title}</p>
                                <p className={`text-xs font-semibold mb-3 transition-colors duration-200 ${isSelected ? role.activeSubtitle : 'text-slate-400'}`}>
                                    {role.subtitle}
                                </p>

                                {/* Description */}
                                <p className="text-sm text-slate-500 leading-relaxed mb-5 flex-1">
                                    {role.description}
                                </p>

                                {/* Perks */}
                                <ul className="space-y-1.5 mb-5">
                                    {role.perks.map((perk) => (
                                        <li key={perk} className="flex items-center gap-2 text-xs text-slate-500">
                                            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${isSelected ? role.perkDot : 'bg-slate-300'}`} />
                                            {perk}
                                        </li>
                                    ))}
                                </ul>

                                {/* CTA */}
                                <div className={`flex items-center gap-1.5 text-xs font-semibold transition-all duration-300 ${isSelected ? role.ctaColor.split(' ')[0] : `text-slate-400 ${role.ctaColor.split(' ')[1]}`}`}>
                                    {isLoading ? 'Setting up...' : isSelected ? 'Selected ✓' : 'Select role'}
                                    {!isLoading && !isSelected && (
                                        <ArrowRight className="w-3.5 h-3.5 translate-x-0 group-hover:translate-x-0.5 transition-transform duration-300" />
                                    )}
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Error banner */}
                {mutation.isError && (
                    <div className="flex items-center justify-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-6">
                        <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                        Something went wrong. Please try again.
                    </div>
                )}

                {/* Footer note */}
                <p className="text-center text-xs text-slate-400">
                    You can change your role anytime from account settings.
                </p>

            </div>
        </main>
    );
}