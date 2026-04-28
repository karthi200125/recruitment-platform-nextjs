"use client";

import { useState } from "react";

type Props = {
    type: string;
    userId?: number;
    companyId?: number;
    projectId?: number;
};

export default function FileUpload({
    type,
    userId,
    companyId,
    projectId,
}: Props) {
    const [progress, setProgress] = useState(0);
    const [loading, setLoading] = useState(false);

    const handleUpload = (file: File) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("type", type);

        if (userId) formData.append("userId", String(userId));
        if (companyId) formData.append("companyId", String(companyId));
        if (projectId) formData.append("projectId", String(projectId));

        const xhr = new XMLHttpRequest();

        xhr.upload.onprogress = (e) => {
            if (e.lengthComputable) {
                setProgress((e.loaded / e.total) * 100);
            }
        };

        xhr.onloadstart = () => setLoading(true);
        xhr.onloadend = () => setLoading(false);

        xhr.open("POST", "/api/upload");
        xhr.send(formData);
    };

    return (
        <div className="space-y-2">
            <input
                type="file"
                onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleUpload(file);
                }}
            />

            {loading && <p>Uploading: {progress.toFixed(0)}%</p>}
        </div>
    );
}