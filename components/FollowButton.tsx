'use client';

import { toggleFollow } from "@/actions/user/toggleFollow";
import { isFollowing as checkIsFollowing } from "@/actions/user/isFollowing";

import { useOptimistic, useTransition } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import Button from "./Button";
import { useCurrentUser } from "@/hooks/useCurrentUser";

type ToggleFollowResponse = {
  isFollowing: boolean;
};

type FollowButtonProps = {
  targetUserId: number;
  initialIsFollowing?: boolean; // ✅ optional now
  className?: string;
};

export default function FollowButton({
  targetUserId,
  initialIsFollowing,
  className,
}: FollowButtonProps) {
  const { user } = useCurrentUser();
  const queryClient = useQueryClient();
  const [isPending, startTransition] = useTransition();

  const isSelf = user?.id === targetUserId;

  // ✅ fallback fetch ONLY if initial not provided
  const { data: fetchedIsFollowing } = useQuery({
    queryKey: ["isFollowing", user?.id, targetUserId],
    queryFn: () => checkIsFollowing(user!.id, targetUserId),
    enabled: initialIsFollowing === undefined && !!user?.id && !isSelf,
  });

  const baseState =
    initialIsFollowing ?? fetchedIsFollowing ?? false;

  const [optimisticIsFollowing, setOptimisticIsFollowing] =
    useOptimistic<boolean, boolean>(
      baseState,
      (_prev, next) => next
    );

  const handleToggle = () => {
    if (!user?.id || isSelf) return;

    const nextState = !optimisticIsFollowing;

    setOptimisticIsFollowing(nextState);

    startTransition(async () => {
      try {
        const res: ToggleFollowResponse =
          await toggleFollow(targetUserId);

        setOptimisticIsFollowing(res.isFollowing);

        // 🔥 update caches
        queryClient.invalidateQueries({
          queryKey: ["followStats", targetUserId],
        });

        queryClient.invalidateQueries({
          queryKey: ["isFollowing", user.id, targetUserId],
        });
      } catch (error) {
        console.error(error);
        setOptimisticIsFollowing(!nextState);
      }
    });
  };

  if (isSelf) return null;

  return (
    <Button
      variant={optimisticIsFollowing ? "default" : "border"}
    //   isLoading={isPending}
      onClick={handleToggle}
      disabled={isPending}
      className={`text-xs md:text-sm px-3 py-1 rounded-full ${
        className ?? ""
      } ${
        optimisticIsFollowing
          ? "bg-[var(--voilet)] text-white"
          : ""
      }`}
    >
      {optimisticIsFollowing ? "Following" : "Follow"}
    </Button>
  );
}