import Link from "next/link";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from "react-icons/fa";

const NAV_COLUMNS = [
    {
        heading: "Company",
        links: [
            { label: "About Us", href: "/about" },
            { label: "Careers", href: "/careers" },
            { label: "Blog", href: "/blog" },
            { label: "Press", href: "/press" },
            { label: "Site Map", href: "/sitemap" },
        ],
    },
    {
        heading: "Job Seekers",
        links: [
            { label: "Browse Jobs", href: "/jobs" },
            { label: "Companies", href: "/companies" },
            { label: "Salary Insights", href: "/salaries" },
            { label: "Career Advice", href: "/advice" },
            { label: "Resume Builder", href: "/resume" },
        ],
    },
    {
        heading: "Employers",
        links: [
            { label: "Post a Job", href: "/post-job" },
            { label: "Pricing", href: "/pricing" },
            { label: "Recruiter Login", href: "/recruiter" },
            { label: "Hiring Solutions", href: "/solutions" },
            { label: "Talent Search", href: "/talent" },
        ],
    },
    {
        heading: "Support",
        links: [
            { label: "Help Center", href: "/help" },
            { label: "Report an Issue", href: "/report" },
            { label: "Privacy Policy", href: "/privacy" },
            { label: "Terms & Conditions", href: "/terms" },
            { label: "Trust & Safety", href: "/trust" },
        ],
    },
];

const SOCIALS = [
    { icon: FaTwitter, label: "Twitter", href: "#" },
    { icon: FaLinkedinIn, label: "LinkedIn", href: "#" },
    { icon: FaFacebookF, label: "Facebook", href: "#" },
    { icon: FaInstagram, label: "Instagram", href: "#" },
];

const BADGES = ["50K+ Hires", "12K+ Companies", "4.9★ Rated"];

const Footer = () => {
    return (
        <footer className="relative w-full border-t border-white/[0.06] px-4 sm:px-6 lg:px-8 pt-14 pb-8 overflow-hidden">

            {/* Ambient glow */}
            <div className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[160px] bg-indigo-600/8 blur-[90px] rounded-full" />

            <div className="relative max-w-6xl mx-auto">

                {/* Top — brand + nav columns */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 mb-12">

                    {/* Brand col */}
                    <div className="lg:col-span-1">
                        <div className="flex items-center gap-2.5 mb-3">
                            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center flex-shrink-0">
                                <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                    <path d="M20 6h-2.18c.07-.44.18-.88.18-1.34C18 2.54 15.96.5 13.46.5c-1.48 0-2.67.74-3.46 1.87C9.21 1.24 8.02.5 6.54.5 4.04.5 2 2.54 2 4.66c0 .46.11.9.18 1.34H0v14h24V6h-4zm-6.54-3.5c1.31 0 2.54 1.2 2.54 2.16 0 .46-.19.88-.48 1.34h-4.12c-.29-.46-.48-.88-.48-1.34 0-.96 1.23-2.16 2.54-2.16zM4 4.66C4 3.7 5.23 2.5 6.54 2.5S9.08 3.7 9.08 4.66c0 .46-.19.88-.48 1.34H4.48C4.19 5.54 4 5.12 4 4.66z" />
                                </svg>
                            </div>
                            <span className="text-base font-bold text-white tracking-tight">Jobify</span>
                        </div>
                        <p className="text-sm text-zinc-500 leading-relaxed mb-5">
                            India's smartest job platform — connecting ambitious talent with companies that move fast.
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {BADGES.map((badge) => (
                                <span key={badge} className="inline-flex items-center rounded-full border border-white/[0.07] bg-white/[0.04] px-2.5 py-0.5 text-[11px] font-medium text-zinc-500">
                                    {badge}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Nav columns */}
                    <div className="lg:col-span-4 grid grid-cols-2 sm:grid-cols-4 gap-8">
                        {NAV_COLUMNS.map((col) => (
                            <div key={col.heading}>
                                <p className="text-[11px] font-semibold uppercase tracking-widest text-zinc-600 mb-4">
                                    {col.heading}
                                </p>
                                <ul className="space-y-2.5">
                                    {col.links.map((link) => (
                                        <li key={link.label}>
                                            <Link
                                                href={link.href}
                                                className="text-sm text-zinc-500 hover:text-zinc-200 transition-colors duration-200"
                                            >
                                                {link.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-white/[0.06] mb-6" />

                {/* Bottom bar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-zinc-600 order-2 sm:order-1">
                        © {new Date().getFullYear()} Jobify Technologies Pvt. Ltd. All rights reserved.
                    </p>
                    <div className="flex items-center gap-2 order-1 sm:order-2">
                        {SOCIALS.map(({ icon: Icon, label, href }) => (
                            <Link
                                key={label}
                                href={href}
                                aria-label={label}
                                className="w-8 h-8 rounded-lg border border-white/[0.07] bg-white/[0.04] flex items-center justify-center text-zinc-500 hover:text-white hover:border-white/20 hover:bg-white/[0.08] transition-all duration-200"
                            >
                                <Icon size={13} />
                            </Link>
                        ))}
                    </div>
                </div>

            </div>
        </footer>
    );
};

export default Footer;
