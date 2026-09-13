"use client";

import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card";

import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useMemo } from "react";

import {
    ChevronRight,
    Crown,
} from "lucide-react";

import { SessionUser } from "@/types";
import { getProfileMenuItems } from "./profile-menu-items";

interface NavItem {
    id: number;
    title: string;
    icon: React.ElementType;
    href: string;
    visible: boolean;
    danger?: boolean;
}

interface UserProfileCardProps {
    user: SessionUser | null;
}

const UserProfileCard = ({
    user,
}: UserProfileCardProps) => {
    const pathname = usePathname();

    const items = getProfileMenuItems(user);

    const basePath = useMemo(() => {
        return pathname.startsWith("/userProfile")
            ? pathname.split("/").slice(0, 3).join("/")
            : pathname.split("/").slice(0, 2).join("/");
    }, [pathname]);

    const handleSignOut = useCallback(async () => {
        await signOut({
            callbackUrl: "/signin",
        });
    }, []);

    if (!user) {
        return null;
    }

    const mainItems = items.filter(
        (item) => item.visible && !item.danger
    );

    const dangerItems = items.filter(
        (item) => item.visible && item.danger
    );

    const ROLE_LABEL: Record<string, string> = {
        CANDIDATE: "Job Seeker",
        RECRUITER: "Recruiter",
        ORGANIZATION: "Organization",
    };

    return (
        <HoverCard
            openDelay={80}
            closeDelay={120}
        >
            {/* Avatar / Profile link */}
            <HoverCardTrigger asChild>
                <Link
                    href={`/userProfile/${user.id}`}
                    aria-label="Open profile"
                    className="relative flex h-9 w-9 flex-shrink-0 rounded-full ring-2 ring-transparent transition-all duration-200 hover:ring-indigo-400 focus-visible:outline-none focus-visible:ring-indigo-400"
                >
                    <Image
                        src={
                            user.profileImage ||
                            "/noProfile.webp"
                        }
                        alt={
                            user.username ||
                            "Profile"
                        }
                        fill
                        sizes="36px"
                        className="rounded-full object-cover"
                    />
                </Link>
            </HoverCardTrigger>

            {/* Dropdown panel */}
            <HoverCardContent
                align="end"
                sideOffset={10}
                className="w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white p-0 shadow-xl"
            >
                {/* User header */}
                <div className="flex items-center gap-3 border-b border-slate-100 bg-slate-50/70 px-4 py-4">
                    <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-full border border-slate-200">
                        <Image
                            src={
                                user.profileImage ||
                                "/noProfile.webp"
                            }
                            alt={
                                user.username ||
                                "Profile"
                            }
                            fill
                            sizes="48px"
                            className="rounded-full object-cover"
                        />
                    </div>

                    <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold capitalize leading-snug text-slate-800">
                            {user.username}
                        </p>

                        <p className="truncate text-xs text-slate-400">
                            {user.role}
                        </p>

                        <div className="mt-1 flex flex-wrap items-center gap-1.5">
                            <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-500">
                                {ROLE_LABEL[user.role ?? ""] ??
                                    user.role}
                            </span>

                            {user.isPro && (
                                <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[11px] font-bold text-amber-600">
                                    <Crown
                                        className="h-2.5 w-2.5"
                                        strokeWidth={2.5}
                                    />
                                    Pro
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Navigation items */}
                <nav className="py-1.5">
                    {mainItems.map((item) => {
                        const Icon = item.icon;
                        const isActive =
                            basePath === item.href;

                        return (
                            <Link
                                key={item.id}
                                href={item.href}
                                className={`flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors duration-150 ${isActive
                                    ? "bg-indigo-50 text-indigo-700"
                                    : "text-slate-700 hover:bg-slate-50"
                                    }`}
                            >
                                <Icon
                                    className={`h-4 w-4 flex-shrink-0 ${isActive
                                        ? "text-indigo-500"
                                        : "text-slate-400"
                                        }`}
                                    strokeWidth={
                                        isActive
                                            ? 2.5
                                            : 1.75
                                    }
                                />

                                <span
                                    className={`flex-1 text-sm ${isActive
                                        ? "font-semibold"
                                        : "font-medium"
                                        }`}
                                >
                                    {item.title}
                                </span>

                                {isActive && (
                                    <ChevronRight
                                        className="h-3.5 w-3.5 flex-shrink-0 text-indigo-400"
                                        strokeWidth={2.5}
                                    />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Sign out */}
                <div className="border-t border-slate-100 py-1.5">
                    {dangerItems.map((item) => {
                        const Icon = item.icon;

                        return (
                            <button
                                key={item.id}
                                type="button"
                                onClick={handleSignOut}
                                className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm font-medium text-red-500 transition-colors duration-150 hover:bg-red-50"
                            >
                                <Icon
                                    className="h-4 w-4 flex-shrink-0"
                                    strokeWidth={1.75}
                                />

                                {item.title}
                            </button>
                        );
                    })}
                </div>
            </HoverCardContent>
        </HoverCard>
    );
};

export default UserProfileCard;