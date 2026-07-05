"use client";

import { useEffect, useState } from "react";
import { Plus, Folder } from "lucide-react";
import { useDispatch } from "react-redux";
import { openModal, closeModal } from "@/store/ModalSlice";
import type { AppDispatch } from "@/store/Store";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import Model from "@/components/Model";
import { UserProjectForm } from "@/components/forms/UserProjectForm";
import ProjectCard, { type ProjectCardProject } from "./ProjectCard";
import ShowProject from "./ShowProject";

export type { ProjectCardProject as Project };

interface ProjectsProps {
    projects?: ProjectCardProject[];
    isLoading?: boolean;
    profileUserId?: number;
}

function EmptyProjects({ isCurrentUser }: { isCurrentUser: boolean }) {
    const dispatch = useDispatch<AppDispatch>();

    return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-neutral-100">
                <Folder className="h-8 w-8 text-neutral-400" />
            </div>
            <p className="text-sm font-medium text-neutral-700">No projects yet</p>
            {isCurrentUser ? (
                <>
                    <p className="mt-1 text-sm text-neutral-400">
                        Showcase your work — add your first project.
                    </p>
                    <button
                        type="button"
                        onClick={() => dispatch(openModal("userProjectModal"))}
                        className="mt-4 inline-flex items-center gap-2 rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900"
                    >
                        <Plus className="h-4 w-4" />
                        Add your first project
                    </button>
                </>
            ) : (
                <p className="mt-1 text-sm text-neutral-400">
                    This user hasn't added any projects.
                </p>
            )}
        </div>
    );
}

function ProjectsSkeleton() {
    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
                <div
                    key={i}
                    className="overflow-hidden rounded-2xl border border-neutral-200 bg-white"
                    aria-hidden="true"
                >
                    <div className="aspect-video w-full animate-pulse bg-neutral-100" />
                    <div className="space-y-2 p-4">
                        <div className="h-3.5 w-2/3 animate-pulse rounded-full bg-neutral-100" />
                        <div className="h-3 w-full animate-pulse rounded-full bg-neutral-100" />
                    </div>
                </div>
            ))}
        </div>
    );
}

interface DeleteConfirmProps {
    projectName: string;
    onConfirm: () => void;
    onCancel: () => void;
    isDeleting: boolean;
}

function DeleteConfirm({
    projectName,
    onConfirm,
    onCancel,
    isDeleting,
}: DeleteConfirmProps) {
    return (
        <div
            role="alertdialog"
            aria-label="Confirm deletion"
            className="flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 p-4"
        >
            <p className="text-sm text-red-800">
                Delete <span className="font-semibold">{projectName}</span>? This
                can't be undone.
            </p>
            <div className="flex items-center gap-2">
                <button
                    type="button"
                    onClick={onConfirm}
                    disabled={isDeleting}
                    className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                >
                    {isDeleting ? "Deleting…" : "Yes, delete"}
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={isDeleting}
                    className="rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 transition-colors hover:bg-neutral-50 disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
}

function OpenModalEffect({
    modalId,
    open,
    onClose,
}: {
    modalId: string;
    open: boolean;
    onClose: () => void;
}) {
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        if (open) {
            dispatch(openModal(modalId));
        } else {
            dispatch(closeModal(modalId));
            onClose();
        }
    }, [open, modalId, dispatch, onClose]);

    return null;
}

