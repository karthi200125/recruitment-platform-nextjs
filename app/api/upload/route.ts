// /app/api/upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import { uploadToCloudinary, deleteFromCloudinary } from "@/lib/upload";
import { db } from "@/lib/db";

type UploadType =
  | "profile"
  | "companyLogo"
  | "companyBanner"
  | "resume"
  | "projectImage"
  | "chatImage";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const file = formData.get("file") as File | null;
    const type = formData.get("type") as UploadType | null;
    const userId = Number(formData.get("userId"));
    const companyId = formData.get("companyId")
      ? Number(formData.get("companyId"))
      : null;
    const projectId = formData.get("projectId")
      ? Number(formData.get("projectId"))
      : null;

    if (!file || !type) {
      return NextResponse.json(
        { error: "Missing file or type" },
        { status: 400 }
      );
    }

    // ✅ Validation
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "application/pdf",
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type" },
        { status: 400 }
      );
    }

    const maxSize = 3 * 1024 * 1024; // 3MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File too large" },
        { status: 400 }
      );
    }

    // 🔄 convert to buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // 📂 folder mapping
    const folderMap: Record<UploadType, string> = {
      profile: "job-board/users",
      companyLogo: "job-board/companies/logo",
      companyBanner: "job-board/companies/banner",
      resume: "job-board/resumes",
      projectImage: "job-board/projects",
      chatImage: "job-board/chats",
    };

    const folder = folderMap[type];

    // 🚀 upload
    const uploaded = await uploadToCloudinary(buffer, folder);

    // 🔥 DB updates
    switch (type) {
      case "profile": {
        if (!userId) break;

        const user = await db.user.findUnique({
          where: { id: userId },
        });

        if (user?.profileImagePublicId) {
          await deleteFromCloudinary(user.profileImagePublicId);
        }

        await db.user.update({
          where: { id: userId },
          data: {
            profileImage: uploaded.url,
            profileImagePublicId: uploaded.publicId,
          },
        });
        break;
      }

      case "companyLogo": {
        if (!companyId) break;

        const company = await db.company.findUnique({
          where: { id: companyId },
        });

        if (company?.companyImagePublicId) {
          await deleteFromCloudinary(company.companyImagePublicId);
        }

        await db.company.update({
          where: { id: companyId },
          data: {
            companyImage: uploaded.url,
            companyImagePublicId: uploaded.publicId,
          },
        });
        break;
      }

      case "companyBanner": {
        if (!companyId) break;

        const company = await db.company.findUnique({
          where: { id: companyId },
        });

        if (company?.companyBackImagePublicId) {
          await deleteFromCloudinary(company.companyBackImagePublicId);
        }

        await db.company.update({
          where: { id: companyId },
          data: {
            companyBackImage: uploaded.url,
            companyBackImagePublicId: uploaded.publicId,
          },
        });
        break;
      }

      case "resume": {
        if (!userId) break;

        const user = await db.user.findUnique({
          where: { id: userId },
        });

        if (user?.resumePublicId) {
          await deleteFromCloudinary(user.resumePublicId);
        }

        await db.user.update({
          where: { id: userId },
          data: {
            resume: uploaded.url,
            resumePublicId: uploaded.publicId,
          },
        });
        break;
      }

      case "projectImage": {
        if (!projectId) break;

        const project = await db.project.findUnique({
          where: { id: projectId },
        });

        if (project?.proImagePublicId) {
          await deleteFromCloudinary(project.proImagePublicId);
        }

        await db.project.update({
          where: { id: projectId },
          data: {
            proImage: uploaded.url,
            proImagePublicId: uploaded.publicId,
          },
        });
        break;
      }

      case "chatImage": {
        // handled when creating message
        break;
      }
    }

    return NextResponse.json({
      success: true,
      url: uploaded.url,
      publicId: uploaded.publicId,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    );
  }
}