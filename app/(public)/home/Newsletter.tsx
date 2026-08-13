'use client';

import Link from 'next/link';
import { useState } from 'react';

import {
  ArrowRight,
  Mail,
} from 'lucide-react';
import Image from 'next/image';
import AvatarGroup from '@/components/AvatarGroup';

const PERKS = [
  'Personalized job alerts',
  'Weekly career insights',
  'Early access to new roles',
  'No spam — ever',
];

type FormStatus =
  | 'idle'
  | 'loading'
  | 'success'
  | 'error';

const validateEmail = (
  email: string
) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    email
  );

export default function Newsletter() {
  const [email, setEmail] =
    useState('');

  const [formState, setFormState] =
    useState<{
      status: FormStatus;
      message: string;
    }>({
      status: 'idle',
      message: '',
    });

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setFormState({
        status: 'error',
        message:
          'Please enter a valid email address.',
      });

      return;
    }

    try {
      setFormState({
        status: 'loading',
        message: '',
      });

      // TODO:
      // Replace with actual API/server action
      await new Promise((resolve) =>
        setTimeout(resolve, 1200)
      );

      setFormState({
        status: 'success',
        message:
          "You're subscribed successfully.",
      });

      setEmail('');
    } catch {
      setFormState({
        status: 'error',
        message:
          'Something went wrong. Please try again.',
      });
    }
  };

  const isLoading =
    formState.status === 'loading';

  const isSuccess =
    formState.status === 'success';

  const isError =
    formState.status === 'error';

  return (
    <section
      aria-labelledby="newsletter-heading"
      className="relative overflow-hidden py-28"
    >
      {/* BACKGROUND */}
      <div className="absolute inset-0 -z-20 bg-black" />

      {/* TOP GLOW */}
      <div className="absolute inset-x-0 top-0 -z-10 h-[320px] bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.14),transparent_72%)]" />

      {/* SIDE GLOW */}
      <div className="absolute left-1/2 top-1/2 -z-10 h-[340px] w-[340px] -translate-x-1/2 rounded-full bg-indigo-500/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* CONTAINER */}
        <div className="relative overflow-hidden rounded-[36px] border border-white/[0.06] bg-white/[0.025] px-6 py-14 backdrop-blur-2xl sm:px-10 lg:px-14">

          {/* SOFT INNER GLOW */}
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-indigo-500/[0.04] via-transparent to-transparent" />

          <div className="grid grid-cols-1 gap-14 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">

            {/* LEFT */}
            <div>

              {/* EYEBROW */}
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-5 py-2 backdrop-blur-xl">
                <div className="h-2 w-2 rounded-full bg-indigo-400" />

                <span className="text-xs font-medium uppercase tracking-[0.18em] text-white/60">
                  Career updates
                </span>
              </div>

              {/* HEADING */}
              <h2
                id="newsletter-heading"
                className="max-w-2xl text-4xl font-semibold leading-[1.05] tracking-[-0.03em] text-white sm:text-5xl lg:text-6xl"
              >
                The right opportunity,
                <span className="block bg-gradient-to-r from-indigo-400 via-violet-400 to-blue-400 bg-clip-text text-transparent">
                  delivered to you
                </span>
              </h2>

              {/* DESCRIPTION */}
              <p className="mt-6 max-w-xl text-base leading-8 text-white/60 sm:text-lg">
                Get personalized job alerts, hiring insights,
                and career opportunities curated specifically
                for your goals and experience.
              </p>

              {/* PERKS */}
              <div className="mt-10 flex flex-wrap gap-x-8 gap-y-4">
                {PERKS.map((perk) => (
                  <div
                    key={perk}
                    className="flex items-center gap-3"
                  >
                    <div className="h-1.5 w-1.5 rounded-full bg-indigo-400" />

                    <span className="text-sm text-white/45">
                      {perk}
                    </span>
                  </div>
                ))}
              </div>

              {/* SOCIAL PROOF */}
              <div className="mt-12 flex flex-wrap items-center gap-4">

                {/* AVATARS */}
                <AvatarGroup />

                <p className="text-sm text-white/45">
                  Joined by{' '}
                  <span className="font-medium text-white">
                    8,000+
                  </span>{' '}
                  professionals already.
                </p>
              </div>
            </div>

            {/* RIGHT */}
            <div className="relative">

              {/* FORM PANEL */}
              <div className="rounded-[32px] border border-white/[0.06] bg-white/[0.03] p-6 backdrop-blur-xl sm:p-8">

                {isSuccess ? (
                  <div className="flex flex-col items-center py-8 text-center">

                    {/* SUCCESS ICON */}
                    <div className="flex h-14 w-14 items-center justify-center rounded-full border border-emerald-500/15 bg-emerald-500/10">
                      <svg
                        className="h-6 w-6 text-emerald-300"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    </div>

                    {/* SUCCESS TEXT */}
                    <h3 className="mt-6 text-2xl font-semibold tracking-tight text-white">
                      You&apos;re subscribed
                    </h3>

                    <p className="mt-3 max-w-sm text-sm leading-7 text-white/50">
                      {formState.message}
                    </p>
                  </div>
                ) : (
                  <>
                    {/* PANEL HEADING */}
                    <div>
                      <h3 className="text-2xl font-semibold tracking-tight text-white">
                        Stay ahead in your career
                      </h3>

                      <p className="mt-3 text-sm leading-7 text-white/50">
                        Weekly curated opportunities,
                        career tips, and hiring updates.
                      </p>
                    </div>

                    {/* FORM */}
                    <form
                      onSubmit={handleSubmit}
                      noValidate
                      className="mt-8"
                    >
                      <div className="space-y-4">

                        {/* INPUT */}
                        <div className="relative">
                          <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/25" />

                          <input
                            type="email"
                            aria-label="Email address"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => {
                              setEmail(
                                e.target.value
                              );

                              if (
                                isError
                              ) {
                                setFormState({
                                  status:
                                    'idle',
                                  message:
                                    '',
                                });
                              }
                            }}
                            className="
                                                            h-14 w-full rounded-2xl
                                                            border border-white/[0.06]
                                                            bg-white/[0.03]
                                                            pl-12 pr-4
                                                            text-sm text-white
                                                            placeholder:text-white/25
                                                            outline-none
                                                            transition-all duration-300
                                                            focus:border-indigo-500/20
                                                            focus:bg-white/[0.05]
                                                        "
                          />
                        </div>

                        {/* ERROR */}
                        {isError &&
                          formState.message && (
                            <p className="px-1 text-xs text-red-400">
                              {
                                formState.message
                              }
                            </p>
                          )}

                        {/* BUTTON */}
                        <button
                          type="submit"
                          disabled={isLoading}
                          className="
                                                        inline-flex h-14 w-full items-center justify-center gap-2
                                                        rounded-2xl
                                                        bg-white
                                                        px-6
                                                        text-sm font-medium text-black
                                                        transition-all duration-300
                                                        hover:bg-white/90
                                                        disabled:cursor-not-allowed
                                                        disabled:opacity-60
                                                    "
                        >
                          {isLoading ? (
                            <span className="flex items-center gap-2">
                              <span className="h-2 w-2 rounded-full bg-black/60" />

                              Subscribing...
                            </span>
                          ) : (
                            <>
                              Subscribe now

                              <ArrowRight className="h-4 w-4" />
                            </>
                          )}
                        </button>
                      </div>

                      {/* PRIVACY */}
                      <p className="mt-5 px-1 text-xs leading-6 text-white/30">
                        By subscribing you agree to our{' '}

                        <Link
                          href="/privacy"
                          className="text-white/40 underline underline-offset-4 transition-colors hover:text-white/60"
                        >
                          Privacy Policy
                        </Link>

                        . Unsubscribe anytime.
                      </p>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}