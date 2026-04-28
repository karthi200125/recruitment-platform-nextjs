// /lib/upload.ts
import cloudinary from "./cloudinary";

export type UploadResult = {
  url: string;
  publicId: string;
};

export const uploadToCloudinary = async (
  buffer: Buffer,
  folder: string
): Promise<UploadResult> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error || !result) {
          return reject(error || new Error("Upload failed"));
        }

        resolve({
          url: result.secure_url,
          publicId: result.public_id,
        });
      }
    );

    stream.end(buffer);
  });
};

export const deleteFromCloudinary = async (
  publicId: string
): Promise<void> => {
  await cloudinary.uploader.destroy(publicId);
};