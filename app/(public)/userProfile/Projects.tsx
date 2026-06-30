"use client";

import Button from "@/components/Button";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";

import { Plus } from "lucide-react";

import Model from "@/components/Model";
import { UserProjectForm } from "@/components/forms/UserProjectForm";
import ProjectCard from "./ProjectCard";

import CarouselSkeleton from "@/components/skeletons/CarouselSkeleton";

import { openModal } from "@/store/ModalSlice";
import { useDispatch } from "react-redux";

import { useCurrentUser } from "@/hooks/useCurrentUser";
import ShowProject from "./ShowProject";

interface Project {
    id: number;
    proName: string;
    proLink: string;
    proImage: string;
    proDesc: string;
}

interface ProjectsProps {
    projects?: Project[];
    isLoading?: boolean;
    profileUserId?: number;
}

export default function Projects({
    projects = [],
    isLoading = false,
    profileUserId,
}: ProjectsProps) {
    const dispatch = useDispatch();
    const { user } = useCurrentUser();

    const isCurrentUser = user?.id === profileUserId;

    return (
        <section className="relative rounded-[20px] border p-5 space-y-5">

            {/* HEADER */}
            <div className="flex items-center justify-between">
                <h3 className="font-bold">Projects</h3>

                {isCurrentUser && (
                    <Model
                        modalId="userProjectModal"
                        title="Add Project"
                        className="w-full max-w-4xl"
                        bodyContent={<UserProjectForm />}
                    >
                        <Button
                            variant="border"
                            icon={<Plus size={20} />}
                        >
                            Add
                        </Button>
                    </Model>
                )}
            </div>

            {/* LOADING */}
            {isLoading && <CarouselSkeleton />}

            {/* EMPTY */}
            {!isLoading && projects.length === 0 && (
                <p className="text-sm text-neutral-400">
                    No projects added yet.
                </p>
            )}

            {/* DATA */}
            {!isLoading && projects.length > 0 && (
                <Carousel
                    opts={{ align: "start" }}
                    className="w-full max-w-4xl mx-auto"
                >
                    <CarouselContent>
                        {projects.map((project) => {
                            const modalId = `show-project-${project.id}`;

                            return (
                                <CarouselItem
                                    key={project.id}
                                    className="md:basis-1/2 lg:basis-1/3"
                                >
                                    <div className="p-1">
                                        <Model
                                            bodyContent={
                                                <ShowProject project={project} />
                                            }
                                            title={project.proName}
                                            className="min-w-[300px] md:w-[600px] lg:w-[1000px]"
                                            modalId={modalId}
                                        >
                                            <ProjectCard
                                                project={project}
                                                className="h-[320px] w-full"
                                                isCurrentUser={isCurrentUser}
                                            />
                                        </Model>
                                    </div>
                                </CarouselItem>
                            );
                        })}
                    </CarouselContent>

                    {/* NAVIGATION */}
                    {projects.length >= 3 && (
                        <>
                            <CarouselPrevious className="hidden md:flex" />
                            <CarouselNext className="hidden md:flex" />
                        </>
                    )}
                </Carousel>
            )}
        </section>
    );
}