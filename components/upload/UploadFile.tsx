"use client";

import {
    useCallback,
    useId,
    useMemo,
    useRef,
    useState,
    type DragEvent,
    type KeyboardEvent,
} from "react";

import {
    CloudUploadIcon,
    DocumentUploadIcon,
    FolderIcon,
    AlertIcon,
    CloseIcon,
    LockIcon,
    CheckCircleIcon,
    CheckCircleSoftIcon,
} from "./FileIcon";

import UploadPreview from "./UploadPreview";
import UploadProgress from "./UploadProgress";
import ExistingFileCard, { ExistingFile } from "./ExistingFileCard";
import { ImageDimensions, UploadType } from "@/lib/upload/upload-types";
import { readImageDimensions, validateFileList } from "@/lib/upload/upload-utils";
import { getUploadConfig } from "@/lib/upload/upload-config";

// ─── Public types ───────────────────────────────────────────────────────────

export type UploadStatus =
    | "idle"
    | "selected"
    | "uploading"
    | "success"
    | "error";

export interface UploadFileProps {
    type: UploadType;
    existingFile?: ExistingFile;
    progress?: number;
    uploading?: boolean;
    disabled?: boolean;
    variant?: "modal" | "inline";
    onClose?: () => void;

    onFileSelect?: (file: File) => void;
    onUploadStart?: (file: File) => void;
    onUploadProgress?: (progress: number) => void;
    onUploadSuccess?: (file: File) => void;
    onUploadError?: (error: string) => void;
    onCancel?: () => void;
    onRemove?: () => void;
    onReplace?: () => void;
    onDelete?: () => void;

    onSubmit?: (file: File) => void;
}

