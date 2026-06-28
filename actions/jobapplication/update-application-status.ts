"use server";

import { Prisma } from "@prisma/client";

import { db } from "@/lib/db";
import { UpdatableApplicationStatus } from "@/types";

interface UpdateApplicationStatusResponse {
  success?: boolean;
  error?: string;
}

export async function updateApplicationStatus(
  applicationId: number,
  status: UpdatableApplicationStatus
): Promise<UpdateApplicationStatusResponse> {
  try {
    const data: Prisma.JobApplicationUpdateInput = {
      status,
    };

    switch (status) {
      case "VIEWED":
        data.viewedAt = new Date();
        break;

      case "UNDER_REVIEW":
        break;

      case "SHORTLISTED":
        data.shortlistedAt = new Date();
        break;

      case "INTERVIEW_SCHEDULED":
        break;

      case "INTERVIEWED":
        break;

      case "HIRED":
        break;

      case "REJECTED":
        data.rejectedAt = new Date();
        break;
    }

    await db.jobApplication.update({
      where: {
        id: applicationId,
      },
      data,
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error(
      "[UPDATE_APPLICATION_STATUS]",
      error
    );

    return {
      error:
        "Failed to update application status.",
    };
  }
}