import { NextRequest, NextResponse } from "next/server";
import { uploadToCloudinary, deleteFromCloudinary } from "@/lib/upload/upload";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { getUploadConfig, parseUploadType } from "@/lib/upload/upload-config";
import type { Company, Project, JobApplication, User } from "@prisma/client";
import type { UploadType } from "@/lib/upload/upload-types";

const CLOUDINARY_FOLDER = "jobify";

function errorResponse(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

function successResponse(data: { url: string; publicId: string }) {
  return NextResponse.json({
    success: true,
    message: "Upload completed successfully.",
    data,
  });
}

async function deleteExistingAsset(publicId?: string | null): Promise<void> {
  if (!publicId) return;
  await deleteFromCloudinary(publicId);
}

function parseRequiredId(formData: FormData, field: string): number | null {
  const raw = formData.get(field);
  if (!raw) return null;
  const parsed = Number(raw);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

interface ResolvedTarget {
  user: User | null;
  company: Company | null;
  project: Project | null;
  application: JobApplication | null;
}

async function resolveTarget(
  type: UploadType,
  userId: number,
  formData: FormData
): Promise<ResolvedTarget | NextResponse> {
  switch (type) {
    case "profile-image":
    case "profile-banner":
    case "resume": {
      const user = await db.user.findUnique({ where: { id: userId } });
      if (!user) return errorResponse("User not found", 404);
      return { user, company: null, project: null, application: null };
    }

    case "company-logo":
    case "company-banner":
    //    {
    //   const companyId = parseRequiredId(formData, "companyId");
    //   if (!companyId) return errorResponse("Company id is required.", 400);

    //   const company = await db.company.findUnique({ where: { id: companyId } });
    //   if (!company || company.userId !== userId) {
    //     return errorResponse("Forbidden", 403);
    //   }
    //   return { user: null, company, project: null, application: null };
    // }

    case "project-image": {
      const projectId = parseRequiredId(formData, "projectId");

      if (!projectId) {
        return {
          user: null,
          company: null,
          project: null,
          application: null,
        };
      }

      const project = await db.project.findUnique({
        where: { id: projectId },
      });

      if (!project || project.userId !== userId) {
        return errorResponse("Forbidden", 403);
      }

      return {
        user: null,
        company: null,
        project,
        application: null,
      };
    }

    case "candidate-resume": {
      const applicationId = parseRequiredId(formData, "applicationId");
      if (!applicationId) {
        return errorResponse("Application id is required.", 400);
      }

      const application = await db.jobApplication.findUnique({
        where: { id: applicationId },
      });
      if (!application || application.userId !== userId) {
        return errorResponse("Forbidden", 403);
      }
      return { user: null, company: null, project: null, application };
    }

    case "chat-image":
    case "chat-file":
      return { user: null, company: null, project: null, application: null };
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return errorResponse("Unauthorized", 401);
    }

    const userId = session.user.id;

    const formData = await req.formData();

    const file = formData.get("file") as File | null;
    const type = parseUploadType(formData.get("type"));

    if (!file) {
      return errorResponse("File is required.", 400);
    }

    if (!type) {
      return errorResponse("Invalid or missing upload type.", 400);
    }

    const config = getUploadConfig(type);

    if (!config.acceptedMimeTypes.includes(file.type)) {
      return errorResponse(
        `Unsupported file type. Accepted: ${config.acceptedExtensionLabels.join(", ")}.`,
        400
      );
    }

    if (file.size > config.maxSizeBytes) {
      return errorResponse(
        `File is too large. Maximum size is ${config.maxSizeLabel}.`,
        400
      );
    }

    const target = await resolveTarget(type, userId, formData);
    if (target instanceof NextResponse) {
      return target;
    }
    const { user, company, project, application } = target;

    const buffer = Buffer.from(await file.arrayBuffer());
    const uploaded = await uploadToCloudinary(buffer, CLOUDINARY_FOLDER);

    try {
      switch (type) {
        case "profile-image": {
          await deleteExistingAsset(user?.profileImagePublicId);

          await db.user.update({
            where: { id: userId },
            data: {
              profileImage: uploaded.url,
              profileImagePublicId: uploaded.publicId,
            },
          });
          break;
        }

        case "profile-banner": {
          await deleteExistingAsset(user?.userImagePublicId);

          await db.user.update({
            where: { id: userId },
            data: {
              userImage: uploaded.url,
              userImagePublicId: uploaded.publicId,
            },
          });
          break;
        }

        case "company-logo": {
          // await deleteExistingAsset(company?.companyImagePublicId);

          // await db.company.update({
          //   where: { id: company!.id },
          //   data: {
          //     companyImage: uploaded.url,
          //     companyImagePublicId: uploaded.publicId,
          //   },
          // });
          break;
        }

        case "company-banner": {
          await deleteExistingAsset(company?.companyBackImagePublicId);

          await db.company.update({
            where: { id: company!.id },
            data: {
              companyBackImage: uploaded.url,
              companyBackImagePublicId: uploaded.publicId,
            },
          });
          break;
        }

        case "project-image": {
          if (project) {
            await deleteExistingAsset(project.proImagePublicId);

            await db.project.update({
              where: {
                id: project.id,
              },
              data: {
                proImage: uploaded.url,
                proImagePublicId: uploaded.publicId,
              },
            });
          }

          break;
        }

        case "resume": {
          await deleteExistingAsset(user?.resumePublicId);

          await db.user.update({
            where: { id: userId },
            data: {
              resume: uploaded.url,
              resumePublicId: uploaded.publicId,
            },
          });
          break;
        }

        case "candidate-resume": {
          // await deleteExistingAsset(application?.candidateResumePublicId);

          // await db.jobApplication.update({
          //   where: { id: application!.id },
          //   data: {
          //     candidateResume: uploaded.url,
          //     candidateResumePublicId: uploaded.publicId,
          //   },
          // });
          break;
        }

        case "chat-image":
        case "chat-file":
          break;
      }
    } catch (err) {
      await deleteFromCloudinary(uploaded.publicId);
      throw err;
    }

    return successResponse({ url: uploaded.url, publicId: uploaded.publicId });
  } catch (error) {
    console.error("[UPLOAD_ROUTE]", error);
    return errorResponse("Upload failed", 500);
  }
}