'use client';
import { useState } from "react";
import { jobSeekerStepsdata, recruiterStepsdata } from '@/lib/data/how-it-works-data'

type Step = {
  id: number;
  title: string;
  description: string;
  icon: React.ElementType;
  detail: string;
};

type TabKey = "seekers" | "recruiters";

const TAB_META: Record<TabKey, { label: string; steps: Step[]; accent: string; iconBg: string; connector: string }> = {
  seekers: {
    label: "For Job Seekers",
    steps: jobSeekerStepsdata,
    accent: "from-indigo-500/20 to-violet-500/5",
    iconBg: "bg-indigo-500/15 text-indigo-400",
    connector: "bg-indigo-500/20",
  },
  recruiters: {
    label: "For Recruiters",
    steps: recruiterStepsdata,
    accent: "from-emerald-500/20 to-teal-500/5",
    iconBg: "bg-emerald-500/15 text-emerald-400",
    connector: "bg-emerald-500/20",
  },
};

function StepCard({
  step,
  isLast,
  iconBg,
  connector,
  index,
}: {
  step: Step;
  isLast: boolean;
  iconBg: string;
  connector: string;
  index: number;
}) {
  const Icon = step.icon;

  return (
    <li className="relative flex flex-col sm:flex-row md:flex-col items-start sm:items-start md:items-start gap-5 sm:gap-6 md:gap-0">

      {/* Connector line (desktop horizontal) */}
      {!isLast && (
        <div className={`hidden md:block absolute top-5 left-[calc(50%+28px)] right-0 h-px ${connector} -z-0`} />
      )}

      {/* Step number + icon */}
      <div className="relative flex-shrink-0 flex flex-col items-center md:items-start gap-0">
        <div className="flex items-center gap-3 md:flex-col md:items-start md:gap-0">
          {/* Number badge */}
          <span className="absolute -top-2 -left-2 w-5 h-5 rounded-full bg-zinc-800 border border-white/[0.08] flex items-center justify-center text-[10px] font-bold text-zinc-500 z-10">
            {step.id}
          </span>
          {/* Icon */}
          <div className={`relative z-10 w-11 h-11 flex items-center justify-center rounded-xl ${iconBg} transition-colors duration-300`}>
            <Icon className="w-5 h-5" strokeWidth={1.75} />
          </div>
        </div>
      </div>

      {/* Text */}
      <div className="md:mt-5 flex flex-col gap-1.5 flex-1 md:flex-none">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="text-base font-semibold text-white">{step.title}</h3>
          <span className="text-[11px] font-medium text-zinc-600 border border-white/[0.06] bg-white/[0.03] rounded-full px-2 py-0.5">
            {step.detail}
          </span>
        </div>
        <p className="text-sm text-zinc-500 leading-relaxed">{step.description}</p>
      </div>
    </li>
  );
}


const HowItWorks = () => {
  const [active, setActive] = useState<TabKey>("seekers");
  const meta = TAB_META[active];

  return (
    <section
      aria-labelledby="how-it-works-heading"
      className="relative w-full bg-[#09090b] py-24 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0 flex justify-center items-center">
        <div className="w-[700px] h-[350px] rounded-full bg-indigo-600/7 blur-[120px]" />
      </div>

      <div className="relative max-w-5xl mx-auto">

        {/* Eyebrow */}
        <div className="flex justify-center mb-5">
          <span className="inline-flex items-center gap-2 rounded-full border border-indigo-500/25 bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-indigo-300">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
            Simple by design
          </span>
        </div>

        {/* Heading */}
        <div className="text-center mb-10">
          <h2
            id="how-it-works-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-[1.1] mb-4"
          >
            Up and running in{" "}
            <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
              three steps
            </span>
          </h2>
          <p className="text-zinc-400 text-base max-w-md mx-auto leading-relaxed">
            Whether you're hunting for a job or hiring your next teammate — the process is fast, simple, and built for results.
          </p>
        </div>

        {/* Tab toggle */}
        <div className="flex justify-center mb-10">
          <div className="flex items-center gap-1 rounded-xl border border-white/[0.07] bg-white/[0.03] p-1.5">
            {(Object.entries(TAB_META) as [TabKey, typeof meta][]).map(([key, m]) => (
              <button
                key={key}
                onClick={() => setActive(key)}
                className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${active === key
                  ? key === "seekers"
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
                    : "bg-emerald-700 text-white shadow-lg shadow-emerald-500/20"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.05]"
                  }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Steps card */}
        <div className={`rounded-2xl border border-white/[0.07] bg-gradient-to-br ${meta.accent} p-8 sm:p-10`}>
          <ol className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6 relative">
            {meta.steps.map((step, i) => (
              <StepCard
                key={step.id}
                step={step}
                isLast={i === meta.steps.length - 1}
                iconBg={meta.iconBg}
                connector={meta.connector}
                index={i}
              />
            ))}
          </ol>
        </div>

        {/* Bottom proof strip */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 sm:gap-10">
          {[
            { value: "50K+", label: "people hired" },
            { value: "< 1 week", label: "avg. time to first interview" },
            { value: "98%", label: "satisfaction rate" },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <p className="text-lg font-bold text-white tracking-tight">{value}</p>
              <p className="text-xs text-zinc-600 uppercase tracking-wider mt-0.5">{label}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default HowItWorks;