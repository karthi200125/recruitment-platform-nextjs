"use client";

import type { Experience } from "@prisma/client";
import { useMemo, useState, useTransition } from "react";
import Image from "next/image";
import { useDispatch } from "react-redux";
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Building2,
  MapPin,
  Calendar,
  ExternalLink,
  Briefcase,
} from "lucide-react";

import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useCustomToast } from "@/lib/CustomToast";
import { openModal } from "@/store/ModalSlice";

import { deleteExperience } from "@/actions/user/delete-experience";

import Model from "@/components/Model";
import { UserExperienceForm } from "@/components/forms/UserExperienceForm";

import noImage from "@/public/noImage.webp";

interface ExperiencesProps {
  experiences?: Experience[];
  profileUserId?: number;
  isLoading?: boolean;
}

function formatDateRange(
  startDate: string,
  endDate: string
): string {
  const start = startDate?.trim() ?? "";
  const end = endDate?.trim() ?? "";

  if (!start && !end) {
    return "";
  }

  if (!start) {
    return end;
  }

  if (!end) {
    return start;
  }

  return `${start} – ${end}`;
}

/**
 * Loading skeleton
 */
function ExperienceSkeleton() {
  return (
    <div className="space-y-6">
      {Array.from({ length: 2 }).map((_, index) => (
        <div
          key={index}
          className="flex gap-4 animate-pulse"
        >
          <div className="h-12 w-12 shrink-0 rounded-xl bg-slate-200" />

          <div className="min-w-0 flex-1 space-y-2 pt-1">
            <div className="h-4 w-1/2 rounded-lg bg-slate-200" />
            <div className="h-3 w-1/3 rounded-lg bg-slate-100" />
            <div className="h-3 w-1/4 rounded-lg bg-slate-100" />
            <div className="mt-2 h-3 w-full rounded bg-slate-100" />
            <div className="h-3 w-4/5 rounded bg-slate-100" />
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Empty state
 */
function EmptyState({
  isCurrentUser,
  onAdd,
}: {
  isCurrentUser: boolean;
  onAdd: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
        <Briefcase
          className="h-7 w-7 text-slate-400"
          strokeWidth={1.5}
        />
      </div>

      <div>
        <p className="mb-1 text-sm font-semibold text-slate-700">
          No experience added yet
        </p>

        <p className="max-w-xs text-xs leading-relaxed text-slate-400">
          {isCurrentUser
            ? "Add your work history to help recruiters understand your background."
            : "This user hasn't added any work experience yet."}
        </p>
      </div>

      {isCurrentUser && (
        <button
          type="button"
          onClick={onAdd}
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-indigo-200 transition-colors duration-200 hover:bg-indigo-500"
        >
          <Plus
            className="h-4 w-4"
            strokeWidth={2.5}
          />

          Add Experience
        </button>
      )}
    </div>
  );
}

/**
 * Single experience card
 */
function ExperienceCard({
  experience,
  isCurrentUser,
  onEdit,
  onDelete,
  isDeleting,
}: {
  experience: Experience;
  isCurrentUser: boolean;
  onEdit: (experience: Experience) => void;
  onDelete: (id: number) => void;
  isDeleting: boolean;
}) {
  const dateRange = formatDateRange(
    experience.startDate,
    experience.endDate
  );

  return (
    <div className="group flex gap-4">
      {/* Company logo */}
      <div className="mt-0.5 shrink-0">
        <div className="relative h-12 w-12 overflow-hidden rounded-xl border border-slate-200 bg-slate-50 shadow-sm">
          <Image
            src={noImage}
            alt={experience.companyName}
            fill
            sizes="48px"
            className="object-cover"
          />
        </div>
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="min-w-0">
            {/* Position */}
            <h4 className="text-sm font-bold leading-snug text-slate-800">
              {experience.position}
            </h4>

            {/* Company */}
            <div className="mt-0.5 flex flex-wrap items-center gap-1.5">
              <Building2
                className="h-3.5 w-3.5 shrink-0 text-slate-400"
                strokeWidth={2}
              />

              <span className="text-xs font-medium text-slate-600">
                {experience.companyName}
              </span>
            </div>
          </div>

          {/* Actions */}
          {isCurrentUser && (
            <div className="flex shrink-0 items-center gap-1.5 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
              <button
                type="button"
                onClick={() => onEdit(experience)}
                className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-colors duration-200 hover:bg-slate-100"
                aria-label="Edit experience"
              >
                <Pencil
                  className="h-3.5 w-3.5"
                  strokeWidth={2}
                />
              </button>

              <button
                type="button"
                onClick={() => onDelete(experience.id)}
                disabled={isDeleting}
                className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-all duration-200 hover:border-red-200 hover:bg-red-50 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Delete experience"
              >
                {isDeleting ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Trash2
                    className="h-3.5 w-3.5"
                    strokeWidth={2}
                  />
                )}
              </button>
            </div>
          )}
        </div>

        {/* Meta */}
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
          {dateRange && (
            <span className="flex items-center gap-1.5 text-xs text-slate-500">
              <Calendar
                className="h-3 w-3 shrink-0 text-slate-400"
                strokeWidth={2}
              />

              {dateRange}
            </span>
          )}

          {experience.companyName && (
            <span className="flex items-center gap-1.5 text-xs text-slate-500">
              <MapPin
                className="h-3 w-3 shrink-0 text-slate-400"
                strokeWidth={2}
              />

              {experience.companyName}
            </span>
          )}
        </div>

        {/* Description */}
        {experience.description && (
          <p className="mt-2.5 line-clamp-3 text-xs leading-relaxed text-slate-500">
            {experience.description}
          </p>
        )}
      </div>
    </div>
  );
}

/**
 * Main Experiences component
 */
const Experiences = ({
  experiences = [],
  profileUserId,
  isLoading = false,
}: ExperiencesProps) => {
  const { user } = useCurrentUser();

  const dispatch = useDispatch();

  const {
    showSuccessToast,
    showErrorToast,
  } = useCustomToast();

  const [selectedExperience, setSelectedExperience] =
    useState<Experience | null>(null);

  const [deletingId, setDeletingId] =
    useState<number | null>(null);

  const [isPending, startTransition] =
    useTransition();

  const isCurrentUser =
    user?.id === profileUserId;

  /**
   * Sort newest experience first.
   *
   * Since your database stores startDate as a string,
   * convert it to a timestamp when possible.
   */
  const sortedExperiences = useMemo(() => {
    return [...experiences].sort(
      (a, b) => {
        const dateA = Date.parse(
          a.startDate
        );

        const dateB = Date.parse(
          b.startDate
        );

        if (
          !Number.isNaN(dateA) &&
          !Number.isNaN(dateB)
        ) {
          return dateB - dateA;
        }

        return b.startDate.localeCompare(
          a.startDate
        );
      }
    );
  }, [experiences]);

  /**
   * Add experience
   */
  const openAdd = () => {
    setSelectedExperience(null);

    dispatch(
      openModal("experienceModal")
    );
  };

  /**
   * Edit experience
   */
  const openEdit = (
    experience: Experience
  ) => {
    setSelectedExperience(experience);

    dispatch(
      openModal("experienceModal")
    );
  };

  /**
   * Delete experience
   */
  const handleDelete = (id: number) => {
    setDeletingId(id);

    startTransition(async () => {
      try {
        const result =
          await deleteExperience(id);

        if (result?.success) {
          showSuccessToast(
            "Experience deleted"
          );
        } else {
          showErrorToast(
            result?.error ||
            "Failed to delete experience"
          );
        }
      } catch {
        showErrorToast(
          "Something went wrong"
        );
      } finally {
        setDeletingId(null);
      }
    });
  };

  return (
    <section className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4">
        <div className="flex items-center gap-2">
          <h3
            id="experiences-heading"
            className="font-bold text-neutral-900"
          >
            Experiences
          </h3>

          {!isLoading &&
            experiences.length > 0 && (
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-400">
                {experiences.length}
              </span>
            )}
        </div>

        {isCurrentUser && (
          <Model
            bodyContent={
              <UserExperienceForm
                experience={
                  selectedExperience
                }                
                edit={
                  !!selectedExperience
                }
              />
            }
            title={
              selectedExperience
                ? "Edit Experience"
                : "Add Experience"
            }
            className="lg:w-[700px]"
            modalId="experienceModal"
            triggerCls=""
          >
            <button
              type="button"
              onClick={openAdd}
              aria-label="Add experience"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-colors duration-200 hover:bg-slate-100"
            >
              <Plus
                className="h-4 w-4"
                strokeWidth={2.5}
              />
            </button>
          </Model>
        )}
      </div>

      {/* Body */}
      <div className="p-5">
        {isLoading ? (
          <ExperienceSkeleton />
        ) : sortedExperiences.length === 0 ? (
          <EmptyState
            isCurrentUser={
              isCurrentUser
            }
            onAdd={openAdd}
          />
        ) : (
          <div className="space-y-6">
            {sortedExperiences.map(
              (
                experience,
                index
              ) => (
                <div
                  key={
                    experience.id
                  }
                >
                  <ExperienceCard
                    experience={
                      experience
                    }
                    isCurrentUser={
                      isCurrentUser
                    }
                    onEdit={
                      openEdit
                    }
                    onDelete={
                      handleDelete
                    }
                    isDeleting={
                      deletingId ===
                      experience.id &&
                      isPending
                    }
                  />

                  {index <
                    sortedExperiences.length -
                    1 && (
                      <div className="mt-6 h-px bg-slate-100" />
                    )}
                </div>
              )
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default Experiences;