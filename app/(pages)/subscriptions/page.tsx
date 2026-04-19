import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import CurrentSubscription from "./CurrentSubscription";
import SubscriptionPlans from "./SubscriptionPlans";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export default async function SubscriptionPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) redirect("/auth");


    const user = await db.user.findUnique({
        where: { email: session.user.email },
        include: {
            subscription: true,
        },
    });

    if (!user) redirect("/signin");

    const subscription = user.subscription?.[0] || null;

    return (
        <div className="w-full py-10 px-4 space-y-10">
            <CurrentSubscription user={user} subscription={subscription} />

            <SubscriptionPlans
                role={user.role}
                userId={user.id}
                currentPriceId={subscription?.stripePriceId}
                isPro={user.isPro}
            />
        </div>
    );
}