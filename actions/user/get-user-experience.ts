'use server'

import { db } from "@/lib/db"

export const getUserExperience = async (userId: number) => {
    try {
        const getExperiences = await db.experience.findMany({
            where: {
                userId
            }
        })        
        return { success: "", data: getExperiences }
    } catch (err) {
        return { error: "get User Experiences failed" }
    }
}