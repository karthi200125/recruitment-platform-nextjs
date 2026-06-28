"use client";

import Image from "next/image";
import Button from "@/components/Button";

import {
  GenericFileIcon,
  PdfFileIcon,
  CheckCircleIcon,
} from "./FileIcon";

import type { UploadKind } from "@/lib/upload/upload-types";
import { formatFileSize } from "@/lib/upload/upload-utils";

export interface ExistingFile {
  url: string;
  name: string;
  sizeBytes?: number;
  uploadedAt?: Date;
}

interface ExistingFileCardProps {
  file: ExistingFile;
  kind: UploadKind;

  onView: () => void;
  onDownload: () => void;
  onReplace: () => void;
  onDelete: () => void;

  disabled?: boolean;
}

const ExistingFileCard = ({
  file,
  kind,

  onView,
  onDownload,
  onReplace,
  onDelete,

  disabled = false,
}: ExistingFileCardProps) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">

      {/* Top */}
      <div className="flex items-center gap-4">

        {/* Preview */}
        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-100">

          {kind === "image" ? (
            <Image
              src={file.url}
              alt={file.name}
              width={64}
              height={64}
              className="h-full w-full object-cover"
            />
          ) : kind === "pdf" ? (
            <PdfFileIcon className="h-10 w-10 text-red-500" />
          ) : (
            <GenericFileIcon className="h-10 w-10 text-slate-500" />
          )}
        </div>

        {/* Details */}
        <div className="min-w-0 flex-1">

          <div className="flex items-center gap-2">
            <CheckCircleIcon className="h-4 w-4 text-emerald-500" />

            <h4 className="truncate font-semibold text-slate-900">
              {file.name}
            </h4>
          </div>

          <p className="mt-1 text-sm text-slate-500">
            {file.sizeBytes
              ? formatFileSize(file.sizeBytes)
              : ""}
          </p>

          {file.uploadedAt && (
            <p className="mt-1 text-xs text-slate-400">
              Uploaded{" "}
              {new Intl.DateTimeFormat("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              }).format(file.uploadedAt)}
            </p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">

        <Button
          variant="border"
          onClick={onView}
          disabled={disabled}
          className="h-10 rounded-xl text-xs"
        >
          View
        </Button>

        <Button
          variant="border"
          onClick={onDownload}
          disabled={disabled}
          className="h-10 rounded-xl text-xs"
        >
          Download
        </Button>

        <Button
          variant="border"
          onClick={onReplace}
          disabled={disabled}
          className="h-10 rounded-xl text-xs"
        >
          Replace
        </Button>

        <Button
          onClick={onDelete}
          disabled={disabled}
          className="h-10 rounded-xl bg-red-500 text-xs hover:bg-red-600"
        >
          Delete
        </Button>

      </div>
    </div>
  );
};

export default ExistingFileCard;