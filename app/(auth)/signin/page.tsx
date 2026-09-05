import { ArrowLeft, Briefcase } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import AuthLeftSide from "../AuthLeftSide";
import SigninRightSide from "./SignInRightSide";

export const metadata: Metadata = {
  title: "Sign In | Jobify",

  description:
    "Sign in to Jobify to manage your job applications, connect with recruiters, discover opportunities, and manage your professional profile.",

  robots: {
    index: false,
    follow: false,
    noarchive: true,
    nosnippet: true,
    noimageindex: true,
    googleBot: {
      index: false,
      follow: false,
      noarchive: true,
      nosnippet: true,
      noimageindex: true,
    },
  },

  alternates: {
    canonical: "/signin",
  },

  openGraph: {
    type: "website",
    title: "Sign In | Jobify",
    description:
      "Sign in to Jobify to manage your job applications, connect with recruiters, and continue your professional journey.",
    url: "/signin",
    siteName: "Jobify",
  },

  twitter: {
    card: "summary",
    title: "Sign In | Jobify",
    description:
      "Sign in to Jobify to manage your job applications, connect with recruiters, and continue your professional journey.",
  },

  category: "jobs",

  applicationName: "Jobify",

  referrer: "strict-origin-when-cross-origin",

  other: {
    "format-detection": "telephone=no",
  },
};

const LoginPage = () => {
  return (
    <main className="flex min-h-screen w-full bg-[#09090b]">
      {/* Left — decorative panel */}
      <section className="hidden min-h-screen border-r border-white/[0.06] bg-zinc-900/50 lg:flex lg:w-[45%] xl:w-[40%]">
        <AuthLeftSide />
      </section>

      {/* Right — form panel */}
      <section className="relative flex min-h-screen flex-1 items-center justify-center overflow-y-auto px-4 sm:px-8">

        {/* Back button */}
        <Link
          href="/"
          aria-label="Return to Jobify homepage"
          className="absolute left-6 top-6 inline-flex items-center gap-2 rounded-lg border border-white/[0.07] bg-white/[0.03] px-3 py-2 text-sm text-zinc-500 transition-all duration-200 hover:border-white/20 hover:bg-white/[0.07] hover:text-zinc-200"
        >
          <ArrowLeft
            className="h-4 w-4"
            aria-hidden="true"
          />
          Home
        </Link>

        {/* Mobile logo */}
        <div
          className="absolute right-6 top-6 flex items-center gap-2 lg:hidden"
          aria-label="Jobify"
        >
          <div
            className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600"
            aria-hidden="true"
          >
            <Briefcase
              className="h-3.5 w-3.5 text-white"
              strokeWidth={2}
            />
          </div>

          <span className="text-sm font-bold text-white">
            Jobify
          </span>
        </div>

        {/* Background decoration */}
        <div
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
          aria-hidden="true"
        >
          <div className="h-[400px] w-[400px] rounded-full bg-indigo-600/5 blur-[100px]" />
        </div>

        {/* Authentication form */}
        <div className="relative w-full max-w-sm">
          <SigninRightSide />
        </div>
      </section>
    </main>
  );
};

export default LoginPage;