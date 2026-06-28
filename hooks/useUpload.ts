"use client";

import { useRef, useState } from "react";

import type { UploadType } from "@/lib/upload/upload-types";

export interface UploadResponse {
    url: string;
    publicId: string;
}

interface UploadOptions {
    file: File;
    type: UploadType;
}

interface UseUploadReturn {
    upload: (
        options: UploadOptions
    ) => Promise<UploadResponse>;

    cancelUpload: () => void;

    progress: number;

    isUploading: boolean;

    error: string | null;

    reset: () => void;
}

export const useUpload =
    (): UseUploadReturn => {
        const xhrRef =
            useRef<XMLHttpRequest | null>(
                null
            );

        const [
            progress,
            setProgress,
        ] = useState(0);

        const [
            isUploading,
            setIsUploading,
        ] = useState(false);

        const [
            error,
            setError,
        ] = useState<string | null>(
            null
        );

        const reset = () => {
            setProgress(0);
            setError(null);
            setIsUploading(false);
        };

        const cancelUpload = () => {
            xhrRef.current?.abort();

            reset();
        };

        const upload = ({
            file,
            type,
        }: UploadOptions) => {
            return new Promise<UploadResponse>(
                (
                    resolve,
                    reject
                ) => {
                    reset();

                    const xhr =
                        new XMLHttpRequest();

                    xhrRef.current =
                        xhr;

                    const formData =
                        new FormData();

                    formData.append(
                        "file",
                        file
                    );

                    formData.append(
                        "type",
                        type
                    );

                    xhr.upload.onprogress =
                        (
                            event
                        ) => {
                            if (
                                event.lengthComputable
                            ) {
                                const percent =
                                    Math.round(
                                        (event.loaded /
                                            event.total) *
                                        100
                                    );

                                setProgress(
                                    percent
                                );
                            }
                        };

                    xhr.onloadstart =
                        () => {
                            setIsUploading(
                                true
                            );
                        };

                    xhr.onerror =
                        () => {
                            setError(
                                "Upload failed."
                            );

                            setIsUploading(
                                false
                            );

                            reject(
                                new Error(
                                    "Upload failed."
                                )
                            );
                        };

                    xhr.onabort =
                        () => {
                            setError(
                                "Upload cancelled."
                            );

                            setIsUploading(
                                false
                            );

                            reject(
                                new Error(
                                    "Upload cancelled."
                                )
                            );
                        };

                    xhr.onload =
                        () => {
                            setIsUploading(
                                false
                            );

                            if (
                                xhr.status !==
                                200
                            ) {
                                setError(
                                    "Upload failed."
                                );

                                reject(
                                    new Error(
                                        "Upload failed."
                                    )
                                );

                                return;
                            }

                            const response: UploadResponse =
                                JSON.parse(
                                    xhr.responseText
                                );

                            setProgress(
                                100
                            );

                            resolve(
                                response
                            );
                        };

                    xhr.open(
                        "POST",
                        "/api/upload"
                    );

                    xhr.send(formData);
                }
            );
        };

        return {
            upload,
            cancelUpload,

            progress,
            isUploading,
            error,

            reset,
        };
    };