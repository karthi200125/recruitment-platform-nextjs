"use client";

import { useQuery } from "@tanstack/react-query";
import { useCallback, useState } from "react";

import { getNetworkusers } from "@/actions/user/get-network-users";
import EmployeesSkeleton from "@/components/skeletons/EmployeesSkeleton";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import NetworkUser from "./NetworkUser";

interface NetworkUserType {
    id: number;
    username: string;
    userImage?: string | null;
    profession?: string | null;
}

interface NetworkClientProps {
    userId: number;
    initialUsers: NetworkUserType[];
}

const NetworkClient = ({
    userId,
    initialUsers,
}: NetworkClientProps) => {
    const { user: currentUser } =
        useCurrentUser();

    const [
        network,
        setNetwork,
    ] = useState<
        "followers" | "followings"
    >("followers");

    const isCurrentUser =
        currentUser?.id === userId;

    const {
        data: users = [],
        isPending,
        isError,
        refetch,
    } = useQuery<NetworkUserType[]>({
        queryKey: [
            "networkUsers",
            userId,
            network,
        ],

        queryFn: async () => {
            const result =
                await getNetworkusers(
                    userId,
                    network
                );

            if (
                !result.success ||
                !result.data
            ) {
                throw new Error(
                    result.error ??
                    "Failed to load network"
                );
            }

            return result.data;
        },

        initialData: initialUsers,

        staleTime: 1000 * 60 * 2,

        enabled: !!userId,
    });

    const handleTabChange =
        useCallback(
            (
                value:
                    | "followers"
                    | "followings"
            ) => {
                setNetwork(value);
            },
            []
        );

    const description =
        isCurrentUser
            ? network === "followers"
                ? `${users.length} people are following you`
                : `You are following ${users.length} people`
            : network === "followers"
                ? `${users.length} people follow this user`
                : `This user follows ${users.length} people`;

    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center gap-3 p-10">
                <p className="text-sm text-red-500">
                    Failed to load network
                </p>

                <button
                    onClick={() =>
                        refetch()
                    }
                    className="rounded-md bg-black px-4 py-2 text-xs text-white"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="w-full px-4 py-6">
            <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">

                <div className="flex border-b text-sm font-medium">
                    {(
                        [
                            "followers",
                            "followings",
                        ] as const
                    ).map((type) => {
                        const active =
                            network ===
                            type;

                        return (
                            <button
                                key={type}
                                onClick={() =>
                                    handleTabChange(
                                        type
                                    )
                                }
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

                <div className="border-b px-5 py-3 text-xs text-gray-500">
                    {description}
                </div>

                <div className="min-h-[200px] space-y-3 p-4">
                    {isPending ? (
                        <EmployeesSkeleton />
                    ) : users.length ===
                        0 ? (
                        <div className="py-10 text-center text-sm text-gray-400">
                            No {network} found
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            {users.map(
                                (
                                    networkUser
                                ) => (
                                    <NetworkUser
                                        key={
                                            networkUser.id
                                        }
                                        networkUser={
                                            networkUser
                                        }
                                    />
                                )
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NetworkClient;