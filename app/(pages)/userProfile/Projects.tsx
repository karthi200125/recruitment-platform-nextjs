"use client";

import Button from "@/components/Button";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";

import { GoPlus } from "react-icons/go";

import ProjectCard from "./ProjectCard";
import Model from "@/components/Model/Model";
import { UserProjectForm } from "@/app/Forms/UserProjectForm";

import CarouselSkeleton from "@/Skeletons/CarouselSkeleton";

import { useDispatch } from "react-redux";
import { openModal } from "@/app/Redux/ModalSlice";

import ShowProject from "./ShowProject";
import { useCurrentUser } from "@/hooks/useCurrentUser";

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
                        bodyContent={<UserProjectForm />}
                        modalId="userProjectModal"
                        title="Add Project"
                        className="min-w-[300px] lg:w-[800px]"
                    >
                        <Button
                            variant="border"
                            onClick={() =>
                                dispatch(openModal("userProjectModal"))
                            }
                            icon={<GoPlus size={20} />}
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
                                                onClick={() =>
                                                    dispatch(openModal(modalId))
                                                }
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