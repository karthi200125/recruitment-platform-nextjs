"use client";

import { useState, useRef, DragEvent, ChangeEvent } from "react";
import Image from "next/image";
import { Upload, X, CheckCircle2, Loader2, ImageIcon, FileText, AlertCircle } from "lucide-react";

import { useFileUpload } from "@/hooks/useFileUpload";
import { useCustomToast } from "@/lib/CustomToast";

type UploadType =
    | "profile"
    | "userBanner"
    | "companyLogo"
    | "companyBanner"
    | "resume"
    | "projectImage"
    | "chatImage";

type FileUploaderProps = {
    type: UploadType;
    entityId?: number;
    defaultImage?: string | null;
    onSuccess?: (url: string, publicId: string) => void;
    accept?: string[];
    maxSizeMB?: number;
    shape?: "square" | "circle";
    autoUpload?: boolean;
    label?: string;
    hint?: string;
};

const TYPE_META: Record<UploadType, { label: string; icon: React.ElementType }> = {
    profile: { label: "Profile photo", icon: ImageIcon },
    userBanner: { label: "Cover image", icon: ImageIcon },
    companyLogo: { label: "Company logo", icon: ImageIcon },
    companyBanner: { label: "Company cover", icon: ImageIcon },
    resume: { label: "Resume / CV", icon: FileText },
    projectImage: { label: "Project image", icon: ImageIcon },
    chatImage: { label: "Image", icon: ImageIcon },
};

