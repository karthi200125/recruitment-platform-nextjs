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

const MB = 1024 * 1024;

const UPLOAD_TYPE_CONFIGS: Record<UploadType, UploadTypeConfig> = {
    [UPLOAD_TYPES.PROFILE_IMAGE]: {
        title: "Profile Image",
        helperText: "PNG, JPG or WEBP up to 5 MB.",
        dropzoneLabel: "Upload profile image",
        dropzoneSubtext: "Drag & drop or browse",
        submitLabel: "Upload",
        acceptedMimeTypes: [
            "image/png",
            "image/jpeg",
            "image/webp",
        ],
        acceptedExtensionLabels: ["PNG", "JPG", "JPEG", "WEBP"],
        maxSizeBytes: 5 * MB,
        maxSizeLabel: "5 MB",
        kind: "image",
        folder: "profile-images",
        resourceType: "image",
        square: true,
    },

    [UPLOAD_TYPES.PROFILE_BANNER]: {
        title: "Profile Banner",
        helperText: "PNG, JPG or WEBP up to 10 MB.",
        dropzoneLabel: "Upload profile banner",
        dropzoneSubtext: "Drag & drop or browse",
        submitLabel: "Upload",
        acceptedMimeTypes: [
            "image/png",
            "image/jpeg",
            "image/webp",
        ],
        acceptedExtensionLabels: ["PNG", "JPG", "JPEG", "WEBP"],
        maxSizeBytes: 10 * MB,
        maxSizeLabel: "10 MB",
        kind: "image",
        folder: "profile-banners",
        resourceType: "image",
    },

    [UPLOAD_TYPES.COMPANY_LOGO]: {
        title: "Company Logo",
        helperText: "PNG, JPG or WEBP up to 5 MB.",
        dropzoneLabel: "Upload company logo",
        dropzoneSubtext: "Drag & drop or browse",
        submitLabel: "Upload",
        acceptedMimeTypes: [
            "image/png",
            "image/jpeg",
            "image/webp",
        ],
        acceptedExtensionLabels: ["PNG", "JPG", "JPEG", "WEBP"],
        maxSizeBytes: 5 * MB,
        maxSizeLabel: "5 MB",
        kind: "image",
        folder: "company-logos",
        resourceType: "image",
        square: true,
    },

    [UPLOAD_TYPES.COMPANY_BANNER]: {
        title: "Company Banner",
        helperText: "PNG, JPG or WEBP up to 10 MB.",
        dropzoneLabel: "Upload company banner",
        dropzoneSubtext: "Drag & drop or browse",
        submitLabel: "Upload",
        acceptedMimeTypes: [
            "image/png",
            "image/jpeg",
            "image/webp",
        ],
        acceptedExtensionLabels: ["PNG", "JPG", "JPEG", "WEBP"],
        maxSizeBytes: 10 * MB,
        maxSizeLabel: "10 MB",
        kind: "image",
        folder: "company-banners",
        resourceType: "image",
    },

    [UPLOAD_TYPES.PROJECT_IMAGE]: {
        title: "Project Image",
        helperText: "PNG, JPG or WEBP up to 5 MB.",
        dropzoneLabel: "Upload project image",
        dropzoneSubtext: "Drag & drop or browse",
        submitLabel: "Upload",
        acceptedMimeTypes: [
            "image/png",
            "image/jpeg",
            "image/webp",
        ],
        acceptedExtensionLabels: ["PNG", "JPG", "JPEG", "WEBP"],
        maxSizeBytes: 5 * MB,
        maxSizeLabel: "5 MB",
        kind: "image",
        folder: "project-images",
        resourceType: "image",
    },

    [UPLOAD_TYPES.RESUME]: {
        title: "Resume",
        helperText: "PDF only up to 10 MB.",
        dropzoneLabel: "Upload resume",
        dropzoneSubtext: "Drag & drop or browse",
        submitLabel: "Upload",
        acceptedMimeTypes: [
            "application/pdf",
        ],
        acceptedExtensionLabels: ["PDF"],
        maxSizeBytes: 10 * MB,
        maxSizeLabel: "10 MB",
        kind: "pdf",
        folder: "resumes",
        resourceType: "raw",
    },

    [UPLOAD_TYPES.CANDIDATE_RESUME]: {
        title: "Candidate Resume",
        helperText: "PDF only up to 10 MB.",
        dropzoneLabel: "Upload resume",
        dropzoneSubtext: "Drag & drop or browse",
        submitLabel: "Upload",
        acceptedMimeTypes: [
            "application/pdf",
        ],
        acceptedExtensionLabels: ["PDF"],
        maxSizeBytes: 10 * MB,
        maxSizeLabel: "10 MB",
        kind: "pdf",
        folder: "candidate-resumes",
        resourceType: "raw",
    },

    [UPLOAD_TYPES.CHAT_IMAGE]: {
        title: "Chat Image",
        helperText: "PNG, JPG or WEBP up to 10 MB.",
        dropzoneLabel: "Upload image",
        dropzoneSubtext: "Drag & drop or browse",
        submitLabel: "Send",
        acceptedMimeTypes: [
            "image/png",
            "image/jpeg",
            "image/webp",
        ],
        acceptedExtensionLabels: ["PNG", "JPG", "JPEG", "WEBP"],
        maxSizeBytes: 10 * MB,
        maxSizeLabel: "10 MB",
        kind: "image",
        folder: "chat-images",
        resourceType: "image",
    },

    [UPLOAD_TYPES.CHAT_FILE]: {
        title: "Chat File",
        helperText: "Any file up to 20 MB.",
        dropzoneLabel: "Upload file",
        dropzoneSubtext: "Drag & drop or browse",
        submitLabel: "Send",
        acceptedMimeTypes: ["*/*"],
        acceptedExtensionLabels: ["Any"],
        maxSizeBytes: 20 * MB,
        maxSizeLabel: "20 MB",
        kind: "file",
        folder: "chat-files",
        resourceType: "auto",
    },
};

export function getUploadTypeConfig(
    type: UploadType
): UploadTypeConfig {
    return UPLOAD_TYPE_CONFIGS[type];
}