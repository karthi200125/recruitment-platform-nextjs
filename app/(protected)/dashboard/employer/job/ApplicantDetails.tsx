"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  XCircle,
  FileText,
  MessageSquare,
  User,
  Loader2,
} from "lucide-react";
import { ApplicationStatus } from "@prisma/client";

import { updateApplicationStatus } from "@/actions/jobapplication/update-application-status";
import { getStatusConfig } from "./ApplicantList";

import {
  JobApplicationWithUser,
  JobQuestionAnswer,
} from "@/types";

interface ApplicantDetailsProps {
  application: JobApplicationWithUser | null;
}

function UserAvatar({
  name,
  image,
  size = "lg",
}: {
  name: string;
  image?: string | null;
  size?: "sm" | "lg";
}) {
  const initials = name
    .slice(0, 2)
    .toUpperCase();

  const sizeClass =
    size === "lg"
      ? "h-12 w-12 text-sm"
      : "h-9 w-9 text-xs";

  if (image) {
    return (
      <img
        src={image}
        alt={name}
        className={`${sizeClass} flex-shrink-0 rounded-full border border-slate-200 object-cover`}
      />
    );
  }

  return (
    <div
      className={`${sizeClass} flex flex-shrink-0 items-center justify-center rounded-full border border-indigo-100 bg-indigo-50 font-bold text-indigo-600`}
    >
      {initials}
    </div>
  );
}

export default function ApplicantDetails({
  application,
}: ApplicantDetailsProps) {
  const router = useRouter();

  const [loading, setLoading] =
    useState(false);

  const [localStatus, setLocalStatus] =
    useState<ApplicationStatus | null>(
      application?.status ?? null
    );

  useEffect(() => {
    setLocalStatus(
      application?.status ?? null
    );
  }, [application]);

  useEffect(() => {
    if (
      application &&
      application.status ===
      "APPLIED"
    ) {
      updateApplicationStatus(
        application.id,
        "VIEWED"
      )
        .then(() => {
          setLocalStatus(
            "VIEWED"
          );

          router.refresh();
        })
        .catch((error) =>
          console.error(
            "[AUTO_VIEW]",
            error
          )
        );
    }
  }, [application, router]);

  const handleUpdate = async (
    status: ApplicationStatus
  ) => {
    if (!application || loading)
      return;

    const previous =
      localStatus;

    try {
      setLoading(true);
      setLocalStatus(status);

      await updateApplicationStatus(
        application.id,
        status
      );

      router.refresh();
    } catch (error) {
      console.error(
        "[UPDATE_STATUS]",
        error
      );

      setLocalStatus(previous);
    } finally {
      setLoading(false);
    }
  };

  const qnaEntries = useMemo(() => {
    if (
      !application
        ?.questionAndAnswers
    ) {
      return [];
    }

    return Object.values(
      application.questionAndAnswers as any
    );
  }, [application]);

  if (!application || !localStatus) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 px-8 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
          <User
            className="h-7 w-7 text-slate-300"
            strokeWidth={
              1.5
            }
          />
        </div>

        <div>
          <p className="mb-1 text-base font-semibold text-slate-700">
            Select a
            candidate
          </p>

          <p className="max-w-xs text-sm leading-relaxed text-slate-400">
            Click any
            applicant on
            the left to
            review their
            profile and
            resume.
          </p>
        </div>
      </div>
    );
  }

  const config =
    getStatusConfig(
      localStatus
    );

  const StatusIcon =
    config.icon;

  return (
    <div className="max-w-2xl space-y-6 p-6 sm:p-8">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <UserAvatar
            name={
              application
                .user
                .username
            }
            image={
              application
                .user
                .userImage
            }
          />

          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {
                application
                  .user
                  .username
              }
            </h2>

            <p className="mt-0.5 text-sm text-slate-400">
              {
                application
                  .user
                  .email
              }
            </p>

            <span
              className={`mt-2 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${config.bg} ${config.text} ${config.border}`}
            >
              {loading ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <StatusIcon className="h-3.5 w-3.5" />
              )}

              {loading
                ? "Updating..."
                : config.label}
            </span>
          </div>
        </div>

        <div className="flex flex-shrink-0 items-center gap-2">
          <button
            onClick={() =>
              handleUpdate(
                "SHORTLISTED"
              )
            }
            disabled={
              loading ||
              localStatus ===
              "SHORTLISTED"
            }
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white transition-all hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            Shortlist
          </button>

          <button
            onClick={() =>
              handleUpdate(
                "REJECTED"
              )
            }
            disabled={
              loading ||
              localStatus ===
              "REJECTED"
            }
            className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-xs font-semibold text-red-600 transition-all hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <XCircle className="h-3.5 w-3.5" />
            Reject
          </button>
        </div>
      </div>

      <div className="h-px bg-slate-100" />

      {application.candidateResume ? (
        <div>
          <div className="mb-3 flex items-center gap-2">
            <FileText className="h-4 w-4 text-slate-500" />

            <h3 className="text-sm font-bold text-slate-800">
              Resume
            </h3>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200">
            <iframe
              src={
                application.candidateResume
              }
              title="Candidate Resume"
              className="h-[400px] w-full"
            />
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-5 py-6">
          <FileText className="h-5 w-5 text-slate-300" />

          <p className="text-sm text-slate-400">
            No resume
            uploaded by
            this
            candidate.
          </p>
        </div>
      )}

      {qnaEntries.length >
        0 && (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="flex items-center gap-2 border-b border-slate-100 px-5 py-4">
              <MessageSquare className="h-4 w-4 text-slate-500" />

              <h3 className="text-sm font-bold text-slate-800">
                Screening
                Answers
              </h3>

              <span className="ml-auto text-xs text-slate-400">
                {
                  qnaEntries.length
                }{" "}
                question
                {qnaEntries.length !==
                  1
                  ? "s"
                  : ""}
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {qnaEntries.map(
                (
                  item
                ) => (
                  <div
                    key={
                      item.id
                    }
                    className="px-5 py-4"
                  >
                    <p className="mb-1.5 text-xs font-semibold text-slate-700">
                      {
                        item.question
                      }
                    </p>

                    <p className="text-sm leading-relaxed text-slate-500">
                      {
                        item.answer
                      }
                    </p>
                  </div>
                )
              )}
            </div>
          </div>
        )}
    </div>
  );
}