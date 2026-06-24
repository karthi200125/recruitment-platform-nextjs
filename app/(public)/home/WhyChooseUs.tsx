import CtaButton from "@/components/ui/CtaButton";
import { featuresdata } from "@/lib/data/why-choose-us-data";
import Link from "next/link";

const WhyChooseUs = () => {
    return (
        <section
            aria-labelledby="why-choose-us-heading"
            className="relative overflow-hidden bg-[#09090B] py-28"
        >
            {/* BACKGROUND */}
            <div className="absolute inset-0 -z-20 bg-black" />

            {/* TOP GLOW */}
            <div className="absolute inset-x-0 top-0 -z-10 h-[380px] bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.18),transparent_72%)]" />

            {/* SIDE GLOW */}
            <div className="absolute right-0 top-1/3 -z-10 h-[320px] w-[320px] rounded-full bg-indigo-500/10 blur-3xl" />

            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                {/* EYEBROW */}
                <div className="mb-6 flex justify-center">
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-5 py-2 backdrop-blur-xl">
                        <div className="h-2 w-2 rounded-full bg-indigo-400" />

                        <span className="text-xs font-medium uppercase tracking-[0.18em] text-white/60">
                            Built for modern hiring
                        </span>
                    </div>
                </div>

                {/* HEADING */}
                <div className="mx-auto max-w-3xl text-center">
                    <h2
                        id="why-choose-us-heading"
                        className="text-4xl font-semibold leading-[1.05] tracking-[-0.03em] text-white sm:text-5xl lg:text-6xl"
                    >
                        Everything you need
                        <span className="block bg-gradient-to-r from-indigo-400 via-violet-400 to-blue-400 bg-clip-text text-transparent">
                            to hire or get hired
                        </span>
                    </h2>

                    <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-white/60 sm:text-lg">
                        Powerful tools designed to simplify hiring,
                        streamline job discovery, and create better
                        opportunities for everyone.
                    </p>
                </div>

                {/* BENTO GRID */}
                <div className="mt-20 grid grid-cols-1 gap-5 lg:grid-cols-3">

                    {featuresdata.map((feature, index) => {
                        const Icon = feature.icon;

                        const largeCard =
                            index === 0 || index === 3;

                        const statFocused =
                            index === 2;

                        return (
                            <div
                                key={feature.id}
                                className={`
                                    group relative overflow-hidden rounded-[30px]
                                    border border-white/[0.08]
                                    bg-white/[0.03]
                                    backdrop-blur-xl
                                    transition-all duration-300
                                    hover:-translate-y-1
                                    hover:border-white/[0.14]
                                    hover:bg-white/[0.05]

                                    ${largeCard
                                        ? "lg:col-span-2 p-10"
                                        : "p-8"
                                    }
                                `}
                            >
                                {/* TOP HAIRLINE */}
                                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                                {/* FEATURED GLOW */}
                                <div className="absolute inset-0 -z-10 bg-gradient-to-br from-indigo-500/5 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                                {/* CONTENT */}
                                <div className="flex h-full flex-col">

                                    {/* ICON */}
                                    <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/[0.06] bg-white/[0.03] text-white/80">
                                        <Icon
                                            className="h-5 w-5"
                                            strokeWidth={1.75}
                                        />
                                    </div>

                                    {/* STAT FOCUSED CARD */}
                                    {statFocused ? (
                                        <>
                                            <h3 className="text-6xl font-semibold tracking-tight text-white">
                                                {feature.stat}
                                            </h3>

                                            <p className="mt-4 text-xs font-medium uppercase tracking-[0.18em] text-white/35">
                                                {feature.statLabel}
                                            </p>

                                            <p className="mt-6 max-w-sm text-sm leading-7 text-white/55">
                                                {feature.description}
                                            </p>
                                        </>
                                    ) : (
                                        <>
                                            {/* TITLE */}
                                            <h3
                                                className={`
                                                    font-semibold tracking-tight text-white

                                                    ${largeCard
                                                        ? "text-3xl"
                                                        : "text-2xl"
                                                    }
                                                `}
                                            >
                                                {feature.title}
                                            </h3>

                                            {/* DESCRIPTION */}
                                            <p
                                                className={`
                                                    mt-5 text-sm leading-7 text-white/55

                                                    ${largeCard
                                                        ? "max-w-2xl"
                                                        : "max-w-sm"
                                                    }
                                                `}
                                            >
                                                {feature.description}
                                            </p>

                                            {/* LARGE CARD STAT */}
                                            {feature.stat && (
                                                <div className="mt-auto pt-10">
                                                    <div className="flex items-end gap-3">
                                                        <h4 className="text-5xl font-semibold tracking-tight text-white">
                                                            {feature.stat}
                                                        </h4>

                                                        <span className="pb-2 text-xs font-medium uppercase tracking-[0.18em] text-white/35">
                                                            {feature.statLabel}
                                                        </span>
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* CTA SECTION */}
                <div className="relative mt-20 overflow-hidden rounded-[32px] border border-white/[0.08] bg-white/[0.03] px-8 py-10 backdrop-blur-xl sm:px-12 sm:py-12">

                    {/* GLOW */}
                    <div className="absolute inset-0 -z-10 bg-gradient-to-r from-indigo-500/5 via-transparent to-transparent" />

                    <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">

                        {/* TEXT */}
                        <div className="max-w-2xl">
                            <h3 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                                Your next opportunity starts here.
                            </h3>

                            <p className="mt-4 text-base leading-8 text-white/55">
                                Join thousands of professionals and
                                companies already building their future
                                with Jobify.
                            </p>
                        </div>

                        {/* BUTTONS */}
                        <div className="flex flex-wrap items-center gap-4">

                            <CtaButton
                                href="/jobs"
                                variant="secondary"
                            >
                                Browse Jobs
                            </CtaButton>
                            

                            <Link
                                href="/signin"
                                className="
                                    inline-flex items-center justify-center
                                    rounded-2xl
                                    border border-white/[0.08]
                                    bg-white/[0.03]
                                    px-7 py-3.5
                                    text-sm font-medium text-white/70
                                    backdrop-blur-xl
                                    transition-all duration-300
                                    hover:border-white/[0.14]
                                    hover:bg-white/[0.06]
                                    hover:text-white
                                "
                            >
                                Post a job
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default WhyChooseUs;