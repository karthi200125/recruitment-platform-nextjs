"use client";

import { useEffect, useRef, useState } from "react";
import {
    CheckCircle2,
    CircleAlert,
    FileText,
    MoreVertical,
    Sparkles,
    Trash2,
    Upload,
} from "lucide-react";

import Button from "@/components/Button";
import { useCustomToast } from "@/lib/CustomToast";
import { useUpload } from "@/hooks/useUpload";
import Link from "next/link";
import { deleteResume } from "@/actions/user/delete-resume";

interface ProfileResumeProps {
    resume?: string | null;
    resumePublicId?: string | null;
    onResumeUpdated?: (data: {
        resume: string;
        resumePublicId: string;
    }) => void;
}

const MAX_SIZE = 5 * 1024 * 1024;

const ProfileResume = ({
    resume,
    resumePublicId,
    onResumeUpdated,
}: ProfileResumeProps) => {
    const inputRef = useRef<HTMLInputElement>(null);

    const {
        upload,
        cancelUpload,
        progress,
        isUploading,
        error,
        reset,
    } = useUpload();

    const { showErrorToast, showSuccessToast } = useCustomToast();

    const [resumeUrl, setResumeUrl] = useState(resume ?? "");
    const [publicId, setPublicId] = useState(resumePublicId ?? "");
    const [resumeName, setResumeName] = useState("");
    const [isRemoving, setIsRemoving] = useState(false);

    useEffect(() => {
        setResumeUrl(resume ?? "");
        setPublicId(resumePublicId ?? "");

        if (resume) {
            const urlName = resume.split("/").pop()?.split("?")[0] ?? "";
            setResumeName(decodeURIComponent(urlName) || "Resume");
        } else {
            setResumeName("");
        }
    }, [resume, resumePublicId]);

    useEffect(() => {
        if (error) {
            showErrorToast(error);
        }
    }, [error, showErrorToast]);

    const hasResume = Boolean(resumeUrl);

    const handleChooseFile = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0];

        event.target.value = "";

        if (!file) return;

        if (file.type !== "application/pdf") {
            showErrorToast("Only PDF resumes are supported.");
            return;
        }

        if (file.size > MAX_SIZE) {
            showErrorToast("Resume must be smaller than 5 MB.");
            return;
        }

        try {
            reset();

            setResumeName(file.name);

            const result = await upload({
                file,
                type: "resume" as any,
            });

            setResumeUrl(result.url);
            setPublicId(result.publicId);

            onResumeUpdated?.({
                resume: result.url,
                resumePublicId: result.publicId,
            });

            showSuccessToast("Resume uploaded successfully.");
        } catch (error) {
            console.error("❌ Profile resume upload error:", error);

            setResumeName("");

            showErrorToast(
                "Unable to upload your resume. Please try again."
            );
        }
    };

    const handleRemove = async () => {
        if (!hasResume || isRemoving) return;

        setIsRemoving(true);
        try {
            const result = await deleteResume();

            if (!result.success) {
                showErrorToast(
                    result.error || "Unable to remove your resume."
                );
                return;
            }

            setResumeUrl("");
            setPublicId("");
            setResumeName("");

            onResumeUpdated?.({
                resume: "",
                resumePublicId: "",
            });

            showSuccessToast("Resume removed successfully.");

            window.location.reload();
        } catch (error) {
            console.error("❌ Remove resume error:", error);

            showErrorToast("Unable to remove your resume.");
        } finally {
            setIsRemoving(false);
        }
    };

    const handleCancelUpload = () => {
        cancelUpload();
        reset();

        setResumeName(resume ? "Current Resume" : "");
    };

    return (
        <section className="rounded-2xl border border-slate-200 bg-white">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50">
                        <FileText
                            className="h-4 w-4 text-indigo-600"
                            strokeWidth={1.8}
                        />
                    </div>

                    <div>
                        <h2 className="text-sm font-bold text-slate-800">
                            Resume
                        </h2>

                        <p className="text-[11px] text-slate-400">
                            Keep your professional resume up to date
                        </p>
                    </div>
                </div>

                {hasResume && !isUploading && (
                    <button
                        type="button"
                        aria-label="Resume options"
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                    >
                        <MoreVertical className="h-4 w-4" />
                    </button>
                )}
            </div>

            {/* Content */}
            <div className="p-5">
                {hasResume || isUploading ? (
                    <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
                        <div className="flex items-center gap-3">
                            {/* PDF Icon */}
                            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-red-50">
                                <FileText
                                    className="h-5 w-5 text-red-500"
                                    strokeWidth={1.8}
                                />
                            </div>

                            {/* Resume info */}
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-semibold text-slate-800">
                                    {resumeName || "Uploading resume..."}
                                </p>

                                <div className="mt-1 flex items-center gap-2">
                                    <span className="text-[11px] text-slate-400">
                                        PDF
                                    </span>

                                    <span className="h-1 w-1 rounded-full bg-slate-300" />

                                    {isUploading ? (
                                        <span className="text-[11px] font-medium text-indigo-600">
                                            Uploading... {progress}%
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-600">
                                            <CheckCircle2 className="h-3 w-3" />
                                            Uploaded
                                        </span>
                                    )}
                                </div>

                                {/* Upload progress */}
                                {isUploading && (
                                    <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
                                        <div
                                            className="h-full rounded-full bg-indigo-600 transition-all duration-200"
                                            style={{
                                                width: `${progress}%`,
                                            }}
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Actions */}
                            {!isUploading && (
                                <button
                                    type="button"
                                    onClick={handleRemove}
                                    disabled={isRemoving}
                                    aria-label="Remove resume"
                                    className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500 disabled:opacity-50"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            )}

                            {isUploading && (
                                <button
                                    type="button"
                                    onClick={handleCancelUpload}
                                    aria-label="Cancel upload"
                                    className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            )}
                        </div>
                    </div>
                ) : (
                    /* Empty state */
                    <button
                        type="button"
                        onClick={() => inputRef.current?.click()}
                        className="group flex w-full flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50/40 px-6 py-8 text-center transition-colors hover:border-indigo-300 hover:bg-indigo-50/30"
                    >
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-slate-200 transition-colors group-hover:bg-indigo-50 group-hover:ring-indigo-200">
                            <Upload
                                className="h-5 w-5 text-slate-400 group-hover:text-indigo-600"
                                strokeWidth={1.8}
                            />
                        </div>

                        <p className="mt-3 text-sm font-semibold text-slate-700">
                            Upload your resume
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                            PDF only · Maximum 5 MB
                        </p>
                    </button>
                )}

                {/* Upload / Replace */}
                <div className="mt-4 flex items-center justify-between gap-3">
                    <div>
                        {hasResume ? (
                            <p className="text-[11px] text-slate-400">
                                Your resume is stored on your profile.
                            </p>
                        ) : (
                            <p className="text-[11px] text-slate-400">
                                Upload a resume to unlock AI analysis.
                            </p>
                        )}
                    </div>

                    {!isUploading && (
                        <Button
                            variant="border"
                            onClick={() => inputRef.current?.click()}
                            disabled={isRemoving}
                        >
                            <Upload className="h-3.5 w-3.5" />
                            {hasResume ? "Replace" : "Upload Resume"}
                        </Button>
                    )}
                </div>

                {/* AI teaser */}
                {hasResume && !isUploading ? (
                    <div className="mt-4 flex items-center justify-between gap-4 rounded-xl border border-indigo-100 bg-indigo-50/50 px-4 py-3">
                        <div className="flex min-w-0 items-center gap-2.5">
                            <Sparkles
                                className="h-4 w-4 flex-shrink-0 text-indigo-600"
                                strokeWidth={1.8}
                            />

                            <div className="min-w-0">
                                <p className="text-xs font-semibold text-indigo-900">
                                    AI Resume Analysis
                                </p>

                                <p className="truncate text-[11px] text-indigo-600/70">
                                    Get personalized insights from your resume
                                </p>
                            </div>
                        </div>

                        <Link
                            href="/resume-analyse"
                            className="flex shrink-0 items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-1.5 text-[10px] font-semibold text-indigo-600 ring-1 ring-indigo-100 transition hover:bg-indigo-100"
                        >
                            <Sparkles className="h-3 w-3" />
                            Analyse with AI
                        </Link>
                    </div>
                ) : !isUploading ? (
                    <div className="mt-4 rounded-xl border border-indigo-100 bg-indigo-50/50 px-4 py-3">
                        <div className="flex items-start gap-2.5">
                            <Sparkles
                                className="mt-0.5 h-4 w-4 flex-shrink-0 text-indigo-600"
                                strokeWidth={1.8}
                            />

                            <div>
                                <p className="text-xs font-semibold text-indigo-900">
                                    AI Resume Analysis
                                </p>

                                <p className="mt-1 text-[11px] leading-5 text-indigo-600/70">
                                    Upload your resume to get an AI-powered
                                    score, strengths, improvement areas,
                                    missing keywords, and personalized
                                    suggestions.
                                </p>
                            </div>
                        </div>
                    </div>
                ) : null}
            </div>

            <input
                ref={inputRef}
                hidden
                type="file"
                accept=".pdf,application/pdf"
                onChange={handleChooseFile}
            />
        </section>
    );
};

export default ProfileResume;