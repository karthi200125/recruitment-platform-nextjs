import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/authentication/authOptions";
import Navbar from "@/components/Navbar/Navbar";

export default async function ProtectedLayout({
    children,
}: {
    children: React.ReactNode;
}) {    
    return (
        <>
            <Navbar/>
            {children}
        </>
    );
}