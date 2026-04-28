import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import RoleForm from "@/app/Forms/RoleForm";

export default async function RolePage() {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        redirect("/signin");
    }

    if (session.user.role) {
        if (session.user.role === "CANDIDATE") {
            redirect("/jobs");
        } else {
            redirect("/dashboard");
        }
    }

    return <RoleForm />;
}