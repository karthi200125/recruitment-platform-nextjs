import { NextRequest, NextResponse } from "next/server";
import { uploadToCloudinary, deleteFromCloudinary } from "@/lib/upload";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

type UploadType =
  | "profile"
  | "companyLogo"
  | "companyBanner"
  | "resume"
  | "projectImage"
  | "chatImage";

export async function POST(req: NextRequest) {
  try {
    // ✅ AUTH (MANDATORY)
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();

    const file = formData.get("file") as File | null;
    const type = formData.get("type") as UploadType | null;

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

    // ✅ TYPE-SPECIFIC VALIDATION
    const typeValidation: Record<UploadType, string[]> = {
      profile: ["image/jpeg", "image/png", "image/webp"],
      companyLogo: ["image/jpeg", "image/png", "image/webp"],
      companyBanner: ["image/jpeg", "image/png", "image/webp"],
      projectImage: ["image/jpeg", "image/png", "image/webp"],
      chatImage: ["image/jpeg", "image/png", "image/webp"],
      resume: ["application/pdf"],
    };

    if (!typeValidation[type].includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type" },
        { status: 400 }
      );
    }

    // ✅ SIZE VALIDATION
    const maxSize = 3 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File too large" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const folderMap: Record<UploadType, string> = {
      profile: "job-board/users",
      companyLogo: "job-board/companies/logo",
      companyBanner: "job-board/companies/banner",
      resume: "job-board/resumes",
      projectImage: "job-board/projects",
      chatImage: "job-board/chats",
    };

    const uploaded = await uploadToCloudinary(buffer, folderMap[type]);

    try {
      const userId = Number(session.user.id);

      switch (type) {
        case "profile": {
          const user = await db.user.findUnique({ where: { id: userId } });

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

          if (!company || company.userId !== userId) {
            return NextResponse.json(
              { error: "Forbidden" },
              { status: 403 }
            );
          }

          if (company.companyImagePublicId) {
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

          if (!company || company.userId !== userId) {
            return NextResponse.json(
              { error: "Forbidden" },
              { status: 403 }
            );
          }

          if (company.companyBackImagePublicId) {
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
          const user = await db.user.findUnique({ where: { id: userId } });

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

          if (!project || project.userId !== userId) {
            return NextResponse.json(
              { error: "Forbidden" },
              { status: 403 }
            );
          }

          if (project.proImagePublicId) {
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

        case "chatImage":
          break;
      }
    } catch (err) {
      // ✅ CLEANUP ON FAILURE
      await deleteFromCloudinary(uploaded.publicId);
      throw err;
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