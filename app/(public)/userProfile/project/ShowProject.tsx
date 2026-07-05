"use client";

import Image from "next/image";
import { ExternalLink, Pencil, Trash2 } from "lucide-react";
import type { ProjectCardProject } from "./ProjectCard";

interface ShowProjectProps {
    project: ProjectCardProject;
    isCurrentUser?: boolean;
    onEdit?: () => void;
    onDelete?: () => void;
}

export default function ShowProject({
    project,
    isCurrentUser = false,
    onEdit,
    onDelete,
}: ShowProjectProps) {
    return (
        <div className="space-y-5">
            {/* ── Project image ── */}
            <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-neutral-100">
                {project.proImage ? (
                    <Image
                        src={project.proImage}
                        alt={project.proName}
                        fill
                        sizes="(max-width: 768px) 100vw, 700px"
                        className="object-cover"
                        priority
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-neutral-100 to-neutral-200">
                        <span className="text-5xl font-bold text-neutral-300 select-none">
                            {project.proName.charAt(0).toUpperCase()}
                        </span>
                    </div>
                )}
            </div>

            {/* ── Description ── */}
            <div className="space-y-1.5">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-neutral-400">
                    About this project
                </h3>
                <p className="text-sm leading-relaxed text-neutral-700 whitespace-pre-line">
                    {project.proDesc}
                </p>
            </div>

            {/* ── CTA + owner actions ── */}
            <div className="flex flex-wrap items-center gap-3 border-t border-neutral-100 pt-4">
                <a
                    href={project.proLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-neutral-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900"
                >
                    <ExternalLink className="h-4 w-4" />
                    Visit Project
                </a>

                {isCurrentUser && (
                    <div className="flex items-center gap-2 ml-auto">
                        {onEdit && (
                            <button
                                type="button"
                                onClick={onEdit}
                                className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 px-3 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900"
                            >
                                <Pencil className="h-3.5 w-3.5" />
                                Edit
                            </button>
                        )}
                        {onDelete && (
                            <button
                                type="button"
                                onClick={onDelete}
                                className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500"
                            >
                                <Trash2 className="h-3.5 w-3.5" />
                                Delete
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}