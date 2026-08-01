"use client";

import { useEffect, useRef, useState } from "react";
import { Upload, FileText, X } from "lucide-react";

import Button from "@/components/Button";
import { useCustomToast } from "@/lib/CustomToast";
import { useUpload } from "@/hooks/useUpload";

import type { EasyApplyUser, ResumeData } from "@/types/easyApply";

interface EasyApplyResumeProps {
  user?: EasyApplyUser | null;
  currentStep?: number;
  initialResume?: ResumeData;
  onNext?: (step: number) => void;
  onBack?: (step: number) => void;
  onResume?: (data: ResumeData) => void;
}

const MAX_SIZE = 5 * 1024 * 1024;

const EasyApplyResume = ({ user, currentStep = 0, initialResume, onNext, onBack, onResume }: EasyApplyResumeProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { showErrorToast } = useCustomToast();
  const { upload, cancelUpload, progress, isUploading, error, reset } = useUpload();

  const [resumeName, setResumeName] = useState(initialResume?.name ?? "");
  const [resumeUrl, setResumeUrl] = useState(initialResume?.url ?? "");
  const [resumePublicId, setResumePublicId] = useState(initialResume?.publicId ?? "");
  const [selectedFile, setSelectedFile] = useState<File | null>(initialResume?.file ?? null);

  useEffect(() => {
    if (initialResume?.url || initialResume?.file) return;
    if (!user?.resume) return;

    setResumeName("Current Resume");
    setResumeUrl(user.resume);
    setResumePublicId(user.resumePublicId ?? "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    if (error) showErrorToast(error);
  }, [error, showErrorToast]);

  const handleChooseFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (file.type !== "application/pdf") {
      showErrorToast("Only PDF files are allowed.");
      return;
    }

    if (file.size > MAX_SIZE) {
      showErrorToast("Resume must be smaller than 5 MB.");
      return;
    }

    setSelectedFile(file);
    setResumeName(file.name);
    setResumeUrl("");
    setResumePublicId("");

    try {
      const result = await upload({ file, type: "resume" as any });
      setResumeUrl(result.url);
      setResumePublicId(result.publicId);
    } catch {
      setSelectedFile(null);
      setResumeName(initialResume?.name ?? "");
    }
  };

  const handleRemove = () => {
    if (isUploading) {
      cancelUpload();
    }
    reset();
    setSelectedFile(null);
    setResumeName("");
    setResumeUrl("");
    setResumePublicId("");
  };

  const handleNext = () => {
    if (isUploading) return;

    if (!resumeUrl) {
      showErrorToast("Please select a resume before continuing.");
      return;
    }

    onResume?.({ name: resumeName, url: resumeUrl, publicId: resumePublicId, file: selectedFile });
    onNext?.(currentStep + 1);
  };

  const handleBack = () => {
    if (isUploading) {
      cancelUpload();
    }
    onBack?.(currentStep - 1);
  };

  const hasResume = Boolean(resumeUrl || selectedFile);

  return (
    <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Resume</h2>
        <p className="mt-1 text-sm text-slate-500">
          Use your existing resume or choose another one for this application. Your profile resume will not be
          changed.
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 p-5">
        <div className="flex items-center gap-3">
          <FileText className="h-8 w-8 flex-shrink-0 text-[var(--primary-clr)]" />

          <div className="min-w-0 flex-1">
            <h4 className="truncate font-medium text-slate-900">{resumeName || "No resume selected"}</h4>
            <p className="text-sm text-slate-500">{isUploading ? `Uploading... ${progress}%` : "PDF • Maximum 5 MB"}</p>

            {isUploading && (
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-[var(--primary-clr)] transition-all duration-200"
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}
          </div>

          <div className="flex flex-shrink-0 items-center gap-2">
            {hasResume && (
              <button
                type="button"
                onClick={handleRemove}
                aria-label={isUploading ? "Cancel upload" : "Remove resume"}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-500"
              >
                <X className="h-4 w-4" />
              </button>
            )}

            <Button variant="border" onClick={() => inputRef.current?.click()} disabled={isUploading}>
              <Upload className="h-4 w-4" />
              {hasResume ? "Replace" : "Choose"}
            </Button>
          </div>
        </div>

        <input ref={inputRef} hidden type="file" accept=".pdf" onChange={handleChooseFile} />
      </div>

      <div className="flex items-center justify-between border-t border-slate-200 pt-6">
        <Button variant="border" onClick={handleBack}>
          Back
        </Button>

        <Button onClick={handleNext} disabled={!hasResume || isUploading} isLoading={isUploading}>
          Next
        </Button>
      </div>
    </div>
  );
};

export default EasyApplyResume;