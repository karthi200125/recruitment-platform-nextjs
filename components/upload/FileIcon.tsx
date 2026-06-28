"use client";

import {
    AlertTriangle,
    CheckCircle,
    CheckCircle2,
    CloudUpload,
    File,
    FileImage,
    FileText,
    Folder,
    Lock,
    X,
} from "lucide-react";

interface IconProps {
    className?: string;
}

export const CloudUploadIcon = ({
    className,
}: IconProps) => (
    <CloudUpload
        className={className}
        strokeWidth={1.8}
    />
);

export const DocumentUploadIcon = ({
    className,
}: IconProps) => (
    <FileText
        className={className}
        strokeWidth={1.8}
    />
);

export const FolderIcon = ({
    className,
}: IconProps) => (
    <Folder
        className={className}
        strokeWidth={1.8}
    />
);

export const AlertIcon = ({
    className,
}: IconProps) => (
    <AlertTriangle
        className={className}
        strokeWidth={1.8}
    />
);

export const LockIcon = ({
    className,
}: IconProps) => (
    <Lock
        className={className}
        strokeWidth={1.8}
    />
);

export const CloseIcon = ({
    className,
}: IconProps) => (
    <X
        className={className}
        strokeWidth={2}
    />
);

export const CheckCircleIcon = ({
    className,
}: IconProps) => (
    <CheckCircle
        className={className}
        strokeWidth={2}
    />
);

export const CheckCircleSoftIcon = ({
    className,
}: IconProps) => (
    <CheckCircle2
        className={className}
        strokeWidth={2}
    />
);

export const PdfFileIcon = ({
    className,
}: IconProps) => (
    <FileText
        className={className}
        strokeWidth={1.8}
    />
);

export const GenericFileIcon = ({
    className,
}: IconProps) => (
    <File
        className={className}
        strokeWidth={1.8}
    />
);

export const ImageFileIcon = ({
    className,
}: IconProps) => (
    <FileImage
        className={className}
        strokeWidth={1.8}
    />
);