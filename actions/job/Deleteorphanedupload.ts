"use server";

import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth/authOptions";
import { db } from "@/lib/db";
import cloudinary from "@/lib/upload/cloudinary";


export const deleteOrphanedUpload = async (publicId: string): Promise<void> => {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || !publicId) return;

    const userId = Number(session.user.id);
    if (!userId) return;

    const [isProfileResume, isUsedInApplication] = await Promise.all([
      db.user.findFirst({
        where: { id: userId, resumePublicId: publicId },
        select: { id: true },
      }),
      db.jobApplication.findFirst({
        where: { userId, candidateResumePublicId: publicId },
        select: { id: true },
      }),
    ]);

    if (isProfileResume || isUsedInApplication) return;

    await cloudinary.uploader.destroy(publicId, { resource_type: "raw" });
  } catch (error) {
    console.error("[DELETE_ORPHANED_UPLOAD]", error);
  }
};