export function UploadFile({
    type,
    existingFile,
    progress: controlledProgress,
    uploading: controlledUploading,
    disabled = false,
    variant = "modal",
    onClose,
    onFileSelect,
    onUploadStart,
    onUploadProgress,
    onUploadSuccess,
    onUploadError,
    onCancel,
    onRemove,
    onReplace,
    onDelete,
    onSubmit,
}: UploadFileProps) {
    const config = getUploadConfig(type);
    const inputId = useId();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [status, setStatus] = useState<UploadStatus>("idle");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [imageDimensions, setImageDimensions] = useState<ImageDimensions | undefined>(undefined);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [internalProgress, setInternalProgress] = useState(0);
    const [showExisting, setShowExisting] = useState(Boolean(existingFile));

    const progressTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const isUploading =
        controlledUploading !== undefined ? controlledUploading : status === "uploading";
    const displayProgress =
        controlledProgress !== undefined ? controlledProgress : internalProgress;

    const isImageKind = config.kind === "image";

    // ── File handling ──

    const clearProgressTimer = useCallback(() => {
        if (progressTimerRef.current) {
            clearInterval(progressTimerRef.current);
            progressTimerRef.current = null;
        }
    }, []);

    const processFile = useCallback(
        async (file: File) => {
            const result = validateFileList([file], config);

            if (!result.valid) {
                setErrorMessage(result.message ?? "This file can't be used.");
                setStatus("error");
                onUploadError?.(result.message ?? "Invalid file.");
                return;
            }

            setErrorMessage(null);
            setSelectedFile(file);
            setStatus("selected");
            setShowExisting(false);

            if (isImageKind) {
                try {
                    const dims = await readImageDimensions(file);
                    setImageDimensions(dims);
                } catch {
                    setImageDimensions(undefined);
                }
            }

            onFileSelect?.(file);
        },
        [config, isImageKind, onFileSelect, onUploadError]
    );

    const handleFilesChosen = useCallback(
        (files: FileList | File[]) => {
            const fileArray = Array.from(files);
            const listCheck = validateFileList(fileArray, config);

            if (!listCheck.valid) {
                setErrorMessage(listCheck.message ?? "These files can't be used.");
                setStatus("error");
                onUploadError?.(listCheck.message ?? "Invalid selection.");
                return;
            }

            const [firstFile] = fileArray;
            if (fileArray.length === 1 && firstFile) {
                void processFile(firstFile);
            }
        },
        [config, processFile, onUploadError]
    );

    // ── Drag and drop ──

    const handleDragOver = useCallback(
        (event: DragEvent<HTMLDivElement>) => {
            event.preventDefault();
            if (disabled || isUploading) return;
            setIsDragging(true);
        },
        [disabled, isUploading]
    );

    const handleDragLeave = useCallback((event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback(
        (event: DragEvent<HTMLDivElement>) => {
            event.preventDefault();
            setIsDragging(false);
            if (disabled || isUploading) return;

            if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
                handleFilesChosen(event.dataTransfer.files);
            }
        },
        [disabled, isUploading, handleFilesChosen]
    );

    // ── Browse button / native input ──

    const openFileDialog = useCallback(() => {
        if (disabled || isUploading) return;
        fileInputRef.current?.click();
    }, [disabled, isUploading]);

    const handleInputChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            if (event.target.files && event.target.files.length > 0) {
                handleFilesChosen(event.target.files);
            }
            // Reset value so selecting the same file again still fires onChange
            event.target.value = "";
        },
        [handleFilesChosen]
    );

    const handleDropzoneKeyDown = useCallback(
        (event: KeyboardEvent<HTMLDivElement>) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                openFileDialog();
            }
            if (event.key === "Escape") {
                fileInputRef.current?.blur();
            }
        },
        [openFileDialog]
    );

    // ── Remove / cancel ──

    const handleRemove = useCallback(() => {
        setSelectedFile(null);
        setImageDimensions(undefined);
        setStatus("idle");
        setErrorMessage(null);
        setInternalProgress(0);
        clearProgressTimer();
        onRemove?.();
    }, [clearProgressTimer, onRemove]);

    const handleCancelUpload = useCallback(() => {
        clearProgressTimer();
        setStatus("selected");
        setInternalProgress(0);
        onCancel?.();
    }, [clearProgressTimer, onCancel]);

    // ── Submit (delegates the actual upload to the parent via callbacks) ──

    const handleSubmit = useCallback(() => {
        if (!selectedFile || disabled) return;

        onSubmit?.(selectedFile);
        onUploadStart?.(selectedFile);

        // If the parent is driving progress/uploading via props, do nothing further —
        // they own the state machine. Otherwise, simulate so the component is
        // clickable/demoable before real upload logic is wired in.
        if (controlledProgress !== undefined || controlledUploading !== undefined) {
            return;
        }

        setStatus("uploading");
        setInternalProgress(0);

        progressTimerRef.current = setInterval(() => {
            setInternalProgress((prev) => {
                const next = Math.min(prev + Math.random() * 18 + 6, 100);
                onUploadProgress?.(next);

                if (next >= 100) {
                    clearProgressTimer();
                    setStatus("success");
                    onUploadSuccess?.(selectedFile);
                }

                return next;
            });
        }, 280);
    }, [
        selectedFile,
        disabled,
        onSubmit,
        onUploadStart,
        onUploadProgress,
        onUploadSuccess,
        controlledProgress,
        controlledUploading,
        clearProgressTimer,
    ]);

    // ── Existing-file action handlers ──

    const handleReplaceClick = useCallback(() => {
        setShowExisting(false);
        setStatus("idle");
        onReplace?.();
    }, [onReplace]);

    const handleDeleteClick = useCallback(() => {
        onDelete?.();
    }, [onDelete]);

    const acceptAttribute = useMemo(
        () => config.acceptedMimeTypes.join(","),
        [config.acceptedMimeTypes]
    );

    const dropzoneIcon = isImageKind ? (
        <CloudUploadIcon className="h-12 w-12 text-indigo-500" />
    ) : (
        <DocumentUploadIcon className="h-12 w-12 text-indigo-500" />
    );

    const showDropzone = !showExisting && (status === "idle" || status === "error");
    const showSelectedCard =
        !showExisting && selectedFile && (status === "selected" || status === "uploading" || status === "error");
    const showProgress = !showExisting && status === "uploading";
    const showSuccessBanner = !showExisting && status === "success";

    return (
        <div
            className={"w-full rounded-2xl bg-white p-6"}
        >
            {/* ── Header ── */}
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h2
                        id={`${inputId}-title`}
                        className="text-lg font-bold text-slate-900"
                    >
                        {config.title}
                    </h2>
                    <p className="mt-1 text-xs text-slate-500">{config.helperText}</p>
                </div>
            </div>

            {/* ── Body ── */}
            <div className="mt-5 space-y-4">

                {/* Existing file state */}
                {showExisting && existingFile ? (
                    <ExistingFileCard
                        file={existingFile}
                        kind={config.kind}
                        disabled={disabled}
                        onView={() => window.open(existingFile.url, "_blank", "noopener,noreferrer")}
                        onDownload={() => {
                            const link = document.createElement("a");
                            link.href = existingFile.url;
                            link.download = existingFile.name;
                            link.click();
                        }}
                        onReplace={handleReplaceClick}
                        onDelete={handleDeleteClick}
                    />
                ) : null}

                {/* Dropzone */}
                {showDropzone ? (
                    <div
                        role="button"
                        tabIndex={disabled ? -1 : 0}
                        aria-disabled={disabled}
                        aria-label={`${config.dropzoneLabel}. ${config.helperText}`}
                        onClick={openFileDialog}
                        onKeyDown={handleDropzoneKeyDown}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={[
                            "flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors duration-200",
                            "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500",
                            disabled
                                ? "cursor-not-allowed border-slate-200 bg-slate-50 opacity-60"
                                : isDragging
                                    ? "cursor-pointer border-indigo-400 bg-indigo-50"
                                    : "cursor-pointer border-slate-300 bg-slate-50/60 hover:border-indigo-300 hover:bg-indigo-50/40",
                        ].join(" ")}
                    >
                        <input
                            ref={fileInputRef}
                            id={inputId}
                            type="file"
                            accept={acceptAttribute}
                            className="sr-only"
                            disabled={disabled}
                            onChange={handleInputChange}
                            tabIndex={-1}
                        />

                        {dropzoneIcon}

                        <p className="text-base font-medium text-slate-900">
                            {config.dropzoneLabel}
                        </p>
                        <p className="text-sm text-slate-400">or</p>

                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                openFileDialog();
                            }}
                            disabled={disabled}
                            className={[
                                "inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium transition-colors",
                                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500",
                                config.kind === "pdf" || config.kind === "file"
                                    ? "border border-slate-200 bg-white text-indigo-500 hover:bg-slate-50"
                                    : "bg-indigo-500 text-white hover:bg-indigo-600",
                                "disabled:pointer-events-none disabled:opacity-50",
                            ].join(" ")}
                        >
                            {(config.kind === "pdf" || config.kind === "file") && (
                                <FolderIcon className="h-4 w-4" />
                            )}
                            Browse files
                        </button>

                        {config.dropzoneSubtext ? (
                            <p className="text-xs text-slate-400">{config.dropzoneSubtext}</p>
                        ) : null}
                    </div>
                ) : null}

                {/* Error message */}
                {status === "error" && errorMessage ? (
                    <div
                        role="alert"
                        className="flex items-start gap-2 rounded-lg bg-red-50 px-3 py-2.5 text-sm text-red-700"
                    >
                        <AlertIcon className="mt-0.5 h-4 w-4 shrink-0" />
                        <span>{errorMessage}</span>
                    </div>
                ) : null}

                {/* Selected file card */}
                {showSelectedCard && selectedFile ? (
                    <div className="space-y-1.5">
                        <p className="text-sm font-medium text-slate-900">Selected file</p>
                        <UploadPreview
                            file={selectedFile}
                            kind={config.kind}
                            dimensions={imageDimensions}
                            onRemove={handleRemove}
                            disabled={isUploading || disabled}
                        />
                    </div>
                ) : null}

                {/* Progress */}
                {showProgress ? (
                    <UploadProgress
                        progress={displayProgress}
                        statusText="Uploading to Cloudinary..."
                        // statusIconStyle={
                        //     isImageKind ? "soft" : "solid"
                        // }
                        onCancel={handleCancelUpload}
                    />
                ) : null}

                {/* Success banner */}
                {showSuccessBanner ? (
                    <div className="flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2.5 text-sm font-medium text-emerald-700">
                        {isImageKind ? (
                            <CheckCircleSoftIcon className="h-4 w-4 shrink-0" />
                        ) : (
                            <CheckCircleIcon className="h-4 w-4 shrink-0" />
                        )}
                        Uploaded successfully
                    </div>
                ) : null}

            </div>

            {/* ── Footer ── */}
            {!showExisting ? (
                <div className="mt-6 flex items-center justify-between gap-3 border-t border-slate-100 pt-5">
                    <button
                        type="button"
                        onClick={handleRemove}
                        disabled={disabled || isUploading}
                        className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 disabled:pointer-events-none disabled:opacity-50"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={disabled || !selectedFile || isUploading || status === "success"}
                        className="rounded-lg bg-indigo-500 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 disabled:pointer-events-none disabled:opacity-50"
                    >
                        {config.submitLabel}
                    </button>
                </div>
            ) : null}

            {/* ── Security footnote ── */}
            <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-slate-400">
                <LockIcon className="h-3 w-3" />
                Your files are secure and private
            </p>
        </div>
    );
}