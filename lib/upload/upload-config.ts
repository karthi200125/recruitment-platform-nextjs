import {
    UploadType,
    UploadTypeConfig,
} from "./upload-types";

const IMAGE_MIME_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
];

const CHAT_IMAGE_MIME_TYPES = [
    ...IMAGE_MIME_TYPES,
    "image/gif",
];

export const UPLOAD_CONFIG: Record<
    UploadType,
    UploadTypeConfig
> = {
    "profile-image": {
        title: "Upload Profile Photo",
        helperText:
            "JPG, PNG or WebP • Max size 5 MB",

        dropzoneLabel:
            "Drag & drop your image here",

        submitLabel: "Upload Photo",

        acceptedMimeTypes:
            IMAGE_MIME_TYPES,

        acceptedExtensionLabels: [
            "JPG",
            "PNG",
            "WebP",
        ],

        maxSizeBytes:
            5 * 1024 * 1024,

        maxSizeLabel: "5 MB",

        kind: "image",

        folder:
            "jobportal/users/profile",

        resourceType: "image",

        recommendedDimensions:
            "400 × 400",

        square: true,
    },

    "profile-banner": {
        title:
            "Upload Profile Banner",

        helperText:
            "JPG, PNG or WebP • Max size 8 MB",

        dropzoneLabel:
            "Drag & drop your banner here",

        submitLabel:
            "Upload Banner",

        acceptedMimeTypes:
            IMAGE_MIME_TYPES,

        acceptedExtensionLabels: [
            "JPG",
            "PNG",
            "WebP",
        ],

        maxSizeBytes:
            8 * 1024 * 1024,

        maxSizeLabel: "8 MB",

        kind: "image",

        folder:
            "jobportal/users/banner",

        resourceType: "image",

        recommendedDimensions:
            "1500 × 500",

        square: false,
    },

    "company-logo": {
        title:
            "Upload Company Logo",

        helperText:
            "JPG, PNG or WebP • Max size 5 MB",

        dropzoneLabel:
            "Drag & drop your logo here",

        submitLabel:
            "Upload Logo",

        acceptedMimeTypes:
            IMAGE_MIME_TYPES,

        acceptedExtensionLabels: [
            "JPG",
            "PNG",
            "WebP",
        ],

        maxSizeBytes:
            5 * 1024 * 1024,

        maxSizeLabel: "5 MB",

        kind: "image",

        folder:
            "jobportal/company/logo",

        resourceType: "image",

        recommendedDimensions:
            "400 × 400",

        square: true,
    },

    "company-banner": {
        title:
            "Upload Company Banner",

        helperText:
            "JPG, PNG or WebP • Max size 8 MB",

        dropzoneLabel:
            "Drag & drop your banner here",

        submitLabel:
            "Upload Banner",

        acceptedMimeTypes:
            IMAGE_MIME_TYPES,

        acceptedExtensionLabels: [
            "JPG",
            "PNG",
            "WebP",
        ],

        maxSizeBytes:
            8 * 1024 * 1024,

        maxSizeLabel: "8 MB",

        kind: "image",

        folder:
            "jobportal/company/banner",

        resourceType: "image",

        recommendedDimensions:
            "1500 × 500",

        square: false,
    },

    "project-image": {
        title:
            "Upload Project Image",

        helperText:
            "JPG, PNG or WebP • Max size 5 MB",

        dropzoneLabel:
            "Drag & drop your project image here",

        submitLabel:
            "Upload Image",

        acceptedMimeTypes:
            IMAGE_MIME_TYPES,

        acceptedExtensionLabels: [
            "JPG",
            "PNG",
            "WebP",
        ],

        maxSizeBytes:
            5 * 1024 * 1024,

        maxSizeLabel: "5 MB",

        kind: "image",

        folder:
            "jobportal/projects",

        resourceType: "image",
    },

    resume: {
        title:
            "Upload Resume",

        helperText:
            "PDF only • Max size 5 MB",

        dropzoneLabel:
            "Drag & drop your resume here",

        dropzoneSubtext:
            "PDF only",

        submitLabel:
            "Upload Resume",

        acceptedMimeTypes: [
            "application/pdf",
        ],

        acceptedExtensionLabels: [
            "PDF",
        ],

        maxSizeBytes:
            5 * 1024 * 1024,

        maxSizeLabel: "5 MB",

        kind: "pdf",

        folder:
            "jobportal/resumes",

        resourceType: "raw",
    },

    "candidate-resume": {
        title:
            "Upload Resume",

        helperText:
            "PDF only • Max size 5 MB",

        dropzoneLabel:
            "Drag & drop your resume here",

        dropzoneSubtext:
            "PDF only",

        submitLabel:
            "Upload Resume",

        acceptedMimeTypes: [
            "application/pdf",
        ],

        acceptedExtensionLabels: [
            "PDF",
        ],

        maxSizeBytes:
            5 * 1024 * 1024,

        maxSizeLabel: "5 MB",

        kind: "pdf",

        folder:
            "jobportal/job-applications/resumes",

        resourceType: "raw",
    },

    "chat-image": {
        title:
            "Send Image",

        helperText:
            "JPG, PNG, WebP or GIF • Max size 10 MB",

        dropzoneLabel:
            "Drag & drop your image here",

        submitLabel:
            "Send Image",

        acceptedMimeTypes:
            CHAT_IMAGE_MIME_TYPES,

        acceptedExtensionLabels: [
            "JPG",
            "PNG",
            "WEBP",
            "GIF",
        ],

        maxSizeBytes:
            10 * 1024 * 1024,

        maxSizeLabel: "10 MB",

        kind: "image",

        folder:
            "jobportal/chat/images",

        resourceType: "image",
    },

    "chat-file": {
        title:
            "Send File",

        helperText:
            "PDF, DOCX, ZIP or TXT • Max size 25 MB",

        dropzoneLabel:
            "Drag & drop your file here",

        submitLabel:
            "Send File",

        acceptedMimeTypes: [
            "application/pdf",
            "application/zip",
            "application/x-zip-compressed",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "text/plain",
        ],

        acceptedExtensionLabels: [
            "PDF",
            "DOCX",
            "ZIP",
            "TXT",
        ],

        maxSizeBytes:
            25 * 1024 * 1024,

        maxSizeLabel: "25 MB",

        kind: "file",

        folder:
            "jobportal/chat/files",

        resourceType: "raw",
    },
};

export const getUploadConfig = (
    type: UploadType
) => UPLOAD_CONFIG[type];