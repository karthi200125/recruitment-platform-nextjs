"use client";

import { useRef, useState } from "react";

import { CloudUploadIcon } from "./FileIcon";
import { getUploadTypeConfig, UploadType } from "@/lib/upload/upload-types";


interface UploadDropzoneProps {
    type: UploadType;
    disabled?: boolean;
    onSelect: (file: File) => void;
}

const UploadDropzone = ({
    type,
    disabled = false,
    onSelect,
}: UploadDropzoneProps) => {
    const inputRef =
        useRef<HTMLInputElement>(null);

    const [dragging, setDragging] =
        useState(false);

    const config = getUploadTypeConfig(type);

    const handleFiles = (
        files: FileList | null
    ) => {
        if (!files?.length) return;

        onSelect(files[0]);
    };

    const handleDragOver = (
        e: React.DragEvent<HTMLDivElement>
    ) => {
        e.preventDefault();

        if (!disabled) {
            setDragging(true);
        }
    };

    const handleDragLeave = (
        e: React.DragEvent<HTMLDivElement>
    ) => {
        e.preventDefault();
        setDragging(false);
    };

    const handleDrop = (
        e: React.DragEvent<HTMLDivElement>
    ) => {
        e.preventDefault();

        setDragging(false);

        if (disabled) return;

        handleFiles(e.dataTransfer.files);
    };

    const openFilePicker = () => {
        if (disabled) return;

        inputRef.current?.click();
    };

    return (
        <>
            <div
                role="button"
                tabIndex={0}
                onClick={openFilePicker}
                onKeyDown={(e) => {
                    if (
                        e.key === "Enter" ||
                        e.key === " "
                    ) {
                        e.preventDefault();
                        openFilePicker();
                    }
                }}
                onDragOver={
                    handleDragOver
                }
                onDragLeave={
                    handleDragLeave
                }
                onDrop={handleDrop}
                className={`
                    flex
                    min-h-[260px]
                    cursor-pointer
                    flex-col
                    items-center
                    justify-center
                    rounded-3xl
                    border-2
                    border-dashed
                    bg-white
                    px-8
                    py-12
                    text-center
                    transition-all
                    duration-300

                    ${dragging
                        ? "border-[var(--voilet)] bg-violet-50"
                        : "border-slate-300 hover:border-[var(--voilet)] hover:bg-slate-50"
                    }

                    ${disabled
                        ? "pointer-events-none opacity-50"
                        : ""
                    }
                `}
            >
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-violet-100">
                    <CloudUploadIcon className="h-9 w-9 text-[var(--voilet)]" />
                </div>

                <h3 className="text-lg font-semibold text-slate-900">
                    {config.dropzoneLabel}
                </h3>

                <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                    or{" "}
                    <span className="font-semibold text-[var(--voilet)]">
                        browse files
                    </span>
                </p>

                <p className="mt-6 text-sm text-slate-400">
                    {config.helperText}
                </p>

                <input
                    ref={inputRef}
                    type="file"
                    hidden
                    disabled={disabled}
                    accept={config.acceptedMimeTypes.join(
                        ","
                    )}
                    onChange={(e) =>
                        handleFiles(
                            e.target.files
                        )
                    }
                />
            </div>
        </>
    );
};

export default UploadDropzone;