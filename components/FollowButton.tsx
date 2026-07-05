"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useTransition } from "react";

import { isFollowing } from "@/actions/user/isFollowing";
import { toggleFollow } from "@/actions/user/toggle-follow";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { UserCheck, UserPlus } from "lucide-react";


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
    <button
      onClick={handleClick}
      disabled={isPending || mutation.isPending}
      className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[11px] font-semibold border transition-all duration-200 ${isFollowed
        ? "bg-[var(--voilet)] border-[var(--voilet)] text-white hover:bg-[var(--voilet2)] hover:border-[var(--voilet2)]"
        : "bg-white border-slate-200 text-slate-600 hover:bg-[var(--voilet)]/10 hover:border-[var(--voilet)] hover:text-[var(--voilet)]"
        } ${isPending || mutation.isPending
          ? "cursor-not-allowed opacity-60"
          : ""
        } ${className ?? ""}`}
    >
      {isFollowed ? (
        <UserCheck className="w-3 h-3" strokeWidth={2} />
      ) : (
        <UserPlus className="w-3 h-3" strokeWidth={2} />
      )}

      {isFollowed ? "Following" : "Follow"}
    </button>
  );
}