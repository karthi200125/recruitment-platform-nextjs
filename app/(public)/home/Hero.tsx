
import Image from "next/image";
import Link from "next/link";
import JobsSearchBar from "@/components/JobsSearchBar";
import CtaButton from "@/components/ui/CtaButton";


const HeroSection = () => {
    return (
        <section
            aria-label="Find jobs and hire talent"
            className="relative overflow-hidden pb-24"
        >
            {/* BACKGROUND */}
            <div className="absolute inset-0 -z-50 bg-black" />

            {/* Top Glow */}
            <div className="absolute inset-x-0 top-0 -z-40 h-[500px] bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.25),transparent_70%)]" />

            {/* Left Glow */}
            <div className="absolute left-0 top-1/3 -z-40 h-[300px] w-[300px] rounded-full bg-indigo-500/10 blur-3xl" />

            {/* Right Glow */}
            <div className="absolute right-0 top-1/4 -z-40 h-[350px] w-[350px] rounded-full bg-violet-500/10 blur-3xl" />

            <div className="mx-auto flex max-w-7xl flex-col items-center px-4 sm:px-6 lg:px-8">

                {/* HERO CONTENT */}
                <div className="relative z-10 flex max-w-5xl flex-col items-center text-center pt-32 lg:pt-40">

                    {/* TRUST BADGE */}
                    <div
                        className="mb-8"
                    >
                        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-5 py-2 backdrop-blur-xl">
                            <div className="h-2 w-2 rounded-full bg-emerald-400" />

                            <span className="text-sm font-medium text-white/70">
                                Trusted by{" "}
                                <span className="font-semibold text-white">
                                    12,000+
                                </span>{" "}
                                companies worldwide
                            </span>
                        </div>
                    </div>

                    {/* HEADING */}
                    <div>
                        <h1 className="max-w-5xl text-5xl font-semibold leading-[1.05] tracking-[-0.04em] text-white sm:text-6xl lg:text-7xl xl:text-[88px]">
                            Where ambitious
                            <span className="relative mx-3 inline-block">
                                <span className="relative z-10 bg-gradient-to-r from-indigo-400 via-violet-400 to-blue-400 bg-clip-text text-transparent">
                                    careers
                                </span>

                                <span className="absolute inset-0 -z-10 blur-3xl bg-indigo-500/30" />
                            </span>
                            begin.
                        </h1>
                    </div>

                    {/* SUBTEXT */}
                    <p
                        className="mt-8 max-w-2xl text-base leading-8 text-white/60 sm:text-lg"
                    >
                        Discover verified opportunities, connect with leading
                        companies, and land your next role with confidence —
                        all in one modern hiring platform.
                    </p>

                    <div className="mt-10 flex flex-wrap items-center justify-center gap-4">

                        <CtaButton
                            href="/signin"
                            showArrow
                        >
                            Find Jobs
                        </CtaButton>

                        <CtaButton
                            href="/signin"
                            variant="secondary"
                        >
                            Hire Talent
                        </CtaButton>

                    </div>

                    {/* SEARCH BAR */}
                    <div
                        className="mt-10 w-full max-w-5xl"
                    >
                        <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-2 shadow-2xl shadow-indigo-500/5 backdrop-blur-2xl">
                            <JobsSearchBar className="rounded-2xl border-0 bg-transparent text-white" />
                        </div>
                    </div>

                </div>

                {/* DASHBOARD PREVIEW */}
                <div
                    className="relative mt-16 md:mt-20 lg:mt-24 w-full max-w-7xl mx-auto"
                >
                    {/* MAIN GLOW */}
                    <div className="absolute inset-0 -z-20">
                        <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/20 blur-[140px]" />
                        <div className="absolute bottom-0 left-1/2 h-[300px] w-[600px] -translate-x-1/2 rounded-full bg-indigo-500/15 blur-[120px]" />
                    </div>

                    {/* DASHBOARD CONTAINER */}
                    <div className="relative overflow-hidden rounded-[24px] md:rounded-[32px]">

                        {/* TOP LIGHT */}
                        <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-white/[0.04] via-transparent to-transparent" />

                        {/* IMAGE */}
                        <Image
                            src="/hero-dashboard.webp"
                            alt="AI-powered job board dashboard"
                            width={1800}
                            height={1200}
                            priority
                            className="
                h-auto
                w-full
                object-contain
                drop-shadow-[0_40px_80px_rgba(99,102,241,0.35)]
            "
                        />

                        {/* BOTTOM FADE */}
                        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 md:h-32 bg-gradient-to-t from-black to-transparent" />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;