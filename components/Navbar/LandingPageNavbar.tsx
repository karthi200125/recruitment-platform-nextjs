"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
    COMPANIES_MEGA_MENU_FOOTER,
    COMPANIES_NAVIGATION,
    JOBS_MEGA_MENU_FOOTER,
    JOBS_NAVIGATION,
    RESOURCES_MEGA_MENU_FOOTER,
    RESOURCES_NAVIGATION,
} from "@/lib/data/navigation-data";

import Logo from "../Logo";
import AuthButtons from "./AuthButtons";
import MegaMenu from "./MegaMenu";

const LpNavbar = () => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <header
            className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${scrolled ? "pt-3" : "pt-0"
                }`}
        >
            <div
                className={`mx-auto flex h-[72px] w-[95%] max-w-7xl items-center justify-between rounded-2xl px-2 transition-all duration-500 ${scrolled
                    ? "bg-black/60 backdrop-blur-xl supports-[backdrop-filter]:bg-black/50"
                    : "bg-transparent"
                    }`}
            >
                {/* LEFT — Navigation */}
                <nav className="hidden items-center gap-1 md:flex">
                    <MegaMenu
                        label="Jobs"
                        menu={JOBS_NAVIGATION}
                        footer={JOBS_MEGA_MENU_FOOTER}
                    />

                    <MegaMenu
                        label="Companies"
                        menu={COMPANIES_NAVIGATION}
                        footer={COMPANIES_MEGA_MENU_FOOTER}
                    />

                    <MegaMenu
                        label="Resources"
                        menu={RESOURCES_NAVIGATION}
                        footer={RESOURCES_MEGA_MENU_FOOTER}
                    />

                    <Link
                        href="/subscriptions"
                        className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-300 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                    >
                        Pricing
                    </Link>

                </nav>

                {/* CENTER — Logo */}
                <div className="md:absolute md:left-1/2 md:-translate-x-1/2">
                    <Logo />
                </div>

                {/* RIGHT — Authentication */}
                <AuthButtons />
            </div>
        </header>
    );
};

export default LpNavbar;