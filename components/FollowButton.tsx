"use client";

import { useTransition } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { toggleFollow } from "@/actions/user/toggleFollow";
import { isFollowing } from "@/actions/user/isFollowing";
import { useCurrentUser } from "@/hooks/useCurrentUser";

import Button from "./Button";

type FollowButtonProps = {
  targetUserId: number;
  className?: string;
};

export default function FollowButton({
  targetUserId,
  className,
}: FollowButtonProps) {
  const { user } = useCurrentUser();
  const queryClient = useQueryClient();
  const [isPending, startTransition] = useTransition();

  const isSelf = user?.id === targetUserId;

  // ✅ Fetch follow state (like saved jobs)
  const { data: isFollowed } = useQuery({
    queryKey: ["isFollowing", user?.id, targetUserId],
    queryFn: () => isFollowing(user!.id, targetUserId),
    enabled: !!user?.id && !isSelf,
  });

  // ✅ Mutation with optimistic update
  const mutation = useMutation({
    mutationFn: () => toggleFollow(targetUserId),

    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: ["isFollowing", user?.id, targetUserId],
      });

      const previous = queryClient.getQueryData<boolean>([
        "isFollowing",
        user?.id,
        targetUserId,
      ]);

      // optimistic toggle
      queryClient.setQueryData(
        ["isFollowing", user?.id, targetUserId],
        !previous
      );

      return { previous };
    },

    onError: (_err, _vars, context) => {
      if (context?.previous !== undefined) {
        queryClient.setQueryData(
          ["isFollowing", user?.id, targetUserId],
          context.previous
        );
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["isFollowing", user?.id, targetUserId],
      });

      queryClient.invalidateQueries({
        queryKey: ["followStats", targetUserId],
      });
    },
  });

  const handleClick = () => {
    if (!user?.id || isSelf) return;

    startTransition(() => {
      mutation.mutate();
    });
  };

  if (isSelf) return null;

  return (
    <Button
      onClick={handleClick}
      disabled={isPending}
      className={`text-xs md:text-sm px-3 py-1 rounded-full ${className ?? ""
        } ${isFollowed
          ? "bg-[var(--voilet)] text-white"
          : "border"
        }`}
    >
      {isFollowed ? "Following" : "Follow"}
    </Button>
  );
}