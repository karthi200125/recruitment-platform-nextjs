"use client";

import { useTransition } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { toggleSavedJob } from "@/actions/user/toggleSavedJob";
import { isSaved } from "@/actions/user/isSaved";

interface SaveJobButtonProps {
  userId: number;
  jobId: number;
}

export default function SaveJobButton({
  userId,
  jobId,
}: SaveJobButtonProps) {
  const queryClient = useQueryClient();
  const [isPending, startTransition] = useTransition();

  // ✅ Fetch saved state
  const { data: saved } = useQuery({
    queryKey: ["saved-job", userId, jobId],
    queryFn: () => isSaved({ userId, jobId }),
    enabled: !!userId && !!jobId,
  });

  // ✅ Mutation
  const mutation = useMutation({
    mutationFn: () => toggleSavedJob({ userId, jobId }),

    // 🚀 Optimistic update
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: ["saved-job", userId, jobId],
      });

      const previous = queryClient.getQueryData([
        "saved-job",
        userId,
        jobId,
      ]);

      queryClient.setQueryData(
        ["saved-job", userId, jobId],
        !previous
      );

      return { previous };
    },

    onError: (_err, _vars, context) => {
      if (context?.previous !== undefined) {
        queryClient.setQueryData(
          ["saved-job", userId, jobId],
          context.previous
        );
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["saved-job", userId, jobId],
      });
    },
  });

  const handleClick = () => {
    startTransition(() => {
      mutation.mutate();
    });
  };

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className={`px-4 py-2 rounded-md text-sm font-medium transition ${
        saved
          ? "bg-yellow-500 text-black"
          : "bg-gray-200 text-black"
      }`}
    >
      {saved ? "Saved" : "Save"}
    </button>
  );
}