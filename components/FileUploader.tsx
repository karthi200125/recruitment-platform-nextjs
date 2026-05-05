"use client";

import { useState, useRef, DragEvent, ChangeEvent } from "react";
import Image from "next/image";
import { useFileUpload } from "@/hooks/useFileUpload";
import { Progress } from "@/components/ui/progress";
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
};

const FileUploader = ({
  type,
  entityId,
  defaultImage = null,
  onSuccess,
  accept = ["image/jpeg", "image/png", "image/webp"],
  maxSizeMB = 3,
  shape = "square",
  autoUpload = false,
}: FileUploaderProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const { upload, progress, loading, error } = useFileUpload();
  const { showErrorToast, showSuccessToast } = useCustomToast();

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(defaultImage);
  const [dragActive, setDragActive] = useState(false);

  /* ================= VALIDATION ================= */
  const validateFile = (file: File) => {
    if (!accept.includes(file.type)) {
      showErrorToast("Invalid file type");
      return false;
    }

    if (file.size > maxSizeMB * 1024 * 1024) {
      showErrorToast(`Max size is ${maxSizeMB}MB`);
      return false;
    }

    return true;
  };

  /* ================= HANDLE FILE ================= */
  const handleFile = async (selectedFile: File) => {
    if (!validateFile(selectedFile)) return;

    setFile(selectedFile);

    const previewUrl = URL.createObjectURL(selectedFile);
    setPreview(previewUrl);

    if (autoUpload) {
      await handleUpload(selectedFile);
    }
  };

  /* ================= INPUT CHANGE ================= */
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    handleFile(selectedFile);
  };

  /* ================= DRAG EVENTS ================= */
  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragActive(false);

    const droppedFile = e.dataTransfer.files?.[0];
    if (!droppedFile) return;

    handleFile(droppedFile);
  };

  /* ================= UPLOAD ================= */
  const handleUpload = async (customFile?: File) => {
    const uploadFile = customFile || file;

    if (!uploadFile) {
      return showErrorToast("Please select a file");
    }

    try {
      const res = await upload({
        file: uploadFile,
        type,
        ...(type.includes("company") && { companyId: entityId }),
        ...(type === "profile" && { userId: entityId }),
        ...(type === "projectImage" && { projectId: entityId }),
      });

      setPreview(res.url);
      setFile(null);

      showSuccessToast("Upload successful");

      onSuccess?.(res.url, res.publicId);
    } catch {
      showErrorToast("Upload failed");
    }
  };

  /* ================= UI ================= */
  return (
    <div className="space-y-4">
      {/* DROP ZONE */}
      <div
        className={`relative w-full h-[200px] border-2 border-dashed rounded-xl overflow-hidden flex items-center justify-center cursor-pointer transition
        ${dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"}`}
        onClick={() => inputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* IMAGE */}
        {preview ? (
          <Image
            src={preview}
            alt="preview"
            fill
            className={`object-cover ${shape === "circle" ? "rounded-full" : ""
              }`}
          />
        ) : (
          <p className="text-gray-500 text-sm text-center px-4">
            Drag & drop or click to upload
          </p>
        )}

        {/* INPUT */}
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept={accept.join(",")}
          onChange={handleChange}
        />
      </div>

      {/* PROGRESS */}
      {loading && (
        <div className="space-y-2">
          <p className="text-sm">Uploading... {Math.round(progress)}%</p>
          <Progress value={progress} />
        </div>
      )}

      {/* ERROR */}
      {error && <p className="text-red-500 text-sm">{error}</p>}

      {/* BUTTON */}
      {!autoUpload && (
        <div className="flex justify-end">
          <button
            onClick={() => handleUpload()}
            disabled={!file || loading}
            className="px-4 py-2 bg-black text-white rounded-md disabled:opacity-50"
          >
            {loading ? "Uploading..." : "Upload"}
          </button>
        </div>
      )}
    </div>
  );
};

export default FileUploader;