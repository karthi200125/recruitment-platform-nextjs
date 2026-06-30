"use server";

import { Prisma } from "@prisma/client";
import * as z from "zod";

import { db } from "@/lib/db";
import { Project } from "@/types";
import { UserProjectSchema } from "@/lib/SchemaTypes";

type UserProjectActionResult =
    | {
        success: string;
        data: Project;
    }
    | {
        error: string;
        issues?: z.ZodIssue[];
    };

export const userProjectAction = async (
    values: z.infer<typeof UserProjectSchema>,
    userId: number,
    proImage: string,
    proImagePublicId: string,
    isEdit = false,
    proId?: number
): Promise<UserProjectActionResult> => {
    try {
        const validatedFields = UserProjectSchema.safeParse(values);

        if (!validatedFields.success) {
            return {
                error: "Invalid form data.",
                issues: validatedFields.error.issues,
            };
        }

        if (!userId) {
            return {
                error: "User not found.",
            };
        }

        if (isEdit && !proId) {
            return {
                error: "Project ID is required.",
            };
        }

        const user = await db.user.findUnique({
            where: {
                id: userId,
            },
            select: {
                id: true,
            },
        });

        if (!user) {
            return {
                error: "User does not exist.",
            };
        }

        const data = {
            proName: validatedFields.data.proName.trim(),
            proDesc: validatedFields.data.proDesc.trim(),
            proLink: validatedFields.data.proLink.trim(),
        };

        const projectData: Prisma.ProjectUncheckedCreateInput = {
            ...data,
            userId,
            proImage,
            proImagePublicId,
        };

        let project: Project;

        if (isEdit) {
            const existingProject = await db.project.findUnique({
                where: {
                    id: proId!,
                },
                select: {
                    id: true,
                    userId: true,
                },
            });

            if (!existingProject) {
                return {
                    error: "Project not found.",
                };
            }

            if (existingProject.userId !== userId) {
                return {
                    error: "You are not authorized to update this project.",
                };
            }

            const updateData: Prisma.ProjectUncheckedUpdateInput = {
                ...data,
            };

            if (proImage && proImagePublicId) {
                updateData.proImage = proImage;
                updateData.proImagePublicId = proImagePublicId;
            }

            project = await db.project.update({
                where: {
                    id: existingProject.id,
                },
                data: updateData,
            });

            return {
                success: `${project.proName} has been updated successfully.`,
                data: project,
            };
        }

        project = await db.project.create({
            data: projectData,
        });

        return {
            success: `${project.proName} has been created successfully.`,
            data: project,
        };
    } catch (error) {
        console.error("[USER_PROJECT_ACTION]", error);
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            switch (error.code) {
                case "P2002":
                    return {
                        error: "A project with these details already exists.",
                    };

                case "P2025":
                    return {
                        error: "Project not found.",
                    };

                default:
                    return {
                        error: "A database error occurred while saving the project.",
                    };
            }
        }

        if (error instanceof z.ZodError) {
            return {
                error: "Validation failed.",
                issues: error.issues,
            };
        }

        return {
            error: "Something went wrong while saving the project. Please try again.",
        };
    }
};