import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authentication/authOptions";
import { db } from "@/lib/db";

type DashboardLayoutProps = {
    children: ReactNode;
};

export default async function DashboardLayout({
    children,
}: DashboardLayoutProps) {
    // SESSION
    const session =
        await getServerSession(
            authOptions
        );

    // NOT LOGGED IN
    if (!session?.user?.id) {
        redirect("/signin");
    }

    // DATABASE USER
    const dbUser =
        await db.user.findUnique({
            where: {
                id: 
                    session.user.id
                ,
            },

            select: {
                role: true,
            },
        });

    // NO ROLE
    if (!dbUser?.role) {
        redirect("/selectrole");
    }

    return <>{children}</>;
}