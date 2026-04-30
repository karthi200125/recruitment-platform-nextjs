// types/user.ts


import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { EasyApplyUser } from "@/types/easyApply";


export const getEasyApplyUser = async (): Promise<EasyApplyUser | null> => {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return null;
        }

        const user = await db.user.findUnique({
            where: { id: Number(session.user.id) },
            select: {
                email: true,
                phoneNo: true,
                userImage: true,
                userImagePublicId: true,
                username: true,
                city: true,
                state: true,
                country: true,
                resume: true,
                resumePublicId: true,
            },
        });

        return user;
    } catch (error) {
        console.error("getEasyApplyUser error:", error);
        return null;
    }
};