export default function Projects({
    projects = [],
    isLoading = false,
    profileUserId,
}: ProjectsProps) {
    const dispatch = useDispatch<AppDispatch>();
    const { user } = useCurrentUser();

    const isCurrentUser = user?.id === profileUserId;

    const [activeShowId, setActiveShowId] = useState<number | null>(null);
    const [activeEditId, setActiveEditId] = useState<number | null>(null);
    const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async (project: ProjectCardProject) => {
        setIsDeleting(true);
        try {
            // TODO: wire up your deleteProjectAction here, e.g.:
            // await deleteProjectAction(project.id, user!.id);
            // Then: queryClient.invalidateQueries({ queryKey: ["getUserProjects", user.id] });
            void project;
            setPendingDeleteId(null);
        } catch {
            // TODO: show error toast
        } finally {
            setIsDeleting(false);
        }
    };

    const activeShowProject =
        projects.find((p) => p.id === activeShowId) ?? null;
    const activeEditProject =
        projects.find((p) => p.id === activeEditId) ?? null;

    return (
        <section
            aria-labelledby="projects-heading"
            className="rounded-[20px] border border-neutral-200 bg-white p-5 space-y-5"
        >
            {/* ── Header ── */}
            <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                    <h3
                        id="projects-heading"
                        className="font-bold text-neutral-900"
                    >
                        Projects
                    </h3>
                    {!isLoading && projects.length > 0 && (
                        <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-neutral-100 px-1.5 text-xs font-semibold text-neutral-500">
                            {projects.length}
                        </span>
                    )}
                </div>

                {isCurrentUser && (
                    <Model
                        modalId="userProjectModal"
                        title="Add Project"
                        className="w-full max-w-xl"
                        bodyContent={<UserProjectForm />}
                    >
                        <button
                            type="button"
                            onClick={() => dispatch(openModal("userProjectModal"))}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 px-3 py-1.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900"
                            aria-label="Add a new project"
                        >
                            <Plus className="h-4 w-4" />
                            Add
                        </button>
                    </Model>
                )}
            </div>

            {/* ── Loading skeleton ── */}
            {isLoading && <ProjectsSkeleton />}

            {/* ── Empty state ── */}
            {!isLoading && projects.length === 0 && (
                <EmptyProjects isCurrentUser={isCurrentUser} />
            )}

            {/* ── Project grid ── */}
            {!isLoading && projects.length > 0 && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {projects.map((project) => (
                        <div key={project.id} className="flex flex-col gap-2">
                            <ProjectCard
                                project={project}
                                isCurrentUser={isCurrentUser}
                                onView={() => setActiveShowId(project.id)}
                                onEdit={() => setActiveEditId(project.id)}
                                onDelete={() => setPendingDeleteId(project.id)}
                            />

                            {pendingDeleteId === project.id && (
                                <DeleteConfirm
                                    projectName={project.proName}
                                    onConfirm={() => handleDelete(project)}
                                    onCancel={() => setPendingDeleteId(null)}
                                    isDeleting={isDeleting}
                                />
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* ── Show-project modal (programmatically driven) ── */}
            {activeShowProject && (
                <>
                    <OpenModalEffect
                        modalId="showProjectModal"
                        open
                        onClose={() => setActiveShowId(null)}
                    />
                    <Model
                        modalId="showProjectModal"
                        title={activeShowProject.proName}
                        className="w-full max-w-2xl"
                        bodyContent={
                            <ShowProject
                                project={activeShowProject}
                                isCurrentUser={isCurrentUser}
                                onEdit={() => {
                                    setActiveShowId(null);
                                    setActiveEditId(activeShowProject.id);
                                }}
                                onDelete={() => {
                                    setActiveShowId(null);
                                    setPendingDeleteId(activeShowProject.id);
                                }}
                            />
                        }
                    >
                        <span className="sr-only">Project detail</span>
                    </Model>
                </>
            )}

            {/* ── Edit-project modal (programmatically driven) ── */}
            {activeEditProject && (
                <>
                    <OpenModalEffect
                        modalId="editProjectModal"
                        open
                        onClose={() => setActiveEditId(null)}
                    />
                    <Model
                        modalId="editProjectModal"
                        title={`Edit ${activeEditProject.proName}`}
                        className="w-full max-w-lg"
                        bodyContent={
                            <UserProjectForm
                                isEdit
                                project={{
                                    id: activeEditProject.id,
                                    proName: activeEditProject.proName,
                                    proLink: activeEditProject.proLink,
                                    proImage: activeEditProject.proImage,
                                    proDesc: activeEditProject.proDesc,
                                    proImagePublicId: activeEditProject.proImagePublicId,
                                }}
                                onClose={() => setActiveEditId(null)}
                            />
                        }
                    >
                        <span className="sr-only">Edit project</span>
                    </Model>
                </>
            )}
        </section>
    );
}