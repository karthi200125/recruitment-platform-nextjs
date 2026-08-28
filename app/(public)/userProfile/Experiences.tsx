"use client";

import { useState, useTransition, useMemo } from "react";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useCustomToast } from "@/lib/CustomToast";
import {
  Briefcase, Plus, Pencil, Trash2, Loader2,
  Building2, MapPin, Calendar, ExternalLink,
  GraduationCap
} from "lucide-react";
import noImage from "@/public/noImage.webp";
import { openModal } from "@/store/ModalSlice";
import { deleteExperience } from "@/actions/user/delete-experience";
import Model from "@/components/Model";
import { UserExperienceForm } from "@/components/forms/UserExperienceForm";

export interface Experience {
  id: number;
  title: string;
  companyName: string;
  companyImage?: string | null;
  companyUrl?: string | null;
  location?: string | null;
  locationType?: string | null;
  employmentType?: string | null;
  startMonth?: string | null;
  startYear?: string | null;
  endMonth?: string | null;
  endYear?: string | null;
  isCurrent?: boolean | null;
  description?: string | null;
}

interface ExperiencesProps {
  experiences?: Experience[];
  profileUserId?: number;
  isLoading?: boolean;
}

// ─── Location type badge ──────────────────────────────────────────────────────

const LOC_STYLES: Record<string, string> = {
  REMOTE: "bg-emerald-50 text-emerald-700 border-emerald-200",
  HYBRID: "bg-violet-50  text-violet-700  border-violet-200",
  ONSITE: "bg-amber-50   text-amber-700   border-amber-200",
  ON_SITE: "bg-amber-50   text-amber-700   border-amber-200",
};

// ─── Format date range ────────────────────────────────────────────────────────

