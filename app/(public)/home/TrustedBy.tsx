import Image from "next/image";
import Marquee from "react-fast-marquee";

const companies = [
    { src: "/trustedby/netflix.webp", alt: "Netflix" },
    { src: "/trustedby/ubar.webp", alt: "Ubar" },
    { src: "/trustedby/upwork.webp", alt: "UpWork" },
    { src: "/trustedby/google.webp", alt: "Google" },
    { src: "/trustedby/shopify.webp", alt: "Shopify" },
    { src: "/trustedby/amazon.webp", alt: "Amazon" },
    { src: "/trustedby/meta.webp", alt: "Meta" },
    { src: "/trustedby/stripe.webp", alt: "Stripe" },
];

const stats = [
    {
        value: "91%",
        label: "Skills Matched",
        desc: "AI-powered matching for better career alignment.",
    },
    {
        value: "3x",
        label: "Faster Hiring",
        desc: "Reduce hiring time with intelligent candidate ranking.",
    },
    {
        value: "12K+",
        label: "Companies Hiring",
        desc: "Trusted by leading startups and global enterprises.",
    },
];

const TrustedBy = () => {
    return (
        <section
            aria-labelledby="trusted-by-heading"
            className="relative overflow-hidden bg-[#09090B] py-28"
        >
            {/* BACKGROUND */}
            <div className="absolute inset-0 -z-20 bg-black" />

            {/* TOP GLOW */}
            <div className="absolute inset-x-0 top-0 -z-10 h-[350px] bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.18),transparent_70%)]" />

            {/* SIDE GLOWS */}
            <div className="absolute left-0 top-1/2 -z-10 h-[250px] w-[250px] rounded-full bg-indigo-500/10 blur-3xl" />

            <div className="absolute right-0 top-1/3 -z-10 h-[300px] w-[300px] rounded-full bg-violet-500/10 blur-3xl" />

            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                {/* EYEBROW */}
                <div className="mb-6 flex justify-center">
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-5 py-2 backdrop-blur-xl">
                        <div className="h-2 w-2 rounded-full bg-emerald-400" />

                        <span className="text-xs font-medium uppercase tracking-[0.18em] text-white/60">
                            Trusted worldwide
                        </span>
                    </div>
                </div>

                {/* HEADING */}
                <div className="mx-auto max-w-3xl text-center">
                    <h2
                        id="trusted-by-heading"
                        className="text-4xl font-semibold leading-[1.05] tracking-[-0.03em] text-white sm:text-5xl lg:text-6xl"
                    >
                        Powering hiring at
                        <span className="block bg-gradient-to-r from-indigo-400 via-violet-400 to-blue-400 bg-clip-text text-transparent">
                            world-class companies
                        </span>
                    </h2>

                    <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-white/60 sm:text-lg">
                        From fast-growing startups to global enterprises,
                        thousands of companies trust Jobify to hire exceptional
                        talent faster.
                    </p>
                </div>

                {/* LOGO MARQUEE */}
                <div className="relative mt-16">

                    {/* LEFT FADE */}
                    <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-24 bg-gradient-to-r from-[#09090B] to-transparent" />

                    {/* RIGHT FADE */}
                    <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-24 bg-gradient-to-l from-[#09090B] to-transparent" />

                    <Marquee
                        speed={32}
                        gradient={false}
                        pauseOnHover
                    >
                        <div className="flex items-center gap-16 px-8">
                            {[...companies, ...companies].map(
                                (company, index) => (
                                    <div
                                        key={index}
                                        className="opacity-40 transition-all duration-300 hover:opacity-100"
                                    >
                                        <Image
                                            src={company.src}
                                            alt={`${company.alt} logo`}
                                            width={120}
                                            height={60}
                                            className="h-10 w-auto object-contain grayscale transition-all duration-300 hover:grayscale-0"
                                        />
                                    </div>
                                )
                            )}
                        </div>
                    </Marquee>
                </div>

                {/* DIVIDER */}
                <div className="mx-auto mt-20 h-px max-w-5xl bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                {/* METRICS */}
                <div className="mt-20 grid grid-cols-1 gap-y-14 text-center sm:grid-cols-3 sm:gap-x-10">
                    {stats.map((item) => (
                        <div key={item.label}>
                            <h3 className="text-5xl font-semibold tracking-tight text-white lg:text-6xl">
                                {item.value}
                            </h3>

                            <p className="mt-4 text-sm font-medium uppercase tracking-[0.14em] text-white/40">
                                {item.label}
                            </p>

                            <p className="mx-auto mt-4 max-w-xs text-sm leading-7 text-white/50">
                                {item.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TrustedBy;