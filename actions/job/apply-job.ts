"use server";

import { Prisma } from "@prisma/client";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/authentication/authOptions";
import { db } from "@/lib/db";

import type { JobQuestionAnswer } from "@/types/application";

interface ApplyForJobResume {
  name: string;
  url: string;
  publicId: string;
}

interface ApplyForJobParams {
  jobId: number;
  candidateEmail: string;
  candidateMobile: string;
  resume: ApplyForJobResume;
  questionAndAnswers: JobQuestionAnswer;
}

export async function applyForJob({
  jobId,
  candidateEmail,
  candidateMobile,
  resume,
  questionAndAnswers,
}: ApplyForJobParams) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return { error: "Unauthorized" };
    }

    const userId = Number(session.user.id);

    if (!userId) {
      return { error: "Unauthorized" };
    }

    if (session.user.role === "ORGANIZATION") {
      return { error: "Organizations cannot apply for jobs." };
    }

    if (!resume.url) {
      return { error: "Please upload a resume before applying." };
    }

    const job = await db.job.findUnique({
      where: { id: jobId },
      select: { id: true },
    });

    if (!job) {
      return { error: "Job not found." };
    }

    const existingApplication = await db.jobApplication.findFirst({
      where: { userId, jobId },
      select: { id: true },
    });

    if (existingApplication) {
      return { error: "You have already applied for this job." };
    }

    await db.jobApplication.create({
      data: {
        userId,
        jobId,
        candidateEmail,
        candidateMobile,
        candidateResume: resume.url,
        candidateResumePublicId: resume.publicId,
        questionAndAnswers: questionAndAnswers as unknown as Prisma.InputJsonValue,
      },
    });

    return { success: "Application submitted successfully." };
  } catch (error) {
    console.error("[APPLY_FOR_JOB]", error);
    return { error: "Failed to submit application." };
  }
}