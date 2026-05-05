"use client";

import { useState } from "react";

type UploadType =
    | "profile"
    | "userBanner"
    | "companyLogo"
    | "companyBanner"
    | "resume"
    | "projectImage"
    | "chatImage";

type UploadParams = {
    file: File;
    type: UploadType;
    userId?: number;
    companyId?: number;
    projectId?: number;
};

export function useFileUpload() {
    const [progress, setProgress] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const upload = ({
        file,
        type,
        userId,
        companyId,
        projectId,
    }: UploadParams): Promise<{ url: string; publicId: string }> => {
        return new Promise((resolve, reject) => {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("type", type);

            // ✅ only send when needed
            if (userId) formData.append("userId", String(userId));
            if (companyId) formData.append("companyId", String(companyId));
            if (projectId) formData.append("projectId", String(projectId));

            const xhr = new XMLHttpRequest();

            // ✅ progress
            xhr.upload.onprogress = (e) => {
                if (e.lengthComputable) {
                    const percent = (e.loaded / e.total) * 100;
                    setProgress(percent);
                }
            };

            // ✅ start
            xhr.onloadstart = () => {
                setLoading(true);
                setError(null);
            };

            // ✅ success
            xhr.onload = () => {
                setLoading(false);

                if (xhr.status !== 200) {
                    setError("Upload failed");
                    return reject("Upload failed");
                }

                const res = JSON.parse(xhr.response);

                resolve({
                    url: res.url,
                    publicId: res.publicId,
                });
            };

            // ❌ error
            xhr.onerror = () => {
                setLoading(false);
                setError("Upload failed");
                reject("Upload failed");
            };

            xhr.open("POST", "/api/upload");
            xhr.send(formData);
        });
    };

    return { upload, progress, loading, error };
}