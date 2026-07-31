
import { ArrowLeft, Briefcase } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import AuthLeftSide from "../AuthLeftSide";
import SigninRightSide from "./SignInRightSide";

export const metadata: Metadata = {
  title: "Sign In",

  description:
    "Sign in to your Jobify account to manage applications, connect with recruiters, and continue your job search.",

  keywords: [
    "Jobify login",
    "Sign In",
    "Job Portal Login",
    "Candidate Login",
    "Recruiter Login",
  ],

  robots: {
    index: false,
    follow: false,
  },

  alternates: {
    canonical: "/signin",
  },

  openGraph: {
    title: "Sign In | Jobify",
    description:
      "Sign in to your Jobify account to continue your hiring or job search journey.",
    url: "/signin",
  },

  twitter: {
    title: "Sign In | Jobify",
    description:
      "Sign in to your Jobify account to continue your hiring or job search journey.",
  },
};

const LoginPage = () => {
  return (
    <main className="w-full min-h-screen flex bg-[#09090b]">


      {/* Left — decorative panel */}
      <section className="hidden lg:flex lg:w-[45%] xl:w-[40%] min-h-screen bg-zinc-900/50 border-r border-white/[0.06]">
        <AuthLeftSide />
      </section>

      {/* Right — form panel */}
      <section className="relative flex-1 flex items-center justify-center px-4 sm:px-8 min-h-screen overflow-y-auto">

        {/* Back button */}
        <Link
          href="/"
          aria-label="Go back to homepage"
          className="absolute top-6 left-6 inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-200 border border-white/[0.07] hover:border-white/20 bg-white/[0.03] hover:bg-white/[0.07] rounded-lg px-3 py-2 transition-all duration-200"
        >
          <ArrowLeft className="w-4 h-4" />
          Home
        </Link>

        {/* Mobile logo */}
        <div className="lg:hidden absolute top-6 right-6 flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
            <Briefcase className="w-3.5 h-3.5 text-white" strokeWidth={2} />
          </div>
          <span className="text-sm font-bold text-white">Jobify</span>
        </div>

        {/* Glow background */}
        <div className="pointer-events-none absolute inset-0 flex justify-center items-center">
          <div className="w-[400px] h-[400px] rounded-full bg-indigo-600/5 blur-[100px]" />
        </div>

        {/* Form container */}
        <div className="relative w-full max-w-sm">
          {/* ✅ Client component stays interactive */}
          <SigninRightSide />
        </div>

      </section>
    </main>
  );
};

export default LoginPage;