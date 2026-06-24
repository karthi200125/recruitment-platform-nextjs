'use server'

import { db } from "@/lib/db"

export const userResumeUpdate = async (userId?: any, resumeUrl?: any) => {
    
    try {
        await db.user.update({
            where: {
                id: userId
            },
            data: {
                resume: resumeUrl
            }
        })        
        return { success: "User Resume Updated Successfully"}
    } catch (error) {
        return { error: "User Resume Update failed" }
    }
}