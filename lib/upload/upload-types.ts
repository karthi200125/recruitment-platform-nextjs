export const UPLOAD_TYPES = {
    PROFILE_IMAGE: "profile-image",
    PROFILE_BANNER: "profile-banner",
    COMPANY_LOGO: "company-logo",
    COMPANY_BANNER: "company-banner",
    PROJECT_IMAGE: "project-image",
    RESUME: "resume",
    CANDIDATE_RESUME: "candidate-resume",
    CHAT_IMAGE: "chat-image",
    CHAT_FILE: "chat-file",
} as const;

export type UploadType =
    (typeof UPLOAD_TYPES)[keyof typeof UPLOAD_TYPES];

export type UploadKind =
    | "image"
    | "pdf"
    | "file";

export type UploadResourceType =
    | "image"
    | "raw"
    | "auto";

export interface UploadTypeConfig {
    title: string;
    helperText: string;

    dropzoneLabel: string;
    dropzoneSubtext?: string;

    submitLabel: string;

    acceptedMimeTypes: string[];
    acceptedExtensionLabels: string[];

    maxSizeBytes: number;
    maxSizeLabel: string;

    kind: UploadKind;

    folder: string;
    resourceType: UploadResourceType;

    recommendedDimensions?: string;
    square?: boolean;
}

export interface ValidationResult {
    valid: boolean;
    errorCode?:
        | "INVALID_TYPE"
        | "TOO_LARGE"
        | "MULTIPLE_FILES";

    message?: string;
}

export interface ImageDimensions {
    width: number;
    height: number;
}