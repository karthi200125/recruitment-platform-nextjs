"use client";

import { ReactNode } from "react";
import { useRouter } from "next/navigation";

import Model from "@/components/Model";
import { UploadFile } from "./UploadFile";

import type { UploadType } from "@/lib/upload/upload-types";

import type { UploadResponse } from "@/hooks/useUpload";
import { ExistingFile } from "./ExistingFileCard";

interface UploadModalProps {
    modalId: string;
    type: UploadType;

    children: ReactNode;

    className?: string;
    triggerCls?: string;

    existingFile?: ExistingFile;

    fields?: Record<string, string | number>;

    disabled?: boolean;

    onFileSelect?: (file: File) => void;
    onUploadSuccess?: (response: UploadResponse) => void;
    onUploadError?: (error: string) => void;
    onCancel?: () => void;
    onRemove?: () => void;
    onReplace?: () => void;
    onDelete?: () => void;
}

const UploadModal = ({
    modalId,
    type,
    children,
    className,
    triggerCls,
    existingFile,
    fields,
    disabled,
    onFileSelect,
    onUploadSuccess,
    onUploadError,
    onCancel,
    onRemove,
    onReplace,
    onDelete,
}: UploadModalProps) => {
    const router = useRouter();

    return (
        <Model
            modalId={modalId}
            triggerCls={triggerCls}
            className={className ?? "max-w-2xl"}
            bodyContent={
                <UploadFile
                    type={type}
                    existingFile={existingFile}
                    fields={fields}
                    disabled={disabled}
                    onFileSelect={onFileSelect}
                    onUploadSuccess={(response) => {
                        onUploadSuccess?.(response);
                        router.refresh();
                    }}
                    onUploadError={onUploadError}
                    onCancel={onCancel}
                    onRemove={onRemove}
                    onReplace={onReplace}
                    onDelete={onDelete}
                />
            }
        >
            {children}
        </Model>
    );
};

export default UploadModal;