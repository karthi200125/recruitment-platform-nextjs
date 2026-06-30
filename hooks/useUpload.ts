"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { UploadType } from "@/lib/upload/upload-types";

export interface UploadResponse {
    url: string;
    publicId: string;
}

interface UploadApiSuccessBody {
    success: true;
    message: string;
    data: UploadResponse;
}

interface UploadApiErrorBody {
    error: string;
}

interface UploadOptions {
    file: File;
    type: UploadType;
    fields?: Record<string, string | number>;
}

export type UploadErrorReason = "network" | "cancelled" | "server" | "invalid-response" | "busy";

export class UploadError extends Error {
    readonly reason: UploadErrorReason;    
    readonly status?: number;

    constructor(message: string, reason: UploadErrorReason, status?: number) {
        super(message);
        this.name = "UploadError";
        this.reason = reason;
        this.status = status;
    }
}

interface UseUploadReturn {
    upload: (options: UploadOptions) => Promise<UploadResponse>;
    cancelUpload: () => void;
    progress: number;
    isUploading: boolean;
    error: string | null;
    reset: () => void;
}

export function useUpload(): UseUploadReturn {
    const xhrRef = useRef<XMLHttpRequest | null>(null);

    const [progress, setProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const reset = useCallback(() => {
        setProgress(0);
        setError(null);
        setIsUploading(false);
    }, []);

    const cancelUpload = useCallback(() => {        
        xhrRef.current?.abort();
        xhrRef.current = null;
    }, []);
    
    useEffect(() => {
        return () => {
            cancelUpload();
        };
    }, [cancelUpload]);

    const upload = useCallback(
        ({ file, type, fields }: UploadOptions): Promise<UploadResponse> => {
            return new Promise<UploadResponse>((resolve, reject) => {
                if (xhrRef.current) {
                    reject(
                        new UploadError(
                            "Another upload is already in progress.",
                            "busy"
                        )
                    );
                    return;
                }

                reset();

                const xhr = new XMLHttpRequest();
                xhrRef.current = xhr;

                const formData = new FormData();
                formData.append("file", file);
                formData.append("type", type);

                if (fields) {
                    for (const [key, value] of Object.entries(fields)) {
                        formData.append(key, String(value));
                    }
                }

                const settle = (err: UploadError | null, response?: UploadResponse) => {
                    setIsUploading(false);
                    xhrRef.current = null;

                    if (err) {
                        setError(err.message);
                        reject(err);
                        return;
                    }

                    setProgress(100);
                    resolve(response as UploadResponse);
                };

                xhr.upload.onprogress = (event) => {
                    if (event.lengthComputable) {
                        const percent = Math.round((event.loaded / event.total) * 100);
                        setProgress(percent);
                    }
                };

                xhr.onloadstart = () => {
                    setIsUploading(true);
                };

                xhr.onerror = () => {
                    settle(new UploadError("Upload failed. Check your connection and try again.", "network"));
                };

                xhr.onabort = () => {
                    settle(new UploadError("Upload cancelled.", "cancelled"));
                };

                xhr.onload = () => {                    
                    if (xhr.status < 200 || xhr.status >= 300) {
                        let message = `Upload failed (${xhr.status}).`;
                        try {
                            const body = JSON.parse(xhr.responseText) as UploadApiErrorBody;
                            if (body.error) message = body.error;
                        } catch {
                            // Response body wasn't JSON — keep the generic message.
                        }
                        settle(new UploadError(message, "server", xhr.status));
                        return;
                    }
                    
                    let body: UploadApiSuccessBody;
                    try {
                        body = JSON.parse(xhr.responseText) as UploadApiSuccessBody;
                    } catch {
                        settle(new UploadError("Upload succeeded but the response was invalid.", "invalid-response"));
                        return;
                    }

                    if (!body?.data?.url || !body?.data?.publicId) {
                        settle(new UploadError("Upload succeeded but the response was invalid.", "invalid-response"));
                        return;
                    }

                    settle(null, body.data);
                };

                xhr.open("POST", "/api/upload");
                xhr.send(formData);
            });
        },
        [reset]
    );

    return { upload, cancelUpload, progress, isUploading, error, reset };
}