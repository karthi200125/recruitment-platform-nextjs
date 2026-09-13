import { getServerSession } from "next-auth";

import Navbar from "@/components/Navbar/Navbar";
import LpNavbar from "@/components/Navbar/LandingPageNavbar";
import { authOptions } from "@/lib/authentication/authOptions";

export default async function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);

    const user = session?.user ?? null;

    return (
        <>
            {user ? (
                <Navbar />
            ) : (
                <LpNavbar />
            )}

            {children}
        </>
    );
}