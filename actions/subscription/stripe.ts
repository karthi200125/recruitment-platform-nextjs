'use server';

import Stripe from "stripe";
import { db } from "@/lib/db";
import { getPlans } from "@/lib/data/subscription-plans";

// ✅ Stripe init
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2025-01-27.acacia",
});

export async function createCheckoutSession({
    userId,
    priceId,
}: {
    userId: number;
    priceId: string;
}) {
    // 🔐 1. Get user
    const user = await db.user.findUnique({
        where: { id: userId },
        include: { subscription: true },
    });

    if (!user) throw new Error("User not found");

    // 🔐 2. Prevent duplicate subscription
    if (user.isPro && user.subscription?.subscriptionStatus === "active") {
        throw new Error("Already subscribed");
    }

    // 🔐 3. Validate plan (IMPORTANT)
    const PLANS = getPlans(); // ✅ FIX
    const allPlans = Object.values(PLANS).flat();

    const selectedPlan = allPlans.find(
        (plan) => plan.priceId === priceId
    );

    if (!selectedPlan) {
        throw new Error("Invalid plan selected");
    }

    // 🔐 4. Ensure Stripe customer exists
    let customerId = user.stripeCustomerId;

    if (!customerId) {
        const customer = await stripe.customers.create({
            email: user.email ?? undefined,
            name: user.username ?? undefined,
        });

        customerId = customer.id;

        await db.user.update({
            where: { id: user.id },
            data: {
                stripeCustomerId: customerId,
            },
        });
    }

    // 🔐 5. Create checkout session
    const session = await stripe.checkout.sessions.create({
        mode: "subscription",
        customer: customerId,

        payment_method_types: ["card"],

        line_items: [
            {
                price: selectedPlan.priceId,
                quantity: 1,
            },
        ],

        // ✅ REQUIRED FOR INDIA
        billing_address_collection: "required",

        // ✅ ensures name is collected (important)
        customer_update: {
            name: "auto",
            address: "auto",
        },

        success_url: `${process.env.NEXT_PUBLIC_URL}/subscriptions?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_URL}/subscriptions`,

        metadata: {
            userId: String(user.id),
            planId: selectedPlan.id,
        },
    });

    if (!session.url) {
        throw new Error("Failed to create checkout session");
    }

    return { url: session.url };
}