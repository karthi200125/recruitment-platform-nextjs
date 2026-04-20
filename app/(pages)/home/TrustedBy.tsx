'use client';

import Image from "next/image";
import Marquee from "react-fast-marquee";

const companies = [
  { src: '/logos/netflix.webp', alt: "Netflix" },
  { src: '/logos/nvidia.webp', alt: "Nvidia" },
  { src: '/logos/apple.webp', alt: "Apple" },
  { src: '/logos/google.webp', alt: "Google" },
  { src: '/logos/microsoft.webp', alt: "Microsoft" },
  { src: '/logos/amazon.webp', alt: "Amazon" },
  { src: '/logos/meta.webp', alt: "Meta" },
  { src: '/logos/stripe.webp', alt: "Stripe" },
];

const stats = [
  {
    value: "91%",
    title: "Skills Matched",
    desc: "Candidates find roles aligned with their exact skill set faster than any other platform.",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ),
    color: "text-amber-400 bg-amber-500/10",
  },
  {
    value: "3x",
    title: "Faster Hiring",
    desc: "Companies reduce time-to-hire by 3x using AI-powered filtering and smart candidate ranking.",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polyline points="13 2 13 9 20 9" /><path d="M21 3L13 11" /><path d="M10 21H3a2 2 0 01-2-2V5a2 2 0 012-2h7" />
      </svg>
    ),
    color: "text-indigo-400 bg-indigo-500/10",
  },
  {
    value: "12K+",
    title: "Companies Hiring",
    desc: "Leading global companies across every industry trust our platform to find top talent.",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
    color: "text-emerald-400 bg-emerald-500/10",
  },
];

const TrustedBy = () => {
  return (
    <section
      aria-labelledby="trusted-by-heading"
      className="relative w-full py-24 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0 flex justify-center items-center">
        <div className="w-[600px] h-[300px] rounded-full bg-indigo-600/7 blur-[110px]" />
      </div>

      <div className="relative max-w-6xl mx-auto">

        {/* Eyebrow */}
        <div className="flex justify-center mb-5">
          <span className="inline-flex items-center gap-2 rounded-full border border-indigo-500/25 bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-indigo-300">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
            Trusted worldwide
          </span>
        </div>

        {/* Heading */}
        <div className="text-center mb-14">
          <h2
            id="trusted-by-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-[1.1] mb-4"
          >
            Powering hiring at{" "}
            <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
              world-class companies
            </span>
          </h2>
          <p className="text-zinc-400 text-base max-w-md mx-auto leading-relaxed">
            From early-stage startups to Fortune 500s — thousands of companies use Jobify to find exceptional talent.
          </p>
        </div>

        {/* Logo marquee */}
        <div className="relative mb-16">
          {/* Fade edges */}
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-r from-[#09090b] to-transparent" />
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-l from-[#09090b] to-transparent" />

          <Marquee speed={35} pauseOnHover gradient={false}>
            <div className="flex items-center gap-14 px-7">
              {[...companies, ...companies].map((company, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 opacity-40 hover:opacity-100 transition-opacity duration-300"
                >
                  <Image
                    src={company.src}
                    alt={`${company.alt} logo`}
                    width={110}
                    height={44}
                    className="object-contain grayscale hover:grayscale-0 transition-all duration-300 h-8 w-auto"
                  />
                </div>
              ))}
            </div>
          </Marquee>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent mb-16" />

        {/* Stats */}
        <dl className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {stats.map((item) => (
            <div
              key={item.title}
              className="group relative flex flex-col gap-4 rounded-2xl border border-white/[0.07] bg-zinc-900/40 p-7 hover:border-white/[0.14] hover:-translate-y-1 transition-all duration-300 overflow-hidden"
            >
              {/* Subtle top gradient */}
              <div className="pointer-events-none absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

              {/* Icon */}
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${item.color}`}>
                {item.icon}
              </div>

              {/* Value */}
              <div>
                <dt className="text-4xl font-bold text-white tracking-tight leading-none mb-2">
                  {item.value}
                </dt>
                <p className="text-sm font-semibold text-zinc-300 mb-1.5">{item.title}</p>
                <dd className="text-sm text-zinc-500 leading-relaxed">{item.desc}</dd>
              </div>
            </div>
          ))}
        </dl>

      </div>
    </section>
  );
};

export default TrustedBy;