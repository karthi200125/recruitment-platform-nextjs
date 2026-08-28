"use client";

import { ArrowLeft, Search, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import FollowButton from "@/components/FollowButton";
import { useCurrentUser } from "@/hooks/useCurrentUser";

interface NetworkUser {
    id: number;
    username: string;
    userImage?: string | null;
    profession?: string | null;
    isPro?: boolean;
    role?: string;
}

interface ProfileUser {
    id: number;
    username: string;
    userImage?: string | null;
    profileImage?: string | null;
}

interface NetworkClientProps {
    userId: number;
    profileUser: ProfileUser;
    initialFollowers: NetworkUser[];
    initialFollowing: NetworkUser[];
}

type Tab = "followers" | "following";

// ─── Single user card ─────────────────────────────────────────────────────────

function NetworkUserCard({ networkUser, currentUserId }: { networkUser: NetworkUser; currentUserId?: number }) {
    const isMe = networkUser.id === currentUserId;
    const initials = networkUser.username.slice(0, 2).toUpperCase();

    return (
        <div className="group flex items-center justify-between gap-3 p-4 rounded-2xl border border-slate-200 bg-white hover:border-indigo-200 hover:shadow-sm transition-all duration-200">

            {/* Avatar + info */}
            <div className="flex items-center gap-3 min-w-0 flex-1">
                <Link href={`/userProfile/${networkUser.id}`} className="flex-shrink-0">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden border border-slate-200 bg-slate-100">
                        {networkUser.userImage ? (
                            <Image
                                src={networkUser.userImage}
                                alt={networkUser.username}
                                fill
                                sizes="48px"
                                className="object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-indigo-50 flex items-center justify-center text-sm font-bold text-indigo-600">
                                {initials}
                            </div>
                        )}
                    </div>
                </Link>

                <div className="min-w-0">
                    <Link
                        href={`/userProfile/${networkUser.id}`}
                        className="block text-sm font-semibold text-slate-800 hover:text-indigo-600 transition-colors duration-150 truncate capitalize"
                    >
                        {networkUser.username}
                    </Link>
                    {networkUser.profession && (
                        <p className="text-xs text-slate-500 truncate mt-0.5">{networkUser.profession}</p>
                    )}
                    {networkUser.role && (
                        <span className="inline-flex items-center text-[10px] font-semibold text-slate-500 bg-slate-100 rounded-full px-2 py-0.5 mt-1 capitalize">
                            {networkUser.role.toLowerCase()}
                        </span>
                    )}
                </div>
            </div>

            {/* Follow button — only for others */}
            {!isMe && (
                <div className="flex-shrink-0">
                    <FollowButton
                        targetUserId={networkUser.id}
                    />
                </div>
            )}
        </div>
    );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState({ tab, isOwnProfile }: { tab: Tab; isOwnProfile: boolean }) {
    return (
        <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center">
                <Users className="w-7 h-7 text-slate-400" strokeWidth={1.5} />
            </div>
            <div>
                <p className="text-base font-semibold text-slate-700 mb-1">
                    {tab === "followers" ? "No followers yet" : "Not following anyone yet"}
                </p>
                <p className="text-sm text-slate-400 max-w-xs leading-relaxed">
                    {isOwnProfile
                        ? tab === "followers"
                            ? "Share your profile to gain followers and grow your network."
                            : "Follow recruiters and professionals to grow your network."
                        : tab === "followers"
                            ? "This user has no followers yet."
                            : "This user isn't following anyone yet."
                    }
                </p>
            </div>
        </div>
    );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function NetworkClient({
    userId,
    profileUser,
    initialFollowers,
    initialFollowing,
}: NetworkClientProps) {
    const { user: currentUser } = useCurrentUser();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<Tab>("followers");
    const [search, setSearch] = useState("");

    const isOwnProfile = currentUser?.id === userId;

    const activeList = activeTab === "followers" ? initialFollowers : initialFollowing;

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return activeList;
        return activeList.filter(
            (u) =>
                u.username.toLowerCase().includes(q) ||
                u.profession?.toLowerCase().includes(q)
        );
    }, [activeList, search]);

    const tabs = [
        { key: "followers" as Tab, label: "Followers", count: initialFollowers.length },
        { key: "following" as Tab, label: "Following", count: initialFollowing.length },
    ];

    return (
        <main className="w-full max-h-max py-6 overflow-hidden">
            <div className="w-full mx-auto space-y-6">

                {/* Back + profile header */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => router.push(`/userProfile/${userId}`)}
                        aria-label="Back to profile"
                        className="w-9 h-9 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-colors duration-200 flex-shrink-0"
                    >
                        <ArrowLeft className="w-4 h-4" strokeWidth={2} />
                    </button>

                    <div className="flex items-center gap-2.5 min-w-0">
                        <div className="relative w-9 h-9 rounded-full overflow-hidden border border-slate-200 bg-slate-100 flex-shrink-0">
                            {profileUser.userImage || profileUser.profileImage ? (
                                <Image
                                    src={(profileUser.userImage || profileUser.profileImage)!}
                                    alt={profileUser.username}
                                    fill
                                    sizes="36px"
                                    className="object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-indigo-50 flex items-center justify-center text-xs font-bold text-indigo-600">
                                    {profileUser.username.slice(0, 2).toUpperCase()}
                                </div>
                            )}
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm font-bold text-slate-800 capitalize truncate">
                                {profileUser.username}
                            </p>
                            <p className="text-xs text-slate-400">Network</p>
                        </div>
                    </div>
                </div>

                {/* Main card */}
                <div className="rounded-2xl border border-slate-200 bg-white overflow-y-scroll shadow-sm h-[calc(100vh-170px)]">

                    {/* Tab bar */}
                    <div className="flex items-center border-b border-slate-100 px-1">
                        {tabs.map(({ key, label, count }) => {
                            const isActive = activeTab === key;
                            return (
                                <button
                                    key={key}
                                    onClick={() => { setActiveTab(key); setSearch(""); }}
                                    className={`inline-flex items-center gap-2 px-5 py-4 text-sm font-semibold border-b-2 -mb-px transition-all duration-200 whitespace-nowrap ${isActive
                                        ? "border-indigo-600 text-indigo-600"
                                        : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                                        }`}
                                >
                                    {label}
                                    <span className={`text-[11px] font-bold rounded-full px-2 py-0.5 ${isActive ? "bg-indigo-100 text-indigo-700" : "bg-slate-100 text-slate-500"
                                        }`}>
                                        {count}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Search */}
                    <div className="px-4 pt-4 pb-2 max-w-2xl">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" strokeWidth={2} />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder={`Search ${activeTab}...`}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/30 transition-all duration-200"
                            />
                        </div>
                    </div>

                    {/* List */}
                    <div className="p-4">
                        {filtered.length === 0 ? (
                            search.trim() ? (
                                <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
                                    <p className="text-sm font-medium text-slate-500">No results for "{search}"</p>
                                    <p className="text-xs text-slate-400">Try a different name or profession.</p>
                                </div>
                            ) : (
                                <EmptyState tab={activeTab} isOwnProfile={isOwnProfile} />
                            )
                        ) : (
                            <div className="space-y-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                {filtered.map((user) => (
                                    <NetworkUserCard
                                        key={user.id}
                                        networkUser={user}
                                        currentUserId={currentUser?.id}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}