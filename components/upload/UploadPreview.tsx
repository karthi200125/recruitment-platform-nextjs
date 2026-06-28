"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { CloseIcon, GenericFileIcon, PdfFileIcon } from "./FileIcon";

import type { UploadKind } from "@/lib/upload/upload-types";
import { formatFileSize } from "@/lib/upload/upload-utils";

interface UploadPreviewProps {
    file: File;
    kind: UploadKind;
    dimensions?: {
        width: number;
        height: number;
    };
    onRemove: () => void;
    disabled?: boolean;
}

const UploadPreview = ({
    file,
    kind,
    dimensions,
    onRemove,
    disabled = false,
}: UploadPreviewProps) => {
    const [previewUrl, setPreviewUrl] =
        useState<string>("");

    useEffect(() => {
        if (kind !== "image") return;

        const url =
            URL.createObjectURL(file);

        setPreviewUrl(url);

        return () => {
            URL.revokeObjectURL(url);
        };
    }, [file, kind]);

    return (
        <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4">

            {/* Preview */}
            <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-100">

                {kind === "image" &&
                    previewUrl && (
                        <Image
                            src={previewUrl}
                            alt={file.name}
                            width={56}
                            height={56}
                            className="h-full w-full object-cover"
                            unoptimized
                        />
                    )}

                {kind === "pdf" && (
                    <PdfFileIcon className="h-10 w-10 text-red-500" />
                )}

                {kind === "file" && (
                    <GenericFileIcon className="h-10 w-10 text-slate-500" />
                )}
            </div>

            {/* File Info */}
            <div className="min-w-0 flex-1">

                <h4 className="truncate font-semibold text-slate-900">
                    {file.name}
                </h4>

                <p className="mt-1 text-sm text-slate-500">
                    {formatFileSize(file.size)}

                    {kind === "image" &&
                        dimensions && (
                            <>
                                {" • "}
                                {dimensions.width} ×{" "}
                                {dimensions.height}
                            </>
                        )}
                </p>
            </div>

            {/* Remove */}
            <button
                type="button"
                onClick={onRemove}
                disabled={disabled}
                aria-label="Remove file"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-red-50 text-red-500 transition hover:bg-red-100 disabled:pointer-events-none disabled:opacity-50"
            >
                <CloseIcon className="h-4 w-4" />
            </button>
        </div>
    );
};

export default UploadPreview;