import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Stripe from "stripe";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/authentication/authOptions";
import { db } from "@/lib/db";
import { getPlans } from "@/lib/data/subscription-plans";

import CurrentSubscription from "./CurrentSubscription";
import SubscriptionPlans from "./SubscriptionPlans";

export const metadata: Metadata = {
    title: "Billing & Subscription",
    description:
        "Manage your Jobify subscription, view your current plan, and choose a premium plan.",
    robots: {
        index: false,
        follow: false,
    },
};

export const dynamic = "force-dynamic";

interface SubscriptionPageProps {
    searchParams: {
        session_id?: string;
    };
}

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
    throw new Error("STRIPE_SECRET_KEY is not configured.");
}

const stripe = new Stripe(stripeSecretKey, {
    apiVersion: "2025-02-24.acacia",
});

export default async function SubscriptionPage({
    searchParams,
}: SubscriptionPageProps) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        redirect("/signin");
    }

    const userId = Number(session.user.id);

    if (!Number.isInteger(userId) || userId <= 0) {
        redirect("/signin");
    }

    const user = await db.user.findUnique({
        where: {
            id: userId,
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

            const isValidCheckout =
                customerId === user.stripeCustomerId &&
                checkoutSession.mode === "subscription" &&
                checkoutSession.status === "complete";

            if (isValidCheckout) {
                console.log(
                    "[SUBSCRIPTION_CHECKOUT_VERIFIED]",
                    {
                        userId: user.id,
                        sessionId: searchParams.session_id,
                    }
                );
            }
        } catch (error) {
            console.error(
                "[SUBSCRIPTION_CHECKOUT_VERIFY]",
                error
            );
        }
    }

    const plans = getPlans();

    const subscription = user.subscription ?? null;

    return (
        <main className="mx-auto w-full max-w-5xl space-y-6 py-10">
            {/* Page header */}
            <header>
                <h1 className="text-xl font-bold text-slate-900">
                    Billing & Subscription
                </h1>

                <p className="mt-0.5 text-sm text-slate-400">
                    Manage your plan, view billing details, and upgrade anytime.
                </p>
            </header>

            {/* Current subscription */}
            <CurrentSubscription
                user={user}
                subscription={subscription}
            />

            {/* Available plans */}
            <SubscriptionPlans
                role={
                    user.role as
                    | "CANDIDATE"
                    | "RECRUITER"
                    | "ORGANIZATION"
                }
                userId={user.id}
                currentPriceId={
                    subscription?.stripePriceId ?? null
                }
                isPro={user.isPro}
                plans={plans}
            />
        </main>
    );
}