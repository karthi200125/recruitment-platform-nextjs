"use server";

import Stripe from "stripe";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { db } from "@/lib/db";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2025-01-27.acacia",
    typescript: true,
});

type PortalResponse =
    | { sessionUrl: string }
    | { error: string };

export async function StripeCustomerPortal(
    formData: FormData
): Promise<PortalResponse> {
    try {
        const stripeCustomerId = formData.get("stripeCustomerId") as string;

        if (!stripeCustomerId) {
            return { error: "Missing customer ID" };
        }

        // 🔐 SECURITY: verify logged-in user
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return { error: "Unauthorized" };
        }

        // 🔐 Fetch user from DB (never trust form data)
        const user = await db.user.findUnique({
            where: { email: session.user.email },
            include: {
                subscription: true,
            },
        });

        if (!user) {
            return { error: "User not found" };
        }

        const subscription = user.subscription?.[0];

        // 🔐 Ensure the customer ID belongs to this user
        if (!subscription || subscription.stripeCustomerId !== stripeCustomerId) {
            return { error: "Invalid customer access" };
        }

        // ✅ Create Stripe portal session
        const portalSession = await stripe.billingPortal.sessions.create({
            customer: stripeCustomerId,
            return_url: `${process.env.NEXT_PUBLIC_URL}/subscription`,
        });

        return { sessionUrl: portalSession.url };

    } catch (error) {
        console.error("Stripe Portal Error:", error);
        return { error: "Failed to create billing portal session" };
    }
}