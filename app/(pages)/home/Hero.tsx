'use client';

import Image from "next/image";
import { useState } from "react";
import { Search, MapPin } from "lucide-react";

const STATS = [
  { value: "1,000+", label: "Companies Hiring" },
  { value: "50K+", label: "Active Listings" },
  { value: "2M+", label: "Job Seekers" },
];

const HeroSection = () => {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");

  return (
    <section
      aria-label="Find jobs and hire talent"
      className="relative min-h-screen flex flex-col justify-center items-center px-4 pt-28 pb-10 overflow-hidden"
    >
      {/* Background Glow */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(99,102,241,0.2),transparent)]"
      />

      {/* CONTENT */}
      <div className="text-center max-w-4xl w-full flex flex-col items-center gap-6">

        {/* Trust Badge */}
        <div className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm text-white/60 backdrop-blur">
          Trusted by <span className="text-white font-semibold">1,000+ companies</span>
        </div>

        {/* Heading */}
        <h1 className="text-4xl md:text-6xl xl:text-7xl font-bold leading-tight tracking-tight">
          Find your next job
          <br />
          <span className="text-indigo-400">faster than ever.</span>
        </h1>

        {/* Subheading */}
        <p className="text-white/60 max-w-2xl text-base md:text-lg">
          Search thousands of verified jobs, connect with top companies, and
          accelerate your career — all in one place.
        </p>

        {/* 🔥 SEARCH BAR (MAIN FEATURE) */}
        <form
          action="/jobs"
          className="w-full mt-4 flex flex-col md:flex-row items-stretch gap-3 bg-white/5 border border-white/10 rounded-xl p-2 backdrop-blur"
        >
          {/* Job Input */}
          <div className="flex items-center gap-2 flex-1 px-3">
            <Search className="w-4 h-4 text-white/40" />
            <input
              type="text"
              name="q"
              placeholder="Job title or keyword"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-transparent outline-none text-sm text-white placeholder:text-white/40"
            />
          </div>

          {/* Location Input */}
          <div className="flex items-center gap-2 flex-1 px-3 border-t md:border-t-0 md:border-l border-white/10">
            <MapPin className="w-4 h-4 text-white/40" />
            <input
              type="text"
              name="location"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-transparent outline-none text-sm text-white placeholder:text-white/40"
            />
          </div>

          {/* Search Button */}
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-500 transition px-6 py-3 rounded-lg text-sm font-semibold"
          >
            Search Jobs
          </button>
        </form>

        {/* Secondary CTA */}
        <div className="flex gap-4 mt-3 flex-wrap justify-center">
          <a
            href="/post-job"
            className="text-sm text-white/70 hover:text-white underline underline-offset-4"
          >
            Are you hiring? Post a job →
          </a>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-10 mt-6">
          {STATS.map((item) => (
            <div key={item.label} className="text-center">
              <p className="text-2xl font-bold">{item.value}</p>
              <p className="text-xs text-white/50">{item.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Dashboard Preview */}
      <div className="relative w-[95%] md:w-[85%] mt-16 rounded-xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur">
        <Image
          src="/main.webp"
          alt="Browse jobs and manage applications dashboard"
          width={1600}
          height={900}
          priority
          className="w-full h-auto"
        />

        <div className="absolute bottom-0 inset-x-0 h-1/3 bg-gradient-to-t from-black/80 to-transparent" />
      </div>
    </section>
  );
};

export default HeroSection;