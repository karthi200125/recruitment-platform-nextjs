'use server'

import { db } from "@/lib/db"

export const getUserEducation = async (userId: number) => {
    try {
        const getEducations = await db.education.findMany({
            where: {
                userId
            }
        })

        return { success: "", data: getEducations }
    } catch (err) {
        return { error: "get User Educations failed" }
    }
}