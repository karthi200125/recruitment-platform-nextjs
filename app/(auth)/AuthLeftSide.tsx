'use client'

import { ArrowLeft, Briefcase, Users, Zap } from 'lucide-react';

const FEATURES = [
    { icon: Zap, text: "AI-matched job recommendations" },
    { icon: Users, text: "12,000+ companies actively hiring" },
    { icon: Briefcase, text: "One-click apply to any role" },
];

const AVATARS = ["IK", "PS", "RV", "AM", "SN"];

export default function AuthLeftSide() {
    return (
        <div className="relative flex flex-col justify-between h-full w-full px-10 py-12 overflow-hidden">

            {/* Background grid pattern */}
            <div
                className="pointer-events-none absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)",
                    backgroundSize: "40px 40px",
                }}
            />

            {/* Glow */}
            <div className="pointer-events-none absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-indigo-600/20 blur-[100px]" />
            <div className="pointer-events-none absolute -bottom-40 -right-20 w-[400px] h-[400px] rounded-full bg-violet-600/15 blur-[100px]" />

            {/* Logo */}
            <div className="relative flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                    <Briefcase className="w-4 h-4 text-white" strokeWidth={2} />
                </div>
                <span className="text-base font-bold text-white tracking-tight">Jobify</span>
            </div>

            {/* Center content */}
            <div className="relative space-y-8">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-indigo-400 mb-3">
                        Career platform
                    </p>
                    <h2 className="text-3xl xl:text-4xl font-bold text-white leading-[1.15] tracking-tight mb-4">
                        Launch your career<br />
                        <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                            journey in seconds
                        </span>
                    </h2>
                    <p className="text-zinc-400 text-sm leading-relaxed max-w-xs">
                        Join 50,000+ professionals who found their next role through Jobify's AI-powered platform.
                    </p>
                </div>

                {/* Feature list */}
                <ul className="space-y-3">
                    {FEATURES.map(({ icon: Icon, text }) => (
                        <li key={text} className="flex items-center gap-3">
                            <div className="w-7 h-7 rounded-lg bg-indigo-500/15 flex items-center justify-center flex-shrink-0">
                                <Icon className="w-3.5 h-3.5 text-indigo-400" strokeWidth={2} />
                            </div>
                            <span className="text-sm text-zinc-300">{text}</span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Social proof */}
            <div className="relative flex items-center gap-3">
                <div className="flex -space-x-2">
                    {AVATARS.map((initials, i) => (
                        <div
                            key={i}
                            className="w-8 h-8 rounded-full border-2 border-zinc-900 bg-indigo-500/20 flex items-center justify-center text-[10px] font-semibold text-indigo-300"
                        >
                            {initials}
                        </div>
                    ))}
                </div>
                <div>
                    <p className="text-xs font-semibold text-white">50,000+ hired</p>
                    <p className="text-[11px] text-zinc-500">through Jobify this year</p>
                </div>
            </div>
        </div>
    );
}
