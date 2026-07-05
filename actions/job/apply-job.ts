"use server";

import { Prisma } from "@prisma/client";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth/authOptions";
import { db } from "@/lib/db";
import { uploadToCloudinary } from "@/lib/upload/upload";

import type { ResumeData } from "@/types/easyApply";
import type { JobQuestionAnswer } from "@/types/application";

interface ApplyForJobParams {
  jobId: number;
  candidateEmail: string;
  candidateMobile: string;
  resume: ResumeData;
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
      return {
        error: "Unauthorized",
      };
    }

    if (session.user.role === "ORGANIZATION") {
      return {
        error: "Organizations cannot apply for jobs.",
      };
    }

    const job = await db.job.findUnique({
      where: {
        id: jobId,
      },
      select: {
        id: true,
      },
    });

    if (!job) {
      return {
        error: "Job not found.",
      };
    }

    const existingApplication =
      await db.jobApplication.findFirst({
        where: {
          userId: session.user.id,
          jobId,
        },
        select: {
          id: true,
        },
      });

    if (existingApplication) {
      return {
        error: "You have already applied for this job.",
      };
    }

    let resumeUrl = resume.url;
    let resumePublicId = resume.publicId;

    if (resume.file) {
      const buffer = Buffer.from(
        await resume.file.arrayBuffer()
      );

      const uploaded = await uploadToCloudinary(
        buffer,
        "jobify"
      );

      resumeUrl = uploaded.url;
      resumePublicId = uploaded.publicId;
    }

    await db.jobApplication.create({
      data: {
        userId: session.user.id,
        jobId,

        candidateEmail,
        candidateMobile,

        candidateResume: resumeUrl,
        candidateResumePublicId: resumePublicId,

        questionAndAnswers: questionAndAnswers as unknown as Prisma.InputJsonValue,
      },
    });

    return {
      success: "Application submitted successfully.",
    };
  } catch (error) {
    console.error("[APPLY_FOR_JOB]", error);

    return {
      error: "Failed to submit application.",
    };
  }
}