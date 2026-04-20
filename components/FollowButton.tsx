
"use client";

import { toggleFollow } from "@/actions/user/toggleFollow";
import { useOptimistic, useTransition } from "react";
import Button from "./Button";

type FollowButtonProps = {
    targetUserId: number;
    initialIsFollowing: boolean;
    className?: string;
};

export default function FollowButton({
    targetUserId,
    initialIsFollowing,
    className,
}: FollowButtonProps) {
    const [isPending, startTransition] = useTransition();

    const [optimisticIsFollowing, setOptimisticIsFollowing] =
        useOptimistic<boolean, boolean>(
            initialIsFollowing,
            (_prev, next) => next
        );

    const handleToggle = () => {
        const nextState = !optimisticIsFollowing;

        setOptimisticIsFollowing(nextState);

        startTransition(async () => {
            try {
                const res = await toggleFollow(targetUserId);
                setOptimisticIsFollowing(res.isFollowing);
            } catch {
                setOptimisticIsFollowing(!nextState);
            }
        });
    };

    return (
        <Button
            variant={optimisticIsFollowing ? "default" : "border"}
            // isLoading={isPending}
            onClick={handleToggle}
            disabled={isPending}
            className={`text-xs md:text-sm px-3 py-1 rounded-full ${optimisticIsFollowing ? "bg-[var(--voilet)] text-white" : ""}`}
        >
            {optimisticIsFollowing ? "Following" : "Follow"}
        </Button>
    );
}