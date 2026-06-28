"use client";

import { useTransition } from "react";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { isFollowing } from "@/actions/user/isFollowing";
import { toggleFollow } from "@/actions/user/toggle-follow";
import { useCurrentUser } from "@/hooks/useCurrentUser";

import Button from "./Button";

interface FollowButtonProps {
  targetUserId: number;
  className?: string;
}

export default function FollowButton({
  targetUserId,
  className,
}: FollowButtonProps) {
  const { user } = useCurrentUser();

  const queryClient = useQueryClient();

  const [isPending, startTransition] = useTransition();

  const currentUserId = user?.id ? Number(user.id) : undefined;

  const isSelf = currentUserId === targetUserId;

  const { data: isFollowed = false } = useQuery<boolean>({
    queryKey: ["isFollowing", currentUserId, targetUserId],
    queryFn: () => isFollowing(currentUserId!, targetUserId),
    enabled: !!currentUserId && !isSelf,
  });

  const mutation = useMutation
    ({
      mutationFn: () => toggleFollow(targetUserId),

      onMutate: async () => {
        await queryClient.cancelQueries({
          queryKey: ["isFollowing", currentUserId, targetUserId],
        });

        const previous = queryClient.getQueryData<boolean>([
          "isFollowing",
          currentUserId,
          targetUserId,
        ]);

        queryClient.setQueryData<boolean>(
          ["isFollowing", currentUserId, targetUserId],
          !previous
        );

        return { previous };
      },

      onError: (_error, _variables, context) => {
        if (context?.previous !== undefined) {
          queryClient.setQueryData<boolean>(
            ["isFollowing", currentUserId, targetUserId],
            context.previous
          );
        }
      },

      onSettled: () => {
        queryClient.invalidateQueries({
          queryKey: ["isFollowing", currentUserId, targetUserId],
        });

        queryClient.invalidateQueries({
          queryKey: ["followStats", targetUserId],
        });
      },
    });

  const handleClick = () => {
    if (!currentUserId || isSelf) return;

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