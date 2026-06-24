"use server";

import { db } from "@/lib/db";

export async function updateApplicationStatus(
  applicationId: number,
  status: "VIEWED" | "SHORTLISTED" | "REJECTED"
) {
  const data: any = {
    status,
  };

  if (status === "VIEWED") data.viewedAt = new Date();
  if (status === "SHORTLISTED") data.shortlistedAt = new Date();
  if (status === "REJECTED") data.rejectedAt = new Date();

  await db.jobApplication.update({
    where: { id: applicationId },
    data,
  });

  return { success: true };
}