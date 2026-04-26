import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import AccountForm from "@/app/Forms/AccountForm";

export default async function AccountSettingsPage() {
    const session = await getServerSession(authOptions);

    if (!session) redirect("/signin");

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <h1 className="text-xl font-semibold mb-2">Account Settings</h1>
            <p className="text-sm text-muted-foreground mb-6">
                Manage your account settings and security.
            </p>
            <AccountForm />
        </div>
    );
}