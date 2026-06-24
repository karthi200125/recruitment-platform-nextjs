"use client";

import React, {
  useEffect,
  useState,
} from "react";

import Button from "@/components/Button";
import { Progress } from "@/components/ui/progress";
import { useFileUpload } from "@/hooks/useFileUpload";
import { useCustomToast } from "@/lib/CustomToast";

import {
  EasyApplyUser,
  ResumeData,
} from "@/types/easyApply";

import { CloudUpload } from "lucid-react";

interface EasyApplyResumeProps {
  user?: EasyApplyUser | null;

  currentStep?: number;

  onNext?: (step: number) => void;

  onBack?: (step: number) => void;

  onResume?: (
    data: ResumeData
  ) => void;
}

/* ================= COMPONENT ================= */

const EasyApplyResume = ({
  user,
  currentStep = 0,
  onNext,
  onBack,
  onResume,
}: EasyApplyResumeProps) => {

  const {
    upload,
    progress,
    loading,
    error,
  } = useFileUpload();

  const {
    showErrorToast,
    showSuccessToast,
  } = useCustomToast();

  const [resumeName, setResumeName] =
    useState("");

  const [resumeUrl, setResumeUrl] =
    useState("");

  /* ================= PREFILL ================= */

  useEffect(() => {
    if (user?.resume) {
      setResumeName("Resume.pdf");

      setResumeUrl(user.resume);
    }
  }, [user]);

  /* ================= FILE SELECT ================= */

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile =
      event.target.files?.[0];

    if (!selectedFile) return;

    // ✅ pdf only
    if (
      selectedFile.type !==
      "application/pdf"
    ) {
      return showErrorToast(
        "Only PDF files are allowed"
      );
    }

    // ✅ max 3MB
    if (
      selectedFile.size >
      3 * 1024 * 1024
    ) {
      return showErrorToast(
        "Maximum file size is 3MB"
      );
    }

    try {
      // ✅ set temporary name immediately
      setResumeName(
        selectedFile.name
      );

      // ✅ upload using reusable hook
      const res = await upload({
        file: selectedFile,

        type: "resume",
      });

      // ✅ save cloudinary url
      setResumeUrl(res.url);

      showSuccessToast(
        "Resume uploaded successfully"
      );

    } catch (err) {
      console.error(
        "[ResumeUpload]",
        err
      );

      showErrorToast(
        "Resume upload failed"
      );
    }
  };

  /* ================= NEXT ================= */

  const handleNext = () => {
    if (!resumeUrl) {
      return showErrorToast(
        "Please upload your resume"
      );
    }

    onResume?.({
      name: resumeName,

      url: resumeUrl,
    });

    onNext?.(currentStep + 1);
  };

  /* ================= BACK ================= */

  const handleBack = () => {
    onBack?.(currentStep - 1);
  };

  /* ================= UI ================= */

  return (
    <div className="w-full border rounded-md p-5 space-y-5">

      {/* FILE INPUT */}
      <input
        type="file"
        id="resumeUpload"
        accept=".pdf"
        hidden
        onChange={handleFileSelect}
      />

      {/* HEADER */}
      <div className="flex flex-col md:flex-row gap-5 items-start justify-between">

        <div className="space-y-2">
          <h3 className="font-bold">
            Resume
          </h3>

          <h5>
            Be sure to include an
            updated resume *
          </h5>
        </div>

        {/* UPLOAD BUTTON */}
        <label
          htmlFor="resumeUpload"
          className="space-y-2 cursor-pointer"
        >
          <div className="h-[40px] rounded-full border border-[var(--voilet)] flex items-center gap-3 px-5 text-sm text-[var(--voilet)] font-bold hover:opacity-70 transitilucid-on">
ad
              size={22}
            />

            {loading
              ? "Uploading..."
              : "Upload Resume"}
          </div>

          <h5 className="text-center text-[var(--lighttext)]">
            PDF only (max 3MB)
          </h5>
        </label>
      </div>

      {/* FILE NAME */}
      <div className="w-full border rounded-md p-3 text-sm break-all">
        {resumeName ||
          "No resume uploaded"}
      </div>

      {/* PREVIEW */}
      {resumeUrl && (
        <div className="w-full h-[500px] md:h-[600px] border rounded-md overflow-hidden">

          <iframe
            src={resumeUrl}
            title="Resume Preview"
            className="w-full h-full"
          />
        </div>
      )}

      {/* PROGRESS */}
      {loading && (
        <div className="space-y-2">

          <p className="text-sm">
            Uploading...
            {" "}
            {Math.round(progress)}%
          </p>

          <Progress
            value={progress}
          />
        </div>
      )}

      {/* ERROR */}
      {error && (
        <p className="text-sm text-red-500">
          {error}
        </p>
      )}

      {/* ACTIONS */}
      <div className="flex gap-5">

        <Button
          variant="border"
          onClick={handleBack}
        >
          Back
        </Button>

        <Button
          disabled={!resumeUrl}
          onClick={handleNext}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default EasyApplyResume;