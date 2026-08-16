"use client";

import { useTransition } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { toggleSavedJob } from "@/actions/user/toggle-saved-job";
import { isSaved } from "@/actions/user/isSaved";

interface SaveJobButtonProps {
  userId: number;
  jobId: number;
  isIcon?: boolean;
}

export default function SaveJobButton({
  userId,
  jobId,
  isIcon = false,
}: SaveJobButtonProps) {
  const queryClient = useQueryClient();
  const [isPending, startTransition] = useTransition();
  
  const { data: saved } = useQuery({
    queryKey: ["saved-job", userId, jobId],
    queryFn: () => isSaved({ userId, jobId }),
    enabled: !!userId && !!jobId,
  });

  const mutation = useMutation({
    mutationFn: () => toggleSavedJob({ userId, jobId }),
    
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: ["saved-job", userId, jobId],
      });

      const previous = queryClient.getQueryData<boolean>([
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

    onError: (_error, _variables, context) => {
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

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    startTransition(() => {
      mutation.mutate();
    });
  };
  
  if (isIcon) {
    return (
      <button
        type="button"
        onClick={handleClick}
        disabled={isPending}
        aria-label={saved ? "Remove saved job" : "Save job"}
        title={saved ? "Remove saved job" : "Save job"}
        className={`flex h-10 w-10 items-center justify-center rounded-full transition-all duration-200 ${saved
            ? "text-violet-600 hover:bg-violet-50"
            : "text-gray-500 hover:bg-gray-100 hover:text-violet-600"
          } ${isPending ? "cursor-not-allowed opacity-50" : ""}`}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill={saved ? "currentColor" : "none"}
          xmlns="http://www.w3.org/2000/svg"
          className="transition-transform duration-200"
        >
          <path
            d="M6 4.5C6 3.67157 6.67157 3 7.5 3H16.5C17.3284 3 18 3.67157 18 4.5V21L12 17.25L6 21V4.5Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    );
  }
  
  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className={`rounded-md px-4 py-2 text-sm font-medium transition ${saved
          ? "bg-yellow-500 text-black"
          : "bg-gray-200 text-black"
        } ${isPending ? "cursor-not-allowed opacity-50" : ""}`}
    >
      {saved ? "Saved" : "Save"}
    </button>
  );
}