function formatBytes(bytes: number): string {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const FileUploader = ({
    type,
    entityId,
    defaultImage = null,
    onSuccess,
    accept = ["image/jpeg", "image/png", "image/webp"],
    maxSizeMB = 3,
    shape = "square",
    autoUpload = false,
    label,
    hint,
}: FileUploaderProps) => {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const { upload, progress, loading, error } = useFileUpload();
    const { showErrorToast, showSuccessToast } = useCustomToast();

    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(defaultImage);
    const [dragActive, setDragActive] = useState(false);
    const [uploaded, setUploaded] = useState(false);

    const meta = TYPE_META[type];
    const Icon = meta.icon;
    const isImage = type !== "resume";

    const validateFile = (f: File) => {
        if (!accept.includes(f.type)) {
            showErrorToast(`Invalid file type. Accepted: ${accept.map((a) => a.split("/")[1].toUpperCase()).join(", ")}`);
            return false;
        }
        if (f.size > maxSizeMB * 1024 * 1024) {
            showErrorToast(`File too large. Max size is ${maxSizeMB}MB`);
            return false;
        }
        return true;
    };

    const handleFile = async (selected: File) => {
        if (!validateFile(selected)) return;
        setFile(selected);
        setUploaded(false);
        if (isImage) setPreview(URL.createObjectURL(selected));
        if (autoUpload) await doUpload(selected);
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0];
        if (selected) handleFile(selected);
    };

    const handleDragOver = (e: DragEvent) => { e.preventDefault(); setDragActive(true); };
    const handleDragLeave = () => setDragActive(false);
    const handleDrop = (e: DragEvent) => {
        e.preventDefault();
        setDragActive(false);
        const dropped = e.dataTransfer.files?.[0];
        if (dropped) handleFile(dropped);
    };

    const doUpload = async (customFile?: File) => {
        const target = customFile ?? file;
        if (!target) { showErrorToast("Please select a file first"); return; }

        try {
            const res = await upload({
                file: target,
                type,
                ...(type.includes("company") && { companyId: entityId }),
                ...(type === "profile" && { userId: entityId }),
                ...(type === "projectImage" && { projectId: entityId }),
            });

            setPreview(res.url);
            setFile(null);
            setUploaded(true);
            showSuccessToast("File uploaded successfully");
            onSuccess?.(res.url, res.publicId);
        } catch {
            showErrorToast("Upload failed. Please try again.");
        }
    };

    const clearFile = (e: React.MouseEvent) => {
        e.stopPropagation();
        setFile(null);
        setPreview(defaultImage);
        setUploaded(false);
        if (inputRef.current) inputRef.current.value = "";
    };

    return (
        <div className="w-full space-y-3">

            {/* Label */}
            {label && (
                <p className="text-xs font-semibold text-slate-700 uppercase tracking-wide">{label}</p>
            )}

            {/* Drop zone */}
            <div
                onClick={() => !loading && inputRef.current?.click()}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`relative w-full rounded-2xl border-2 border-dashed overflow-hidden transition-all duration-200 cursor-pointer ${
                    loading ? "cursor-not-allowed opacity-80" : ""
                } ${
                    dragActive
                        ? "border-indigo-400 bg-indigo-50/60"
                        : uploaded
                        ? "border-emerald-400 bg-emerald-50/40"
                        : preview
                        ? "border-slate-300 bg-slate-50"
                        : "border-slate-200 bg-slate-50 hover:border-indigo-300 hover:bg-indigo-50/30"
                }`}
                style={{ minHeight: "200px" }}
            >
                {/* Preview image */}
                {preview && isImage ? (
                    <>
                        <Image
                            src={preview}
                            alt="preview"
                            fill
                            className={`object-cover ${shape === "circle" ? "rounded-full scale-75" : ""}`}
                        />
                        {/* Overlay on hover */}
                        <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-all duration-200 flex items-center justify-center">
                            <p className="text-white text-sm font-semibold opacity-0 hover:opacity-100 transition-opacity duration-200">
                                Click to replace
                            </p>
                        </div>
                    </>
                ) : (
                    /* Empty / file state */
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                            dragActive ? "bg-indigo-100" : "bg-slate-100"
                        }`}>
                            {file && !isImage ? (
                                <FileText className="w-6 h-6 text-indigo-500" strokeWidth={1.75} />
                            ) : (
                                <Icon className={`w-6 h-6 ${dragActive ? "text-indigo-500" : "text-slate-400"}`} strokeWidth={1.75} />
                            )}
                        </div>

                        {file && !isImage ? (
                            <div>
                                <p className="text-sm font-semibold text-slate-700 truncate max-w-[200px]">{file.name}</p>
                                <p className="text-xs text-slate-400 mt-0.5">{formatBytes(file.size)}</p>
                            </div>
                        ) : (
                            <div>
                                <p className="text-sm font-semibold text-slate-600">
                                    {dragActive ? "Drop it here" : `Upload ${meta.label}`}
                                </p>
                                <p className="text-xs text-slate-400 mt-1">
                                    Drag & drop or click to browse
                                </p>
                                <p className="text-[11px] text-slate-300 mt-1">
                                    {accept.map((a) => a.split("/")[1].toUpperCase()).join(", ")} · Max {maxSizeMB}MB
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {/* Clear button */}
                {(preview || file) && !loading && (
                    <button
                        type="button"
                        onClick={clearFile}
                        className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all duration-200 shadow-sm z-10"
                        aria-label="Clear"
                    >
                        <X className="w-3.5 h-3.5" strokeWidth={2.5} />
                    </button>
                )}

                {/* Success checkmark */}
                {uploaded && !loading && (
                    <div className="absolute top-2.5 left-2.5 w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center shadow-sm z-10">
                        <CheckCircle2 className="w-4 h-4 text-white" strokeWidth={2.5} />
                    </div>
                )}

                <input
                    ref={inputRef}
                    type="file"
                    className="hidden"
                    accept={accept.join(",")}
                    onChange={handleChange}
                />
            </div>

            {/* Hint */}
            {hint && !loading && !error && (
                <p className="text-xs text-slate-400">{hint}</p>
            )}

            {/* Progress bar */}
            {loading && (
                <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                        <div className="flex items-center gap-1.5">
                            <Loader2 className="w-3 h-3 animate-spin" strokeWidth={2.5} />
                            Uploading...
                        </div>
                        <span className="font-semibold text-slate-700">{Math.round(progress)}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-indigo-500 rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
            )}

            {/* Error */}
            {error && (
                <div className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 px-3 py-2.5">
                    <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" strokeWidth={2} />
                    <p className="text-xs text-red-600">{error}</p>
                </div>
            )}

            {/* Upload button (manual mode) */}
            {!autoUpload && (
                <button
                    type="button"
                    onClick={() => doUpload()}
                    disabled={!file || loading}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 shadow-sm shadow-indigo-200"
                >
                    {loading ? (
                        <><Loader2 className="w-4 h-4 animate-spin" />Uploading...</>
                    ) : (
                        <><Upload className="w-4 h-4" strokeWidth={2} />Upload {meta.label}</>
                    )}
                </button>
            )}
        </div>
    );
};

export default FileUploader;