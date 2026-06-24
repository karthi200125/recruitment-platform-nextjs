import Link from 'next/link';

import {
    Facebook,
    Twitter,
    Linkedin,
    Instagram,
} from 'lucide-react';
import Logo from '@/components/Logo';

const NAV_COLUMNS = [
    {
        heading: 'Company',
        links: [
            {
                label: 'About',
                href: '/about',
            },
            {
                label: 'Careers',
                href: '/careers',
            },
            {
                label: 'Blog',
                href: '/blog',
            },
            {
                label: 'Press',
                href: '/press',
            },
        ],
    },

    {
        heading: 'Job Seekers',
        links: [
            {
                label: 'Browse Jobs',
                href: '/jobs',
            },
            {
                label: 'Companies',
                href: '/companies',
            },
            {
                label: 'Career Advice',
                href: '/advice',
            },
            {
                label: 'Resume Builder',
                href: '/resume',
            },
        ],
    },

    {
        heading: 'Employers',
        links: [
            {
                label: 'Post a Job',
                href: '/post-job',
            },
            {
                label: 'Pricing',
                href: '/pricing',
            },
            {
                label: 'Hiring Solutions',
                href: '/solutions',
            },
            {
                label: 'Talent Search',
                href: '/talent',
            },
        ],
    },

    {
        heading: 'Support',
        links: [
            {
                label: 'Help Center',
                href: '/help',
            },
            {
                label: 'Privacy',
                href: '/privacy',
            },
            {
                label: 'Terms',
                href: '/terms',
            },
            {
                label: 'Trust & Safety',
                href: '/trust',
            },
        ],
    },
];

const SOCIALS = [
    {
        icon: Twitter,
        label: 'Twitter',
        href: 'https://twitter.com',
    },

    {
        icon: Linkedin,
        label: 'LinkedIn',
        href: 'https://linkedin.com',
    },

    {
        icon: Facebook,
        label: 'Facebook',
        href: 'https://facebook.com',
    },

    {
        icon: Instagram,
        label: 'Instagram',
        href: 'https://instagram.com',
    },
];

export default function Footer() {
    return (
        <footer className="relative overflow-hidden border-t border-white/[0.04] py-20">
            {/* BACKGROUND */}
            <div className="absolute inset-0 -z-20 bg-black" />

            {/* AMBIENT GLOW */}
            <div className="absolute bottom-0 left-1/2 -z-10 h-[220px] w-[520px] -translate-x-1/2 rounded-full bg-indigo-500/[0.08] blur-[110px]" />

            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                {/* TOP */}
                <div className="grid grid-cols-1 gap-16 lg:grid-cols-[1.1fr_1.9fr]">

                    {/* BRAND */}
                    <div>

                        {/* LOGO */}
                        <Logo />

                        {/* DESCRIPTION */}
                        <p className="mt-6 max-w-sm text-sm leading-8 text-white/45">
                            Helping ambitious professionals discover
                            meaningful work and connect with companies
                            building the future.
                        </p>

                        {/* SOCIALS */}
                        <div className="mt-8 flex items-center gap-3">

                            {SOCIALS.map(
                                ({
                                    icon: Icon,
                                    label,
                                    href,
                                }) => (
                                    <a
                                        key={label}
                                        href={href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={label}
                                        className="
                                            flex h-10 w-10 items-center justify-center
                                            rounded-2xl
                                            bg-white/[0.03]
                                            text-white/40
                                            transition-all duration-300
                                            hover:bg-white/[0.06]
                                            hover:text-white/80
                                        "
                                    >
                                        <Icon
                                            className="h-4 w-4"
                                            strokeWidth={
                                                1.8
                                            }
                                        />
                                    </a>
                                )
                            )}
                        </div>
                    </div>

                    {/* NAVIGATION */}
                    <div className="grid grid-cols-2 gap-10 sm:grid-cols-4">

                        {NAV_COLUMNS.map(
                            (column) => (
                                <div
                                    key={
                                        column.heading
                                    }
                                >
                                    {/* HEADING */}
                                    <p className="text-xs font-medium uppercase tracking-[0.18em] text-white/30">
                                        {
                                            column.heading
                                        }
                                    </p>

                                    {/* LINKS */}
                                    <ul className="mt-5 space-y-3.5">

                                        {column.links.map(
                                            (
                                                link
                                            ) => (
                                                <li
                                                    key={
                                                        link.label
                                                    }
                                                >
                                                    <Link
                                                        href={
                                                            link.href
                                                        }
                                                        className="
                                                            text-sm text-white/45
                                                            transition-colors duration-300
                                                            hover:text-white/80
                                                        "
                                                    >
                                                        {
                                                            link.label
                                                        }
                                                    </Link>
                                                </li>
                                            )
                                        )}
                                    </ul>
                                </div>
                            )
                        )}
                    </div>
                </div>

                {/* DIVIDER */}
                <div className="mt-16 h-px bg-gradient-to-r from-transparent via-white/[0.05] to-transparent" />

                {/* BOTTOM */}
                <div className="mt-8 flex flex-col items-center justify-between gap-4 sm:flex-row">

                    {/* COPYRIGHT */}
                    <p className="text-xs text-white/30">
                        ©{' '}
                        {new Date().getFullYear()}{' '}
                        Jobify Technologies Pvt. Ltd.
                        All rights reserved.
                    </p>

                    {/* LEGAL LINKS */}
                    <div className="flex items-center gap-5 text-xs text-white/30">

                        <Link
                            href="/privacy"
                            className="transition-colors duration-300 hover:text-white/60"
                        >
                            Privacy
                        </Link>

                        <Link
                            href="/terms"
                            className="transition-colors duration-300 hover:text-white/60"
                        >
                            Terms
                        </Link>

                        <Link
                            href="/cookies"
                            className="transition-colors duration-300 hover:text-white/60"
                        >
                            Cookies
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}