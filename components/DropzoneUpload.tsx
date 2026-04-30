"use client";

import { useState } from "react";
import { useFileUpload } from "@/hooks/useFileUpload";

type Props = {
    type: string;
    userId?: number;
    companyId?: number;
    projectId?: number;
};

export default function DropzoneUpload({
    type,
    userId,
    companyId,
    projectId,
}: Props) {
    const { upload, progress, loading, error } = useFileUpload();

    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

    const handleFile = async (selectedFile: File) => {
        // basic validation
        if (selectedFile.size > 3 * 1024 * 1024) {
            alert("File too large (max 3MB)");
            return;
        }

        setFile(selectedFile);

        // preview
        if (selectedFile.type.startsWith("image/")) {
            setPreview(URL.createObjectURL(selectedFile));
        } else {
            setPreview(null);
        }

        try {
            const res = await upload({
                file: selectedFile,
                type,
                userId,
                companyId,
                projectId,
            });

            setUploadedUrl(res.url);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="space-y-3">
            {/* Dropzone */}
            <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-xl cursor-pointer hover:bg-gray-50 transition">
                <input
                    type="file"
                    className="hidden"
                    onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) handleFile(f);
                    }}
                />

                <p className="text-gray-500">
                    Drag & drop or click to upload
                </p>
            </label>

            {/* Preview */}
            {preview && (
                <img
                    src={preview}
                    alt="preview"
                    className="w-32 h-32 object-cover rounded-lg"
                />
            )}

            {/* File name (non-image) */}
            {file && !preview && (
                <p className="text-sm text-gray-600">{file.name}</p>
            )}

            {/* Progress */}
            {loading && (
                <p className="text-blue-600">
                    Uploading: {progress.toFixed(0)}%
                </p>
            )}

            {/* Error */}
            {error && (
                <p className="text-red-500">{error}</p>
            )}

            {/* Success */}
            {uploadedUrl && (
                <p className="text-green-600 text-sm">
                    Uploaded successfully
                </p>
            )}
        </div>
    );
}