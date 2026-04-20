import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import CurrentSubscription from "./CurrentSubscription";
import SubscriptionPlans from "./SubscriptionPlans";

export default async function SubscriptionPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) redirect("/signin");

    const user = await db.user.findUnique({
        where: { email: session.user.email },
        include: { subscription: true },
    });

    if (!user) redirect("/signin");
    if (!user.role) redirect("/select-role");

    const subscription = user.subscription?.[0] ?? null;

    return (
        <div className="w-full max-w-3xl mx-auto py-10 px-4 sm:px-6 space-y-6">

            {/* Page header */}
            <div>
                <h1 className="text-xl font-bold text-slate-900">Billing & Subscription</h1>
                <p className="text-sm text-slate-400 mt-0.5">
                    Manage your plan, view billing details, and upgrade anytime.
                </p>
            </div>

            {/* Current plan card */}
            <CurrentSubscription user={user} subscription={subscription} />

            {/* Available plans */}
            <SubscriptionPlans
                role={user.role as "CANDIDATE" | "RECRUITER" | "ORGANIZATION"}
                userId={user.id}
                currentPriceId={subscription?.stripePriceId ?? null}
                isPro={user.isPro ?? false}
            />
        </div>
    );
}