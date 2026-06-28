"use client";

import Button from "@/components/Button";

import { CheckCircleIcon } from "./FileIcon";

interface UploadProgressProps {
  progress: number;
  statusText: string;
  onCancel?: () => void;
  showCancel?: boolean;
}

const UploadProgress = ({
  progress,
  statusText,
  onCancel,
  showCancel = true,
}: UploadProgressProps) => {
  const percentage = Math.min(
    100,
    Math.max(0, Math.round(progress))
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-slate-900">
          Upload Progress
        </h4>

        {showCancel && onCancel && (
          <Button
            variant="border"
            onClick={onCancel}
            className="h-8 rounded-lg px-3 text-xs"
          >
            Cancel
          </Button>
        )}
      </div>

      {/* Progress Bar */}
      <div
        className="h-2 w-full overflow-hidden rounded-full bg-slate-200"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percentage}
        aria-label="Upload Progress"
      >
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{
            width: `${percentage}%`,
            backgroundColor: "var(--voilet)",
          }}
        />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-emerald-600">
          <CheckCircleIcon className="h-4 w-4" />
          <span>{statusText}</span>
        </div>

        <span className="text-sm font-semibold text-slate-700">
          {percentage}%
        </span>
      </div>
    </div>
  );
};

export default UploadProgress;