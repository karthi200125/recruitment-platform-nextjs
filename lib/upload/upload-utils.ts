import {
    ImageDimensions,
    UploadTypeConfig,
    ValidationResult,
} from "./upload-types";

export function formatFileSize(
    bytes: number
): string {
    if (bytes === 0) return "0 B";

    const units = [
        "B",
        "KB",
        "MB",
        "GB",
    ];

    const exponent = Math.min(
        Math.floor(
            Math.log(bytes) /
            Math.log(1024)
        ),
        units.length - 1
    );

    const value =
        bytes /
        Math.pow(1024, exponent);

    return `${value.toFixed(
        exponent === 0 ? 0 : 2
    )} ${units[exponent]}`;
}

export function getFileExtension(
    fileName: string
): string {
    const extension =
        fileName.split(".").pop();

    return extension
        ? extension.toUpperCase()
        : "FILE";
}

export function truncateFileName(
    fileName: string,
    maxLength = 30
): string {
    if (
        fileName.length <= maxLength
    ) {
        return fileName;
    }

    const extension =
        fileName.split(".").pop();

    const name =
        fileName.substring(
            0,
            fileName.lastIndexOf(".")
        );

    const truncated =
        name.substring(
            0,
            maxLength
        );

    return extension
        ? `${truncated}....${extension}`
        : `${truncated}...`;
}

export function validateFile(
    file: File,
    config: UploadTypeConfig
): ValidationResult {
    if (
        !config.acceptedMimeTypes.includes(
            file.type
        )
    ) {
        return {
            valid: false,
            errorCode:
                "INVALID_TYPE",
            message: `Supported formats: ${config.acceptedExtensionLabels.join(
                ", "
            )}`,
        };
    }

    if (
        file.size >
        config.maxSizeBytes
    ) {
        return {
            valid: false,
            errorCode:
                "TOO_LARGE",
            message: `Maximum file size is ${config.maxSizeLabel}.`,
        };
    }

    return {
        valid: true,
    };
}

export function validateFileList(
    files: File[],
    config: UploadTypeConfig
): ValidationResult {
    if (files.length > 1) {
        return {
            valid: false,
            errorCode:
                "MULTIPLE_FILES",
            message:
                "Only one file can be uploaded.",
        };
    }

    if (!files.length) {
        return {
            valid: true,
        };
    }

    return validateFile(
        files[0],
        config
    );
}

export function readImageDimensions(
    file: File
): Promise<ImageDimensions> {
    return new Promise(
        (
            resolve,
            reject
        ) => {
            const url =
                URL.createObjectURL(
                    file
                );

            const image =
                new Image();

            image.onload = () => {
                resolve({
                    width:
                        image.naturalWidth,
                    height:
                        image.naturalHeight,
                });

                URL.revokeObjectURL(
                    url
                );
            };

            image.onerror = () => {
                URL.revokeObjectURL(
                    url
                );

                reject(
                    new Error(
                        "Unable to read image."
                    )
                );
            };

            image.src = url;
        }
    );
}