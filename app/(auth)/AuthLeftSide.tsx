import Logo from "@/components/Logo";
import { Briefcase, Users, Zap } from "lucide-react";

const FEATURES = [
    { icon: Zap, text: "AI-matched job recommendations" },
    { icon: Users, text: "12,000+ companies actively hiring" },
    { icon: Briefcase, text: "One-click apply to any role" },
];

const AVATARS = ["IK", "PS", "RV", "AM", "SN"];

export default function AuthLeftSide() {
    return (
        <div className="relative flex h-full w-full flex-col justify-between overflow-hidden px-10 py-12">
            {/* Background grid pattern */}
            <div
                className="pointer-events-none absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage:
                        "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)",
                    backgroundSize: "40px 40px",
                }}
            />

            {/* Glow */}
            <div className="pointer-events-none absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-indigo-600/20 blur-[100px]" />
            <div className="pointer-events-none absolute -bottom-40 -right-20 h-[400px] w-[400px] rounded-full bg-violet-600/15 blur-[100px]" />

            {/* Logo */}
            <Logo />

            {/* Center content */}
            <div className="relative space-y-8">
                <div>
                    <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-indigo-400">
                        Career platform
                    </p>

                    <h2 className="mb-4 text-3xl font-bold leading-[1.15] tracking-tight text-white xl:text-4xl">
                        Launch your career
                        <br />
                        <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                            journey in seconds
                        </span>
                    </h2>

                    <p className="max-w-xs text-sm leading-relaxed text-zinc-400">
                        Join 50,000+ professionals who found their next role through
                        Jobify&apos;s AI-powered platform.
                    </p>
                </div>

                {/* Feature list */}
                <ul className="space-y-3">
                    {FEATURES.map(({ icon: Icon, text }) => (
                        <li key={text} className="flex items-center gap-3">
                            <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-indigo-500/15">
                                <Icon
                                    className="h-3.5 w-3.5 text-indigo-400"
                                    strokeWidth={2}
                                />
                            </div>

                            <span className="text-sm text-zinc-300">
                                {text}
                            </span>
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
                            className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-zinc-900 bg-indigo-500/20 text-[10px] font-semibold text-indigo-300"
                        >
                            {initials}
                        </div>
                    ))}
                </div>

                <div>
                    <p className="text-xs font-semibold text-white">
                        50,000+ hired
                    </p>

                    <p className="text-[11px] text-zinc-500">
                        through Jobify this year
                    </p>
                </div>
            </div>
        </div>
    );
}