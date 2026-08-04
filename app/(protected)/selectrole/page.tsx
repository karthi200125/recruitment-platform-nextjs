import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authentication/authOptions";
import RoleForm from "@/components/forms/RoleForm";


export default async function RolePage() {
    const session =
        await getServerSession(
            authOptions
        );
    
    if (!session?.user) {
        redirect("/signin");
    }
    
    const role = session.user.role;

    if (role) {
        if (role === "CANDIDATE") {
            redirect("/jobs");
        }

        // if (role === "ORGANIZATION") {
        //     redirect("/create-company");
        // }

        redirect("/dashboard");
    }

    return <RoleForm />;
}