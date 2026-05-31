"use client";

import { memo, useMemo, useState } from "react";

import {
  jobSeekerStepsdata,
  recruiterStepsdata,
} from "@/lib/data/how-it-works-data";

type Step = {
  id: number;
  title: string;
  description: string;
  icon: React.ElementType;
};

type TabKey = "seekers" | "recruiters";

const TAB_META: Record<
  TabKey,
  {
    label: string;
    steps: Step[];
    accent: string;
    iconColor: string;
    lineColor: string;
    activeTab: string;
  }
> = {
  seekers: {
    label: "For Job Seekers",
    steps: jobSeekerStepsdata,
    accent: "from-indigo-500/10",
    iconColor: "text-indigo-300",
    lineColor: "bg-indigo-500/15",
    activeTab:
      "bg-indigo-500/15 text-white border border-indigo-500/20",
  },

  recruiters: {
    label: "For Recruiters",
    steps: recruiterStepsdata,
    accent: "from-emerald-500/10",
    iconColor: "text-emerald-300",
    lineColor: "bg-emerald-500/15",
    activeTab:
      "bg-emerald-500/15 text-white border border-emerald-500/20",
  },
};

const StepItem = memo(function StepItem({
  step,
  isLast,
  iconColor,
  lineColor,
}: {
  step: Step;
  isLast: boolean;
  iconColor: string;
  lineColor: string;
}) {
  const Icon = step.icon;

  return (
    <li className="relative flex flex-col items-start">

      {/* CONNECTOR */}
      {!isLast && (
        <div
          className={`
                        absolute left-5 top-14 hidden h-px w-full md:block
                        ${lineColor}
                    `}
        />
      )}

      {/* ICON */}
      <div className="relative z-10 flex h-11 w-11 items-center justify-center rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl">
        <Icon
          className={`h-5 w-5 ${iconColor}`}
          strokeWidth={1.75}
        />
      </div>

      {/* CONTENT */}
      <div className="mt-6 max-w-sm">

        {/* STEP NUMBER */}
        <span className="text-xs font-medium uppercase tracking-[0.18em] text-white/30">
          Step {step.id}
        </span>

        {/* TITLE */}
        <h3 className="mt-3 text-xl font-semibold tracking-tight text-white">
          {step.title}
        </h3>

        {/* DESCRIPTION */}
        <p className="mt-4 text-sm leading-7 text-white/50">
          {step.description}
        </p>
      </div>
    </li>
  );
});

StepItem.displayName = "StepItem";


const HowItWorks = () => {
  const [active, setActive] =
    useState<TabKey>("seekers");

  const meta = useMemo(
    () => TAB_META[active],
    [active]
  );

  return (
    <section
      aria-labelledby="how-it-works-heading"
      className="relative overflow-hidden py-28"
    >
      {/* BACKGROUND */}
      <div className="absolute inset-0 -z-20 bg-black" />

      {/* TOP GLOW */}
      <div className="absolute inset-x-0 top-0 -z-10 h-[320px] bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.16),transparent_72%)]" />

      {/* SIDE GLOW */}
      <div className="absolute left-1/2 top-1/2 -z-10 h-[320px] w-[320px] -translate-x-1/2 rounded-full bg-indigo-500/10 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

        {/* EYEBROW */}
        <div className="mb-6 flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-5 py-2 backdrop-blur-xl">
            <div className="h-2 w-2 rounded-full bg-indigo-400" />

            <span className="text-xs font-medium uppercase tracking-[0.18em] text-white/60">
              Simple by design
            </span>
          </div>
        </div>

        {/* HEADING */}
        <div className="mx-auto max-w-3xl text-center">
          <h2
            id="how-it-works-heading"
            className="text-4xl font-semibold leading-[1.05] tracking-[-0.03em] text-white sm:text-5xl lg:text-6xl"
          >
            Everything you need
            <span className="block bg-gradient-to-r from-indigo-400 via-violet-400 to-blue-400 bg-clip-text text-transparent">
              to get hired faster
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-white/60 sm:text-lg">
            Whether you&apos;re applying for your next role
            or hiring top talent, the process is designed to
            feel fast, seamless, and effortless.
          </p>
        </div>

        {/* TABS */}
        <div className="mt-14 flex justify-center">
          <div className="inline-flex rounded-2xl border border-white/[0.08] bg-white/[0.03] p-1.5 backdrop-blur-xl">
            {(Object.entries(TAB_META) as [
              TabKey,
              typeof meta
            ][]).map(([key, item]) => (
              <button
                key={key}
                onClick={() => setActive(key)}
                aria-pressed={active === key}
                className={`
                                    rounded-xl px-6 py-3 text-sm font-medium
                                    transition-all duration-300

                                    ${active === key
                    ? item.activeTab
                    : "text-white/45 hover:text-white/80"
                  }
                                `}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* STEPS */}
        <div className="relative mt-24">
          <ol className="grid grid-cols-1 gap-y-16 md:grid-cols-3 md:gap-x-12">
            {meta.steps.map((step, index) => (
              <StepItem
                key={step.id}
                step={step}
                isLast={
                  index ===
                  meta.steps.length - 1
                }
                iconColor={meta.iconColor}
                lineColor={meta.lineColor}
              />
            ))}
          </ol>
        </div>

      </div>
    </section>
  );
};

export default memo(HowItWorks);