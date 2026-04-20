'use client';

import { featuresdata } from "@/lib/data/why-choose-us-data";
import Link from "next/link";


const WhyChooseUs = () => {
  return (
    <section
      aria-labelledby="why-choose-us-heading"
      className="relative w-full py-24 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0 flex justify-center items-center">
        <div className="w-[800px] h-[400px] rounded-full bg-indigo-600/7 blur-[120px]" />
      </div>

      <div className="relative max-w-6xl mx-auto">

        {/* Eyebrow */}
        <div className="flex justify-center mb-5">
          <span className="inline-flex items-center gap-2 rounded-full border border-indigo-500/25 bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-indigo-300">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
            Built different
          </span>
        </div>

        {/* Heading */}
        <div className="text-center mb-16">
          <h2
            id="why-choose-us-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-[1.1] mb-4"
          >
            Everything you need to{" "}
            <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
              hire or get hired
            </span>
          </h2>
          <p className="text-zinc-400 text-base max-w-lg mx-auto leading-relaxed">
            Designed to simplify your job search and hiring process with smart, reliable, and efficient tools.
          </p>
        </div>

        {/* Feature grid */}
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {featuresdata.map((feature) => {
            const Icon = feature.icon;

            return (
              <li key={feature.id}>
                <div className={`group h-full flex flex-col gap-5 rounded-2xl border border-white/[0.07] bg-gradient-to-br ${feature.accent} p-6 transition-all duration-300 hover:border-white/[0.14] hover:-translate-y-1`}>

                  {/* Icon + stat row */}
                  <div className="flex items-start justify-between">
                    <div className={`w-11 h-11 flex items-center justify-center rounded-xl ${feature.iconBg}`}>
                      <Icon className="w-5 h-5" strokeWidth={1.75} />
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-white tracking-tight leading-none">{feature.stat}</p>
                      <p className="text-[11px] text-zinc-500 mt-0.5 uppercase tracking-wider">{feature.statLabel}</p>
                    </div>
                  </div>

                  {/* Title */}
                  <div>
                    <h3 className="text-base font-semibold text-white mb-2">{feature.title}</h3>
                    <p className="text-sm text-zinc-400 leading-relaxed group-hover:text-zinc-300 transition-colors duration-300">
                      {feature.description}
                    </p>
                  </div>

                  {/* Learn more */}
                  <div className="mt-auto pt-2">
                    <span className="text-xs font-medium text-zinc-600 group-hover:text-zinc-400 transition-colors duration-300 flex items-center gap-1.5">
                      Learn more
                      <svg className="w-3 h-3 translate-x-0 group-hover:translate-x-0.5 transition-transform duration-300" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                        <path d="M2 6h8M6 2l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </div>

                </div>
              </li>
            );
          })}
        </ul>

        {/* Bottom banner */}
        <div className="mt-12 rounded-2xl border border-white/[0.07] bg-zinc-900/50 px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-base font-semibold text-white mb-1">Ready to find your next opportunity?</p>
            <p className="text-sm text-zinc-500">Join over 50,000 professionals already on the platform.</p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <Link
              href="/jobs"
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors duration-200 shadow-lg shadow-indigo-500/20"
            >
              Browse jobs
              <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
              </svg>
            </Link>
            <Link
              href="/post-job"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-5 py-2.5 text-sm font-semibold text-zinc-300 hover:bg-white/[0.09] hover:text-white transition-all duration-200"
            >
              Post a job
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
};

export default WhyChooseUs;