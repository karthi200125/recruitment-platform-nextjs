"use client";

import Image from "next/image";
import { ExternalLink, Eye, Pencil, Trash2 } from "lucide-react";

export interface ProjectCardProject {
  id: number;
  proName: string;
  proLink: string;
  proImage: string;
  proDesc: string;
  proImagePublicId?: string | null;
  createdAt?: string | Date;
}

interface ProjectCardProps {
  project: ProjectCardProject;
  isCurrentUser: boolean;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export default function ProjectCard({
  project,
  isCurrentUser,
  onView,
  onEdit,
  onDelete,
}: ProjectCardProps) {
  return (
    <article
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition-shadow duration-300 hover:shadow-md"
      aria-label={`Project: ${project.proName}`}
    >
      {/* ── Image ── */}
      <div
        className="relative aspect-video w-full cursor-pointer overflow-hidden bg-neutral-100"
        onClick={onView}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onView()}
        aria-label={`View ${project.proName}`}
      >
        {project.proImage ? (
          <Image
            src={project.proImage}
            alt={project.proName}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-all duration-500 group-hover:scale-[1.03] group-hover:brightness-75 group-hover:grayscale-[30%]"
            priority={false}
          />
        ) : (
          // Fallback when no image uploaded yet
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-neutral-100 to-neutral-200">
            <span className="text-3xl font-bold text-neutral-300 select-none">
              {project.proName.charAt(0).toUpperCase()}
            </span>
          </div>
        )}

        {/* Hover overlay — slides up from bottom */}
        <div className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-black/80 via-black/40 to-transparent px-4 pb-4 pt-10 transition-transform duration-300 ease-out group-hover:translate-y-0">
          <p className="line-clamp-2 text-sm text-white/90 leading-snug">
            {project.proDesc}
          </p>
        </div>
      </div>

      {/* ── Footer ── */}
      <div className="flex items-start justify-between gap-2 px-4 py-3">
        <div className="min-w-0 flex-1">
          <h4
            className="truncate text-sm font-semibold text-neutral-900 cursor-pointer hover:text-neutral-600 transition-colors"
            onClick={onView}
            title={project.proName}
          >
            {project.proName}
          </h4>
          <p className="mt-0.5 line-clamp-1 text-xs text-neutral-500">
            {project.proDesc}
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex shrink-0 items-center gap-0.5 -mr-1">
          <IconButton
            label={`View ${project.proName}`}
            onClick={onView}
            icon={<Eye className="h-3.5 w-3.5" />}
          />
          <a
            href={project.proLink}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Open ${project.proName} in a new tab`}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900"
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
          {isCurrentUser && (
            <>
              <IconButton
                label={`Edit ${project.proName}`}
                onClick={onEdit}
                icon={<Pencil className="h-3.5 w-3.5" />}
              />
              <IconButton
                label={`Delete ${project.proName}`}
                onClick={onDelete}
                icon={<Trash2 className="h-3.5 w-3.5" />}
                destructive
              />
            </>
          )}
        </div>
      </div>
    </article>
  );
}

function IconButton({
  label,
  onClick,
  icon,
  destructive = false,
}: {
  label: string;
  onClick: () => void;
  icon: React.ReactNode;
  destructive?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      aria-label={label}
      className={[
        "flex h-7 w-7 items-center justify-center rounded-lg transition-colors",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
        destructive
          ? "text-neutral-400 hover:bg-red-50 hover:text-red-500 focus-visible:outline-red-500"
          : "text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 focus-visible:outline-neutral-900",
      ].join(" ")}
    >
      {icon}
    </button>
  );
}