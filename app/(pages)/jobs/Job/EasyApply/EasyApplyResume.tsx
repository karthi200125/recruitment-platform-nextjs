"use client";

import Button from "@/components/Button";
import { Progress } from "@/components/ui/progress";
import { useFileUpload } from "@/hooks/useFileUpload";
import { useCustomToast } from "@/lib/CustomToast";
import { EasyApplyUser , ResumeData} from "@/types/easyApply";
import React, { useEffect, useState } from "react";
import { IoMdCloudUpload } from "react-icons/io";

interface EasyApplyResumeProps {
  user?: EasyApplyUser | null;
  currentStep?: number;
  onNext?: (step: number) => void;
  onBack?: (step: number) => void;
  onResume?: (data: ResumeData) => void;
}

/* ================= COMPONENT ================= */

const EasyApplyResume = ({
  user,
  currentStep = 0,
  onNext,
  onBack,
  onResume,
}: EasyApplyResumeProps) => {
  const { upload, progress, loading, error } = useFileUpload();
  const { showErrorToast, showSuccessToast } = useCustomToast();

  const [resumeName, setResumeName] = useState<string>("");
  const [resumeUrl, setResumeUrl] = useState<string>("");

  // ✅ Pre-fill existing resume (important UX)
  useEffect(() => {
    if (user?.resume) {
      setResumeName("Resume");
      setResumeUrl(user.resume);
    }
  }, [user]);

  /* ================= HANDLERS ================= */

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // ✅ Validation (must match backend)
    if (file.type !== "application/pdf") {
      return showErrorToast("Only PDF files are allowed");
    }

    if (file.size > 3 * 1024 * 1024) {
      return showErrorToast("File too large (max 3MB)");
    }

    setResumeName(file.name);

    try {
      const res = await upload({
        file,
        type: "resume",
      });

      setResumeUrl(res.url);
      showSuccessToast("Resume uploaded successfully");
    } catch {
      showErrorToast("Upload failed");
    }
  };

  const handleNext = () => {
    if (!resumeUrl) {
      return showErrorToast("Please upload your resume");
    }

    onResume?.({
      name: resumeName,
      url: resumeUrl,
    });

    onNext?.(currentStep + 1);
  };

  const handleBack = () => {
    onBack?.(currentStep - 1);
  };

  /* ================= UI ================= */

  return (
    <div className="w-full border rounded-md p-5 space-y-5">
      {/* Hidden Input */}
      <input
        type="file"
        id="resumeUpload"
        accept=".pdf"
        hidden
        onChange={handleFileSelect}
      />

      {/* Header */}
      <div className="flex flex-col md:flex-row gap-5 items-start justify-between">
        <div className="space-y-2">
          <h3 className="font-bold">Resume</h3>
          <h5>Be sure to include an updated resume *</h5>
        </div>

        <label htmlFor="resumeUpload" className="space-y-2 cursor-pointer">
          <div className="h-[40px] rounded-full border border-[var(--voilet)] flex items-center gap-3 px-5 text-sm text-[var(--voilet)] font-bold hover:opacity-70 transition">
            <IoMdCloudUpload size={22} />
            Upload Resume
          </div>
          <h5 className="text-center text-[var(--lighttext)]">
            PDF only (max 3MB)
          </h5>
        </label>
      </div>

      {/* Resume Name */}
      <div className="w-full border rounded-md p-3">
        {resumeName || "No resume uploaded"}
      </div>

      {/* Preview */}
      {resumeUrl && (
        <div className="w-full md:h-[600px] border rounded-md overflow-hidden">
          <iframe
            src={resumeUrl}
            title="Resume Preview"
            className="w-full h-full"
          />
        </div>
      )}

      {/* Progress */}
      {loading && (
        <div className="space-y-2">
          <p className="text-sm">Uploading...</p>
          <Progress value={progress} />
        </div>
      )}

      {/* Error */}
      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}

      {/* Actions */}
      <div className="flex gap-5">
        <Button variant="border" onClick={handleBack}>
          Back
        </Button>
        <Button disabled={!resumeUrl} onClick={handleNext}>
          Next
        </Button>
      </div>
    </div>
  );
};

export default EasyApplyResume;