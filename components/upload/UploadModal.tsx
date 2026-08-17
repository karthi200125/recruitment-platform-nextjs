"use client";

import { ReactNode } from "react";
import { useRouter } from "next/navigation";

import Model from "@/components/Model";
import { UploadFile } from "./UploadFile";

import type { UploadType } from "@/lib/upload/upload-types";

import type { UploadResponse } from "@/hooks/useUpload";
import { ExistingFile } from "./ExistingFileCard";

import { useSession } from "next-auth/react";

interface UploadModalProps {
    isCurrentUser?: any;
    modalId: string;
    type: UploadType;

    children: ReactNode;

    className?: string;
    triggerCls?: string;

    existingFile?: ExistingFile;

    fields?: Record<string, string | number>;

    disabled?: boolean;

    onFileSelect?: (file: File) => void;
    onUploadSuccess?: (response: UploadResponse) => void | Promise<void>;
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
    isCurrentUser
}: UploadModalProps) => {
    const router = useRouter();

    const { update } = useSession();

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
                    onUploadSuccess={async (response) => {
                        try {
                            await onUploadSuccess?.(response);
                            await update();
                        } finally {
                            router.refresh();
                        }
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