"use server";

import { ApplicationStatus, Role } from "@prisma/client";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

import { authOptions } from "@/lib/authentication/authOptions";
import { db } from "@/lib/db";
import { buildJobOwnershipFilter } from "../dashboard/utils/buildOwnershipFilter";

const STATUS_TIMESTAMP_FIELD: Partial<Record<ApplicationStatus, string>> = {
  VIEWED: "viewedAt",
  SHORTLISTED: "shortlistedAt",
  INTERVIEW_SCHEDULED: "interviewScheduledAt",
  INTERVIEWED: "interviewedAt",
  HIRED: "hiredAt",
  REJECTED: "rejectedAt",
  WITHDRAWN: "withdrawnAt",
};

export const resolveCompanyId = async (userId: number, role: Role): Promise<number | null> => {
  if (role !== "ORGANIZATION") return null;
  const company = await db.company.findUnique({ where: { userId }, select: { id: true } });
  return company?.id ?? null;
};

export const setApplicationStatus = async (applicationId: number, newStatus: ApplicationStatus): Promise<void> => {
  const timestampField = STATUS_TIMESTAMP_FIELD[newStatus];

  await db.$transaction([
    db.jobApplication.update({
      where: { id: applicationId },
      data: {
        status: newStatus,
        ...(timestampField && { [timestampField]: new Date() }),
      },
    }),
    db.applicationStatusHistory.create({
      data: { applicationId, status: newStatus },
    }),
  ]);
};

interface UpdateResult {
  success?: string;
  error?: string;
}

export const updateApplicationStatus = async (
  applicationId: number,
  newStatus: ApplicationStatus
): Promise<UpdateResult> => {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return { error: "Unauthorized" };
    }

    const userId = Number(session.user.id);
    const role = (session.user.role as Role | null) ?? Role.CANDIDATE;

    if (role !== "RECRUITER" && role !== "ORGANIZATION") {
      return { error: "Only recruiters or organizations can update application status." };
    }

    const companyId = await resolveCompanyId(userId, role);
    const ownershipFilter = buildJobOwnershipFilter({ userId, role, companyId });

    const application = await db.jobApplication.findFirst({
      where: { id: applicationId, job: ownershipFilter },
      select: { id: true, status: true },
    });

    if (!application) {
      return { error: "Application not found or you don't have access to it." };
    }

    if (application.status === newStatus) {
      return { success: "No change." };
    }

    await setApplicationStatus(applicationId, newStatus);

    revalidatePath("/dashboard", "layout");

    return { success: "Status updated." };
  } catch (error) {
    console.error("[UPDATE_APPLICATION_STATUS]", error);
    return { error: "Failed to update status." };
  }
};