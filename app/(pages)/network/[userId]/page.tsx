"use client";

import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useSelector } from "react-redux";

import { getNetworkusers } from "@/actions/user/getNetworkusers";
import EmployeesSkeleton from "@/Skeletons/EmployeesSkeleton";
import NetworkUser from "../NetworkUser";

/* ────────────────────────────────────────────────
   Types
──────────────────────────────────────────────── */
interface AuthUser {
    id: number;
}

interface RootState {
    user: { user: AuthUser | null };
}

interface NetworkUserType {
    id: number;
    username: string;
    userImage?: string | null;
    profession?: string | null;
}

/* ────────────────────────────────────────────────
   Component
──────────────────────────────────────────────── */
const Network = () => {
    const params = useParams();
    const userId = Number(params?.userId);

    const currentUser = useSelector((state: RootState) => state.user.user);

    const [network, setNetwork] =
        useState<"followers" | "followings">("followers");

    const isCurrentUser = currentUser?.id === userId;


    const {
        data: users = [],
        isPending,
        isError,
        refetch,
    } = useQuery<NetworkUserType[]>({
        queryKey: ["networkUsers", userId, network],
        queryFn: async () => {
            const res = await getNetworkusers(userId, network);

            if (!res.success || !res.data) {
                throw new Error(res.error || "Failed to fetch network");
            }

            return res.data; // ✅ IMPORTANT FIX
        },
        enabled: !!userId,
        staleTime: 1000 * 60 * 2,
    });


    const handleTabChange = useCallback(
        (type: "followers" | "followings") => {
            setNetwork(type);
        },
        []
    );


    const description = isCurrentUser
        ? network === "followers"
            ? `${users.length} people are following you`
            : `You are following ${users.length} people`
        : network === "followers"
            ? `${users.length} people follow this user`
            : `This user follows ${users.length} people`;


    if (!userId) {
        return <div className="p-5 text-sm text-red-500">Invalid user ID</div>;
    }

    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center gap-3 p-10">
                <p className="text-red-500 text-sm">Failed to load network</p>
                <button
                    onClick={() => refetch()}
                    className="px-4 py-2 bg-black text-white text-xs rounded-md"
                >
                    Retry
                </button>
            </div>
        );
    }


    return (
        <div className="w-full px-4 py-6">
            <div className="rounded-2xl border bg-white shadow-sm overflow-hidden">

                {/* Tabs */}
                <div className="flex border-b text-sm font-medium">
                    {(["followers", "followings"] as const).map((type) => {
                        const active = network === type;

                        return (
                            <button
                                key={type}
                                onClick={() => handleTabChange(type)}
                                className={`flex-1 py-4 capitalize transition ${active
                                        ? "border-b-2 border-blue-600 text-blue-600"
                                        : "text-gray-500 hover:text-black"
                                    }`}
                            >
                                {type}
                            </button>
                        );
                    })}
                </div>

                {/* Description */}
                <div className="px-5 py-3 text-xs text-gray-500 border-b">
                    {description}
                </div>

                {/* List */}
                <div className="p-4 space-y-3 min-h-[200px]">
                    {isPending ? (
                        <EmployeesSkeleton count={6} />
                    ) : users.length === 0 ? (
                        <div className="text-center text-sm text-gray-400 py-10">
                            No {network} found
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {users.map((networkUser: NetworkUserType) => (
                                <NetworkUser
                                    key={networkUser.id}
                                    networkUser={networkUser}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Network;