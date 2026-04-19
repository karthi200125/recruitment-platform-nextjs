'use client';

import { useState } from "react";
import { Mail, Sparkles, ArrowRight } from "lucide-react";

const PERKS = [
  "Personalized job alerts",
  "Weekly career tips",
  "Exclusive early access",
  "No spam, ever",
];

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }

    try {
      setStatus("loading");
      await new Promise((resolve) => setTimeout(resolve, 1200));
      setStatus("success");
      setMessage("You're in! Check your inbox for a confirmation.");
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <section
      aria-labelledby="newsletter-heading"
      className="relative w-full bg-[#09090b] py-20 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0 flex justify-center items-center">
        <div className="w-[700px] h-[300px] rounded-full bg-indigo-600/10 blur-[110px]" />
      </div>

      <div className="relative max-w-6xl mx-auto">
        <div className="rounded-2xl border border-white/[0.07] bg-zinc-900/40 overflow-hidden">

          {/* Top accent line */}
          <div className="h-px w-full bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />

          <div className="px-6 py-12 sm:px-12 lg:px-16 flex flex-col lg:flex-row items-center gap-12">

            {/* Left — copy */}
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/25 bg-indigo-500/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-widest text-indigo-300 mb-5">
                <Sparkles className="w-3 h-3" />
                Job alerts
              </div>

              <h2
                id="newsletter-heading"
                className="text-3xl sm:text-4xl font-bold tracking-tight text-white leading-[1.1] mb-4"
              >
                The right job,{" "}
                <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                  delivered to you
                </span>
              </h2>

              <p className="text-zinc-400 text-base leading-relaxed max-w-sm mx-auto lg:mx-0 mb-8">
                Subscribe to get personalized job alerts and career tips matched exactly to your skills and goals.
              </p>

              {/* Perks */}
              <ul className="flex flex-wrap justify-center lg:justify-start gap-x-6 gap-y-2">
                {PERKS.map((perk) => (
                  <li key={perk} className="flex items-center gap-2 text-sm text-zinc-500">
                    <span className="w-1 h-1 rounded-full bg-indigo-500 flex-shrink-0" />
                    {perk}
                  </li>
                ))}
              </ul>
            </div>

            {/* Right — form */}
            <div className="w-full lg:max-w-sm flex-shrink-0">
              {status === "success" ? (
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-6 py-8 text-center">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/15 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  </div>
                  <p className="text-base font-semibold text-white mb-1">You're subscribed!</p>
                  <p className="text-sm text-zinc-400">{message}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate>
                  <div className="rounded-xl border border-white/[0.07] bg-white/[0.03] p-1.5 flex flex-col sm:flex-row gap-2 mb-3">
                    <div className="relative flex-1">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 pointer-events-none" />
                      <input
                        type="email"
                        placeholder="your@email.com"
                        aria-label="Email address"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (status === "error") setStatus("idle");
                        }}
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-transparent text-sm text-white placeholder-zinc-600 outline-none focus:ring-1 focus:ring-indigo-500/40 transition-all duration-200"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={status === "loading"}
                      className="flex-shrink-0 inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                      {status === "loading" ? (
                        <>
                          <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          Subscribing
                        </>
                      ) : (
                        <>
                          Subscribe
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>

                  {/* Error */}
                  {status === "error" && message && (
                    <p className="text-xs text-red-400 px-1">{message}</p>
                  )}

                  <p className="text-xs text-zinc-600 px-1 mt-2">
                    By subscribing you agree to our{" "}
                    <a href="/privacy" className="text-zinc-500 hover:text-zinc-300 underline underline-offset-2 transition-colors">
                      Privacy Policy
                    </a>
                    . Unsubscribe at any time.
                  </p>
                </form>
              )}

              {/* Social proof */}
              <div className="flex items-center gap-3 mt-5">
                <div className="flex -space-x-2">
                  {["IK", "PS", "RV", "AM"].map((initials, i) => (
                    <div
                      key={i}
                      className="w-7 h-7 rounded-full border-2 border-zinc-900 bg-indigo-500/20 flex items-center justify-center text-[9px] font-semibold text-indigo-300"
                    >
                      {initials}
                    </div>
                  ))}
                </div>
                <p className="text-xs text-zinc-500">
                  <span className="text-zinc-300 font-medium">8,000+</span> subscribers already
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;