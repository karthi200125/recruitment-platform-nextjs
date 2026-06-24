'use server'

import { db } from "@/lib/db"

export const getUserProjects = async (userId: any) => {
    try {
        const getEducations = await db.project.findMany({
            where: {
                userId
            }
        })

        return { success: "", data: getEducations }
    } catch (err) {
        return { error: "get User Educations failed" }
    }
}