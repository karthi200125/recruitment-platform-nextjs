"use client";

import { useEffect, useRef, useState } from "react";
import { Upload, FileText } from "lucide-react";

import Button from "@/components/Button";
import { useCustomToast } from "@/lib/CustomToast";

import type {
  EasyApplyUser,
  ResumeData,
} from "@/types/easyApply";

interface EasyApplyResumeProps {
  user?: EasyApplyUser | null;
  currentStep?: number;
  onNext?: (step: number) => void;
  onBack?: (step: number) => void;
  onResume?: (data: ResumeData) => void;
}

const MAX_SIZE = 5 * 1024 * 1024;

const EasyApplyResume = ({
  user,
  currentStep = 0,
  onNext,
  onBack,
  onResume,
}: EasyApplyResumeProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const { showErrorToast } = useCustomToast();

  const [resumeName, setResumeName] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");
  const [resumePublicId, setResumePublicId] = useState("");
  const [selectedFile, setSelectedFile] =
    useState<File | null>(null);

  useEffect(() => {
    if (!user?.resume) return;

    setResumeName("Current Resume");
    setResumeUrl(user.resume);
    setResumePublicId(user.resumePublicId ?? "");
  }, [user]);

  const handleChooseFile = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

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

    // remove existing resume reference
    setResumeUrl("");
    setResumePublicId("");
  };

  const handleNext = () => {
    if (!resumeUrl && !selectedFile) {
      showErrorToast(
        "Please select a resume before continuing."
      );
      return;
    }

    onResume?.({
      name: resumeName,
      url: resumeUrl,
      publicId: resumePublicId,
      file: selectedFile,
    });

    onNext?.(currentStep + 1);
  };

  return (
    <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6">

      <div>
        <h2 className="text-lg font-semibold">
          Resume
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Use your existing resume or choose another one for this application.
          Your profile resume will not be changed.
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 p-5">

        <div className="flex items-center gap-3">

          <FileText className="h-8 w-8 text-[var(--primary-clr)]" />

          <div className="flex-1">

            <h4 className="font-medium">
              {resumeName || "No resume selected"}
            </h4>

            <p className="text-sm text-slate-500">
              PDF • Maximum 5 MB
            </p>

          </div>

          <Button
            variant="border"
            onClick={() =>
              inputRef.current?.click()
            }
          >
            <Upload className="h-4 w-4" />
            {resumeName ? "Replace" : "Choose"}
          </Button>

        </div>

        <input
          ref={inputRef}
          hidden
          type="file"
          accept=".pdf"
          onChange={handleChooseFile}
        />

      </div>

      <div className="flex items-center justify-between border-t border-slate-200 pt-6">

        <Button
          variant="border"
          onClick={() =>
            onBack?.(currentStep - 1)
          }
        >
          Back
        </Button>

        <Button
          onClick={handleNext}
          disabled={!resumeUrl && !selectedFile}
        >
          Next
        </Button>

      </div>

    </div>
  );
};

export default EasyApplyResume;