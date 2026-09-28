"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";

import { toggleSavedJob } from "@/actions/user/toggle-saved-job";

interface SaveJobButtonProps {
  userId: number;
  jobId: number;
  initialSaved: boolean;
  isIcon?: boolean;
}

export default function SaveJobButton({
  userId,
  jobId,
  initialSaved,
  isIcon = false,
}: SaveJobButtonProps) {
  const [saved, setSaved] = useState(initialSaved);

  const mutation = useMutation({
    mutationFn: () => toggleSavedJob({ userId, jobId }),

    onMutate: () => {
      // Instant UI update
      setSaved((previous) => !previous);
    },

    onError: () => {
      // Roll back if the server action fails
      setSaved((previous) => !previous);
    },
  });

  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    event.stopPropagation();

    if (mutation.isPending) return;

    mutation.mutate();
  };

  if (isIcon) {
    return (
      <button
        type="button"
        onClick={handleClick}
        disabled={mutation.isPending}
        aria-label={saved ? "Remove saved job" : "Save job"}
        title={saved ? "Remove saved job" : "Save job"}
        className={`flex h-10 w-10 items-center justify-center rounded-full transition-all duration-200 ${saved
            ? "text-violet-600 hover:bg-violet-50"
            : "text-gray-500 hover:bg-gray-100 hover:text-violet-600"
          } ${mutation.isPending
            ? "cursor-not-allowed opacity-50"
            : ""
          }`}
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
      disabled={mutation.isPending}
      className={`rounded-md px-4 py-2 text-sm font-medium transition ${saved
          ? "bg-yellow-500 text-black"
          : "bg-gray-200 text-black"
        } ${mutation.isPending
          ? "cursor-not-allowed opacity-50"
          : ""
        }`}
    >
      {saved ? "Saved" : "Save"}
    </button>
  );
}