"use server";

import Stripe from "stripe";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/authentication/authOptions";
import { db } from "@/lib/db";

const stripe = new Stripe(
    process.env.STRIPE_SECRET_KEY!,
    {
        apiVersion: "2025-02-24.acacia",
        typescript: true,
    }
);

export async function StripeCustomerPortal(
    formData: FormData
): Promise<void> {
    try {

        const stripeCustomerId =
            formData.get("stripeCustomerId");

        if (
            typeof stripeCustomerId !== "string" ||
            !stripeCustomerId
        ) {
            throw new Error(
                "Missing Stripe customer ID"
            );
        }

        const session =
            await getServerSession(
                authOptions
            );

        if (!session?.user?.email) {
            throw new Error(
                "Unauthorized"
            );
        }

        const user =
            await db.user.findUnique({
                where: {
                    email: session.user.email,
                },
                include: {
                    subscription: true,
                },
            });

        if (!user) {
            throw new Error(
                "User not found"
            );
        }

        if (!user.subscription) {
            throw new Error(
                "No active subscription found."
            );
        }

        if (
            user.stripeCustomerId !==
            stripeCustomerId
        ) {
            throw new Error(
                "Invalid customer access."
            );
        }

        const portalSession =
            await stripe.billingPortal.sessions.create(
                {
                    customer:
                        stripeCustomerId,

                    return_url:
                        `${process.env.NEXT_PUBLIC_URL}/subscriptions`,
                }
            );

        redirect(portalSession.url);

    } catch (error) {

        if (
            error &&
            typeof error === "object" &&
            "digest" in error &&
            typeof error.digest === "string" &&
            error.digest.startsWith(
                "NEXT_REDIRECT"
            )
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