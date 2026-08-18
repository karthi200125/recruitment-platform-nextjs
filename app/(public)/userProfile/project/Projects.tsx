"use client";

import { useMemo, useState } from "react";
import { Folder, Plus } from "lucide-react";
import { useDispatch } from "react-redux";

import { openModal } from "@/store/ModalSlice";
import type { AppDispatch } from "@/store/Store";
import { useCurrentUser } from "@/hooks/useCurrentUser";

import Model from "@/components/Model";
import { UserProjectForm } from "@/components/forms/UserProjectForm";
import DeleteProjectForm from "@/components/forms/DeleteProjectForm";

import ProjectCard, {
    type ProjectCardProject,
} from "./ProjectCard";

import ShowProject from "./ShowProject";
import { ProjectsSkeleton } from "@/components/skeletons/ProjectsSkeleton";

export type { ProjectCardProject as Project };

interface ProjectsProps {
    projects?: ProjectCardProject[];
    isLoading?: boolean;
    profileUserId?: number;
}

/**
 * Only one project modal can be active at a time.
 */
type ActiveModal =
    | { type: "view"; projectId: number }
    | { type: "edit"; projectId: number }
    | { type: "delete"; projectId: number }
    | null;

/**
 * Empty projects state.
 */
function EmptyProjects({
    isCurrentUser,
}: {
    isCurrentUser: boolean;
}) {
    const dispatch = useDispatch<AppDispatch>();

    const handleAddProject = () => {
        dispatch(openModal("userProjectModal"));
    };

    return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-neutral-100">
                <Folder className="h-8 w-8 text-neutral-400" />
            </div>

            <p className="text-sm font-medium text-neutral-700">
                No projects yet
            </p>

            {isCurrentUser ? (
                <>
                    <p className="mt-1 text-sm text-neutral-400">
                        Showcase your work — add your first project.
                    </p>

                    <button
                        type="button"
                        onClick={handleAddProject}
                        className="mt-4 inline-flex items-center gap-2 rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900"
                    >
                        <Plus className="h-4 w-4" />
                        Add your first project
                    </button>
                </>
            ) : (
                <p className="mt-1 text-sm text-neutral-400">
                    This user hasn&apos;t added any projects.
                </p>
            )}
        </div>
    );
}

export default function Projects({
    projects = [],
    isLoading = false,
    profileUserId,
}: ProjectsProps) {
    const dispatch = useDispatch<AppDispatch>();
    const { user } = useCurrentUser();

    /**
     * Determines whether this is the logged-in user's profile.
     */
    const isCurrentUser = user?.id === profileUserId;

    /**
     * ONE source of truth for project modals.
     *
     * Only one of these can exist at a time.
     */
    const [activeModal, setActiveModal] =
        useState<ActiveModal>(null);

    /**
     * Find the currently selected project.
     */
    const activeProject = useMemo(() => {
        if (!activeModal) {
            return null;
        }

        return (
            projects.find(
                (project) =>
                    project.id === activeModal.projectId
            ) ?? null
        );
    }, [activeModal, projects]);

    /**
     * Open the Add Project modal.
     */
    const handleAddProject = () => {
        if (!isCurrentUser) {
            return;
        }

        dispatch(openModal("userProjectModal"));
    };

    /**
     * Open View modal.
     *
     * Any existing project modal is replaced automatically.
     */
    const handleViewProject = (projectId: number) => {
        setActiveModal({
            type: "view",
            projectId,
        });

        dispatch(openModal("showProjectModal"));
    };

    /**
     * Open Edit modal.
     *
     * Only the selected project is stored.
     */
    const handleEditProject = (projectId: number) => {
        if (!isCurrentUser) {
            return;
        }

        setActiveModal({
            type: "edit",
            projectId,
        });

        dispatch(openModal("editProjectModal"));
    };

    /**
     * Open Delete modal.
     *
     * Only the selected project is stored.
     */
    const handleDeleteProject = (projectId: number) => {
        if (!isCurrentUser) {
            return;
        }

        setActiveModal({
            type: "delete",
            projectId,
        });

        dispatch(openModal("deleteProjectModal"));
    };

    /**
     * Close whichever project modal is currently open.
     *
     * This guarantees that only one project modal
     * is considered active at a time.
     */
    const handleCloseProjectModal = () => {
        if (!activeModal) {
            return;
        }

        switch (activeModal.type) {
            case "view":
                dispatch(openModal("showProjectModal"));
                break;

            case "edit":
                dispatch(openModal("editProjectModal"));
                break;

            case "delete":
                dispatch(openModal("deleteProjectModal"));
                break;
        }

        setActiveModal(null);
    };

    return (
        <section
            aria-labelledby="projects-heading"
            className="space-y-5 rounded-[20px] border border-neutral-200 bg-white p-5"
        >
            {/* Header */}
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
                        className="w-full max-w-3xl"
                        bodyContent={<UserProjectForm />}
                    >
                        <button
                            type="button"
                            onClick={handleAddProject}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 px-3 py-1.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50 hover:border-neutral-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900"
                            aria-label="Add a new project"
                        >
                            <Plus className="h-4 w-4" />
                            Add
                        </button>
                    </Model>
                )}
            </div>

            {/* Loading */}
            {isLoading && <ProjectsSkeleton />}

            {/* Empty */}
            {!isLoading && projects.length === 0 && (
                <EmptyProjects
                    isCurrentUser={isCurrentUser}
                />
            )}

            {/* Project Grid */}
            {!isLoading && projects.length > 0 && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {projects.map((project) => (
                        <div
                            key={project.id}
                            className="flex flex-col gap-2"
                        >
                            <ProjectCard
                                project={project}
                                isCurrentUser={isCurrentUser}
                                onView={() =>
                                    handleViewProject(
                                        project.id
                                    )
                                }
                                onEdit={() =>
                                    handleEditProject(
                                        project.id
                                    )
                                }
                                onDelete={() =>
                                    handleDeleteProject(
                                        project.id
                                    )
                                }
                            />
                        </div>
                    ))}
                </div>
            )}

            {/* =====================================================
                SINGLE PROJECT MODAL
                ===================================================== */}

            {activeProject && activeModal?.type === "view" && (
                <Model
                    modalId="showProjectModal"
                    title={activeProject.proName}
                    className="w-full max-w-4xl"
                    bodyContent={
                        <ShowProject
                            project={activeProject}
                        />
                    }
                >
                    <span className="sr-only">
                        Project detail
                    </span>
                </Model>
            )}

            {activeProject && activeModal?.type === "edit" && (
                <Model
                    modalId="editProjectModal"
                    title={`Edit ${activeProject.proName}`}
                    className="w-full max-w-3xl"
                    bodyContent={
                        <UserProjectForm
                            isEdit
                            project={activeProject}
                            onClose={handleCloseProjectModal}
                        />
                    }
                >
                    <span className="sr-only">
                        Edit project
                    </span>
                </Model>
            )}

            {activeProject &&
                activeModal?.type === "delete" && (
                    <Model
                        modalId="deleteProjectModal"
                        title={`Delete ${activeProject.proName}`}
                        className="w-full max-w-md"
                        bodyContent={
                            <DeleteProjectForm
                                userId={profileUserId}
                                project={activeProject}
                            />
                        }
                    >
                        <span className="sr-only">
                            Delete project
                        </span>
                    </Model>
                )}
        </section>
    );
}