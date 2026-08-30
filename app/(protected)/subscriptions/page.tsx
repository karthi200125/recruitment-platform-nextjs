import { redirect } from "next/navigation";
import Stripe from "stripe";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/authentication/authOptions";
import CurrentSubscription from "./CurrentSubscription";
import SubscriptionPlans from "./SubscriptionPlans";
import { getPlans } from "@/lib/data/subscription-plans";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
    throw new Error("STRIPE_SECRET_KEY is not configured.");
}

const stripe = new Stripe(stripeSecretKey, {
    apiVersion: "2025-02-24.acacia",
});

interface SubscriptionPageProps {
    searchParams: {
        session_id?: string;
    };
}

export default async function SubscriptionPage({
    searchParams,
}: SubscriptionPageProps) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        redirect("/signin");
    }

    const plans = getPlans();

    const email = session.user.email.trim().toLowerCase();

    const user = await db.user.findUnique({
        where: {
            id: session.user.id,
        },
        include: {
            subscription: true,
        },
    });

    if (!user) {
        redirect("/signin");
    }

    if (searchParams.session_id) {
        try {
            const checkoutSession =
                await stripe.checkout.sessions.retrieve(
                    searchParams.session_id
                );

            const customerId =
                typeof checkoutSession.customer === "string"
                    ? checkoutSession.customer
                    : null;

            if (
                customerId &&
                user.stripeCustomerId === customerId &&
                checkoutSession.mode === "subscription" &&
                checkoutSession.status === "complete"
            ) {
            }
        } catch (error) {
            console.error(
                "[SUBSCRIPTION_CHECKOUT_VERIFY]",
                error
            );
        }
    }

    const latestUser = await db.user.findUnique({
        where: {
            id: user.id,
        },
        include: {
            subscription: true,
        },
    });

    if (!latestUser) {
        redirect("/signin");
    }

    const subscription = latestUser.subscription ?? null;

    return (
        <div className="mx-auto w-full max-w-5xl space-y-6 py-10">

            {/* Page header */}
            <div>
                <h1 className="text-xl font-bold text-slate-900">
                    Billing & Subscription
                </h1>

                <p className="mt-0.5 text-sm text-slate-400">
                    Manage your plan, view billing details, and upgrade anytime.
                </p>
            </div>

            {/* Current subscription */}
            <CurrentSubscription
                user={latestUser}
                subscription={subscription}
            />

            {/* Available plans */}
            <SubscriptionPlans
                role={
                    latestUser.role as
                    | "CANDIDATE"
                    | "RECRUITER"
                    | "ORGANIZATION"
                }
                userId={latestUser.id}
                currentPriceId={
                    subscription?.stripePriceId ?? null
                }
                isPro={latestUser.isPro}
                plans={plans}
            />
        </div>
    );
}