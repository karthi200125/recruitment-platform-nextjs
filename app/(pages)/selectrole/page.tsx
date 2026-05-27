import { redirect } from "next/navigation";

import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/authOptions";

import RoleForm from "@/app/Forms/RoleForm";

// ─────────────────────────────────────────────
// ROLE PAGE
// ─────────────────────────────────────────────

export default async function RolePage() {
    const session =
        await getServerSession(
            authOptions
        );

    // ─────────────────────────────────────────
    // NOT LOGGED IN
    // ─────────────────────────────────────────

    if (!session?.user) {
        redirect("/signin");
    }

    // ─────────────────────────────────────────
    // ALREADY HAS ROLE
    // ─────────────────────────────────────────

    const role = session.user.role;

    if (role) {
        if (role === "CANDIDATE") {
            redirect("/jobs");
        }

        redirect("/dashboard");
    }

    return <RoleForm />;
}