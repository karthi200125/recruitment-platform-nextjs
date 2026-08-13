import CtaButton from "@/components/ui/CtaButton";
import { categoriesdata } from "@/lib/data/catagories-data";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const JobCategories = () => {
    const totalJobs = categoriesdata.reduce(
        (sum, c) => sum + c.count,
        0
    );

    return (
        <section
            aria-labelledby="job-categories-heading"
            className="relative overflow-hidden py-28"
        >
            {/* BACKGROUND */}
            <div className="absolute inset-0 -z-20 bg-black" />

            {/* TOP GLOW */}
            <div className="absolute inset-x-0 top-0 -z-10 h-[320px] bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.18),transparent_72%)]" />

            {/* SIDE GLOW */}
            <div className="absolute left-0 top-1/2 -z-10 h-[260px] w-[260px] rounded-full bg-indigo-500/10 blur-3xl" />

            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                {/* EYEBROW */}
                <div className="mb-6 flex justify-center">
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-5 py-2 backdrop-blur-xl">
                        <div className="h-2 w-2 rounded-full bg-indigo-400" />

                        <span className="text-xs font-medium uppercase tracking-[0.18em] text-white/60">
                            {totalJobs.toLocaleString()}+ open roles
                        </span>
                    </div>
                </div>

                {/* HEADING */}
                <div className="mx-auto max-w-3xl text-center">
                    <h2
                        id="job-categories-heading"
                        className="text-4xl font-semibold leading-[1.05] tracking-[-0.03em] text-white sm:text-5xl lg:text-6xl"
                    >
                        Find work in your
                        <span className="block bg-gradient-to-r from-indigo-400 via-violet-400 to-blue-400 bg-clip-text text-transparent">
                            field of expertise
                        </span>
                    </h2>

                    <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-white/60 sm:text-lg">
                        Explore verified opportunities across the most
                        in-demand career paths and discover roles that match
                        your skills and ambitions.
                    </p>
                </div>

                {/* GRID */}
                <ul className="mt-20 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {categoriesdata.map((category, index) => {
                        const Icon = category.icon;

                        const featured =
                            index === 0 || index === 4;

                        return (
                            <li
                                key={category.id}
                                className={
                                    featured
                                        ? "sm:col-span-2"
                                        : ""
                                }
                            >
                                <Link
                                    href={`/jobs`}
                                    aria-label={`Browse ${category.name} jobs`}
                                    className={`
                                        group relative flex h-full flex-col overflow-hidden rounded-[28px]
                                        border border-white/[0.08]
                                        bg-white/[0.03]
                                        p-7
                                        backdrop-blur-xl
                                        transition-all duration-300
                                        hover:border-white/[0.14]
                                        hover:bg-white/[0.05]
                                        hover:-translate-y-1
                                    `}
                                >
                                    {/* TOP HAIRLINE */}
                                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                                    {/* ICON */}
                                    <div
                                        className={`
                                            mb-7 flex h-12 w-12 items-center justify-center rounded-2xl
                                            border border-white/[0.06]
                                            bg-white/[0.03]
                                            text-white/80
                                            transition-all duration-300
                                            group-hover:bg-white/[0.05]
                                        `}
                                    >
                                        <Icon
                                            className="h-5 w-5"
                                            strokeWidth={1.75}
                                        />
                                    </div>

                                    {/* CONTENT */}
                                    <div className="flex flex-1 flex-col">

                                        {/* TITLE */}
                                        <h3 className="text-xl font-semibold tracking-tight text-white transition-colors duration-300">
                                            {category.name}
                                        </h3>

                                        {/* JOB COUNT */}
                                        <p className="mt-2 text-sm font-medium text-indigo-300/80">
                                            {category.count.toLocaleString()} open roles
                                        </p>

                                        {/* DESCRIPTION */}
                                        <p className="mt-5 max-w-md text-sm leading-7 text-white/50 transition-colors duration-300 group-hover:text-white/60">
                                            {category.description}
                                        </p>

                                        {/* CTA */}
                                        <div className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-white/60 transition-all duration-300 group-hover:text-white">
                                            Explore careers

                                            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                                        </div>
                                    </div>

                                    {/* FEATURED GLOW */}
                                    {featured && (
                                        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-indigo-500/5 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                                    )}
                                </Link>
                            </li>
                        );
                    })}
                </ul>

                {/* BOTTOM CTA */}
                <div className="mt-14 flex justify-center">
                    <CtaButton
                        href="/signin"
                        variant="secondary"
                    >
                        Explore all career paths
                    </CtaButton>
                </div>
            </div>
        </section>
    );
};

export default JobCategories;