function formatDateRange(
  startMonth?: string | null, startYear?: string | null,
  endMonth?: string | null, endYear?: string | null,
  isCurrent?: boolean | null
): string {
  const start = [startMonth, startYear].filter(Boolean).join(" ");
  const end = isCurrent ? "Present" : [endMonth, endYear].filter(Boolean).join(" ");
  if (!start && !end) return "";
  if (!start) return end;
  if (!end) return start;
  return `${start} – ${end}`;
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function ExperienceSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 2 }).map((_, i) => (
        <div key={i} className="flex gap-4 animate-pulse">
          <div className="w-12 h-12 rounded-xl bg-slate-200 flex-shrink-0" />
          <div className="flex-1 space-y-2 pt-1">
            <div className="h-4 w-1/2 rounded-lg bg-slate-200" />
            <div className="h-3 w-1/3 rounded-lg bg-slate-100" />
            <div className="h-3 w-1/4 rounded-lg bg-slate-100" />
            <div className="h-3 w-full rounded bg-slate-100 mt-2" />
            <div className="h-3 w-4/5 rounded bg-slate-100" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState({ isCurrentUser, onAdd }: { isCurrentUser: boolean; onAdd: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
      <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center">
        <GraduationCap className="w-7 h-7 text-slate-400" strokeWidth={1.5} />
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-700 mb-1">No experience added yet</p>
        <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
          {isCurrentUser
            ? "Add your work history to help recruiters understand your background."
            : "This user hasn't added any work experience yet."}
        </p>
      </div>
      {isCurrentUser && (
        <button
          onClick={onAdd}
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors duration-200 shadow-sm shadow-indigo-200"
        >
          <Plus className="w-4 h-4" strokeWidth={2.5} />
          Add Experience
        </button>
      )}
    </div>
  );
}

// ─── Single card ──────────────────────────────────────────────────────────────

function ExperienceCard({
  exp,
  isCurrentUser,
  onEdit,
  onDelete,
  isDeleting,
}: {
  exp: Experience;
  isCurrentUser: boolean;
  onEdit: (exp: Experience) => void;
  onDelete: (id: number) => void;
  isDeleting: boolean;
}) {
  const dateRange = formatDateRange(exp.startMonth, exp.startYear, exp.endMonth, exp.endYear, exp.isCurrent);
  const locTypeLower = (exp.locationType ?? "").toUpperCase();
  const locBadgeCls = LOC_STYLES[locTypeLower] ?? "bg-slate-50 text-slate-600 border-slate-200";

  return (
    <div className="group flex gap-4">
      {/* Company logo */}
      <div className="flex-shrink-0 mt-0.5">
        <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-slate-200 bg-slate-50 shadow-sm">
          <Image
            src={exp.companyImage || noImage}
            alt={exp.companyName}
            fill
            className="object-cover"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 flex-wrap">
          <div className="min-w-0">
            {/* Title */}
            <h4 className="text-sm font-bold text-slate-800 leading-snug">{exp.title}</h4>

            {/* Company + link */}
            <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
              <Building2 className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" strokeWidth={2} />
              {exp.companyUrl ? (
                <a
                  href={exp.companyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-indigo-600 font-medium hover:underline underline-offset-2 flex items-center gap-1"
                >
                  {exp.companyName}
                  <ExternalLink className="w-2.5 h-2.5" strokeWidth={2.5} />
                </a>
              ) : (
                <span className="text-xs text-slate-600 font-medium">{exp.companyName}</span>
              )}
              {exp.employmentType && (
                <>
                  <span className="text-slate-300 text-xs">·</span>
                  <span className="text-xs text-slate-500 capitalize">{exp.employmentType.replace(/_/g, " ").toLowerCase()}</span>
                </>
              )}
            </div>
          </div>

          {/* Actions */}
          {isCurrentUser && (
            <div className="flex items-center gap-1.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <button
                onClick={() => onEdit(exp)}
                className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors duration-200"
                aria-label="Edit experience"
              >
                <Pencil className="w-3.5 h-3.5" strokeWidth={2} />
              </button>
              <button
                onClick={() => onDelete(exp.id)}
                disabled={isDeleting}
                className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-red-50 hover:text-red-500 hover:border-red-200 disabled:opacity-40 transition-all duration-200"
                aria-label="Delete experience"
              >
                {isDeleting
                  ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  : <Trash2 className="w-3.5 h-3.5" strokeWidth={2} />
                }
              </button>
            </div>
          )}
        </div>

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2">
          {dateRange && (
            <span className="flex items-center gap-1.5 text-xs text-slate-500">
              <Calendar className="w-3 h-3 text-slate-400 flex-shrink-0" strokeWidth={2} />
              {dateRange}
            </span>
          )}
          {exp.isCurrent && (
            <span className="inline-flex items-center text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-2 py-0.5">
              Current
            </span>
          )}
          {exp.location && (
            <span className="flex items-center gap-1.5 text-xs text-slate-500">
              <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0" strokeWidth={2} />
              {exp.location}
            </span>
          )}
          {exp.locationType && (
            <span className={`inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-full border capitalize ${locBadgeCls}`}>
              {exp.locationType.toLowerCase().replace(/_/g, " ")}
            </span>
          )}
        </div>

        {/* Description */}
        {exp.description && (
          <p className="text-xs text-slate-500 leading-relaxed mt-2.5 line-clamp-3">
            {exp.description}
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

const Experiences = ({ experiences = [], profileUserId, isLoading = false }: ExperiencesProps) => {
  const { user } = useCurrentUser();
  const dispatch = useDispatch();
  const { showSuccessToast, showErrorToast } = useCustomToast();

  const [selectedExp, setSelectedExp] = useState<Experience | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();

  const isCurrentUser = user?.id === profileUserId;

  // Sort: current first, then by start year desc
  const sorted = useMemo(() => {
    return [...experiences].sort((a, b) => {
      if (a.isCurrent && !b.isCurrent) return -1;
      if (!a.isCurrent && b.isCurrent) return 1;
      return Number(b.startYear ?? 0) - Number(a.startYear ?? 0);
    });
  }, [experiences]);

  const openAdd = () => {
    setSelectedExp(null);
    dispatch(openModal("experienceModal"));
  };

  const openEdit = (exp: Experience) => {
    setSelectedExp(exp);
    dispatch(openModal("experienceModal"));
  };

  const handleDelete = (id: number) => {
    setDeletingId(id);
    startTransition(async () => {
      try {
        const res = await deleteExperience(id);
        if (res?.success) showSuccessToast("Experience deleted");
        else showErrorToast(res?.error || "Failed to delete experience");
      } catch {
        showErrorToast("Something went wrong");
      } finally {
        setDeletingId(null);
      }
    });
  };

  return (
    <section className="w-full rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4">
        <div className="flex items-center gap-2">
          <h3
            id="experiences-heading"
            className="font-bold text-neutral-900"
          >
            Experiences
          </h3>
          {!isLoading && experiences.length > 0 && (
            <span className="text-xs font-semibold text-slate-400 bg-slate-100 rounded-full px-2 py-0.5">
              {experiences.length}
            </span>
          )}
        </div>

        {isCurrentUser && (
          <Model
            bodyContent={<UserExperienceForm experience={selectedExp} profileUserId={profileUserId} />}
            title={selectedExp ? "Edit Experience" : "Add Experience"}
            className="lg:w-[700px]"
            modalId="experienceModal"
            triggerCls=""
          >
            <button
              onClick={openAdd}
              aria-label="Add experience"
              className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors duration-200"
            >
              <Plus className="w-4 h-4" strokeWidth={2.5} />
            </button>
          </Model>
        )}
      </div>

      {/* Body */}
      <div className="p-5">
        {isLoading ? (
          <ExperienceSkeleton />
        ) : sorted.length === 0 ? (
          <EmptyState isCurrentUser={isCurrentUser} onAdd={openAdd} />
        ) : (
          <div className="space-y-6">
            {sorted.map((exp, index) => (
              <div key={exp.id}>
                <Model
                  bodyContent={<UserExperienceForm experience={selectedExp} profileUserId={profileUserId} />}
                  title="Edit Experience"
                  className="lg:w-[700px]"
                  modalId="experienceModal"
                  triggerCls=""
                >
                  <div />
                </Model>

                <ExperienceCard
                  exp={exp}
                  isCurrentUser={isCurrentUser}
                  onEdit={openEdit}
                  onDelete={handleDelete}
                  isDeleting={deletingId === exp.id && isPending}
                />

                {index < sorted.length - 1 && (
                  <div className="h-px bg-slate-100 mt-6" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Experiences;