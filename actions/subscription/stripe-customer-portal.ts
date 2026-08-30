"use server";

import Stripe from "stripe";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/authentication/authOptions";
import { db } from "@/lib/db";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
    throw new Error(
        "STRIPE_SECRET_KEY is not configured."
    );
}

const stripe = new Stripe(stripeSecretKey, {
    apiVersion: "2025-02-24.acacia",
    typescript: true,
});

export async function StripeCustomerPortal(): Promise<void> {
    try {
        const session = await getServerSession(
            authOptions
        );

        if (!session?.user?.email) {
            throw new Error("Unauthorized");
        }

        const user = await db.user.findUnique({
            where: {
                email: session.user.email
                    .trim()
                    .toLowerCase(),
            },
            select: {
                id: true,
                stripeCustomerId: true,

                subscription: {
                    select: {
                        id: true,
                        subscriptionStatus: true,
                    },
                },
            },
        });

        if (!user) {
            throw new Error("User not found");
        }

        if (!user.stripeCustomerId) {
            throw new Error(
                "Stripe customer not found."
            );
        }

        if (!user.subscription) {
            throw new Error(
                "No subscription found."
            );
        }

        const portalSession =
            await stripe.billingPortal.sessions.create({
                customer: user.stripeCustomerId,

                return_url:
                    `${process.env.NEXT_PUBLIC_URL}/subscriptions`,
            });

        redirect(portalSession.url);
    } catch (error) {
        if (
            error &&
            typeof error === "object" &&
            "digest" in error &&
            typeof error.digest === "string" &&
            error.digest.startsWith("NEXT_REDIRECT")
        ) {
            throw error;
        }

        console.error(
            "[STRIPE_CUSTOMER_PORTAL]",
            error
        );

        throw new Error(
            "Failed to open billing portal"
        );
    }
}