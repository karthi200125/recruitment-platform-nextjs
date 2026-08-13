"use client";

import { motion } from "framer-motion";
import { ArrowRight, ChevronDown, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import type {
    MegaMenuConfig,
} from "@/lib/data/navigation-data";

interface MegaMenuFooter {
    left: {
        title: string;
        description: string;
        href: string;
        icon: LucideIcon;
    };
    right: {
        title: string;
        href: string;
        icon: LucideIcon;
    };
}

interface MegaMenuProps {
    label: string;
    menu: MegaMenuConfig;
    footer: MegaMenuFooter;
}

const CLOSE_GRACE_MS = 150;

const MegaMenu = ({
    label,
    menu,
    footer,
}: MegaMenuProps) => {
    const [open, setOpen] = useState(false);

    const pathname = usePathname();

    const closeTimeoutRef =
        useRef<ReturnType<typeof setTimeout> | null>(null);

    const cancelClose = useCallback(() => {
        if (closeTimeoutRef.current) {
            clearTimeout(closeTimeoutRef.current);
            closeTimeoutRef.current = null;
        }
    }, []);

    const scheduleClose = useCallback(() => {
        cancelClose();

        closeTimeoutRef.current = setTimeout(() => {
            setOpen(false);
        }, CLOSE_GRACE_MS);
    }, [cancelClose]);

    const handleMouseEnter = useCallback(() => {
        cancelClose();
        setOpen(true);
    }, [cancelClose]);

    useEffect(() => {
        setOpen(false);
    }, [pathname]);

    useEffect(() => {
        return () => {
            cancelClose();
        };
    }, [cancelClose]);

    const LeftIcon = footer.left.icon;
    const RightIcon = footer.right.icon;

    return (
        <div
            className="relative hidden lg:block"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={scheduleClose}
        >
            {/* Trigger */}

            <button
                type="button"
                onClick={() => setOpen((previous) => !previous)}
                aria-haspopup="true"
                aria-expanded={open}
                className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-zinc-300 outline-none transition-colors duration-150 hover:text-white focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
                {label}

                <ChevronDown
                    className={`h-3.5 w-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""
                        }`}
                    strokeWidth={2.5}
                />
            </button>

            {/* Mega menu */}

            {open && (
                <div
                    className="absolute left-1/2 top-full z-50 -translate-x-1/2 pt-3"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={scheduleClose}
                >
                    <motion.div
                        initial={{
                            opacity: 0,
                            y: -6,
                            scale: 0.98,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                            scale: 1,
                        }}
                        transition={{
                            duration: 0.16,
                            ease: "easeOut",
                        }}
                        className="w-[820px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-white/10 bg-[#0d0d0f] shadow-2xl shadow-black/50"
                    >
                        {/* Header */}

                        <div className="px-8 pt-7">
                            <h2 className="text-lg font-semibold text-white">
                                {menu.title}
                            </h2>

                            <p className="mt-1 text-sm text-zinc-400">
                                {menu.description}
                            </p>
                        </div>

                        {/* Items */}

                        <div className="grid grid-cols-2 gap-x-6 gap-y-2 px-7 py-6">
                            {menu.items.map((item) => {
                                const ItemIcon = item.icon;

                                return (
                                    <Link
                                        key={item.title}
                                        href={item.href}
                                        className="group flex items-start gap-3 rounded-xl p-3 transition-colors duration-150 hover:bg-white/[0.05]"
                                    >
                                        {/* Icon */}

                                        <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-400 transition-colors duration-150 group-hover:bg-indigo-500/20">
                                            <ItemIcon
                                                className="h-[18px] w-[18px]"
                                                strokeWidth={1.75}
                                            />
                                        </span>

                                        {/* Content */}

                                        <span className="min-w-0">
                                            <span className="block text-[15px] font-semibold text-white transition-colors duration-150 group-hover:text-indigo-400">
                                                {item.title}
                                            </span>

                                            <span className="mt-0.5 block text-[13px] leading-snug text-zinc-400">
                                                {item.description}
                                            </span>
                                        </span>
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Footer */}

                        <div className="flex items-center justify-between gap-4 border-t border-white/10 bg-white/[0.02] px-8 py-4">
                            {/* Left action */}

                            <Link
                                href={footer.left.href}
                                className="group flex items-center gap-2 text-sm font-medium text-zinc-300 transition-colors duration-150 hover:text-white"
                            >
                                <span className="flex h-7 w-7 items-center justify-center rounded-full border border-white/10 transition-colors duration-150 group-hover:border-white/20">
                                    <LeftIcon
                                        className="h-3.5 w-3.5"
                                        strokeWidth={2}
                                    />
                                </span>

                                {footer.left.title}
                            </Link>

                            {/* Right action */}

                            <Link
                                href={footer.right.href}
                                className="group flex items-center gap-1.5 text-sm font-semibold text-indigo-400 transition-colors duration-150 hover:text-indigo-300"
                            >
                                {footer.right.title}

                                <ArrowRight
                                    className="h-3.5 w-3.5 transition-transform duration-150 group-hover:translate-x-0.5"
                                    strokeWidth={2.25}
                                />
                            </Link>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default MegaMenu;