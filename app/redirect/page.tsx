import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";

export default async function RedirectPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        return redirect("/signin");
    }

    const role = session.user.role;

    // 👉 Role-based routing
    if (role === "CANDIDATE") {
        return redirect("/jobs");
    }

    if (role === "RECRUITER") {
        return redirect("/dashboard");
    }

    if (role === "ORGANIZATION") {
        return redirect("/dashboard");
    }

    return redirect("/");
}