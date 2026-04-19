'use server';

import Stripe from "stripe";
import { db } from "@/lib/db";
import { PLANS } from "@/lib/data/subscription-plans";

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
    const user = await db.user.findUnique({
        where: { id: userId },
        include: {
            subscription: true,
        },
    });

    if (!user) throw new Error("User not found");

    if (user.isPro) {
        throw new Error("Already subscribed");
    }

    const allPlans = Object.values(PLANS).flat();
    const selectedPlan = allPlans.find(p => p.priceId === priceId);

    if (!selectedPlan) {
        throw new Error("Invalid plan selected");
    }

    // ✅ Get or create customer
    let customerId = user.subscription?.[0]?.stripeCustomerId;

    if (!customerId) {
        const customer = await stripe.customers.create({
            email: user.email,
            name: user.username,
        });

        customerId = customer.id;
    }

    const session = await stripe.checkout.sessions.create({
        mode: "subscription",
        customer: customerId,
        payment_method_types: ["card"],

        line_items: [
            {
                price: priceId, // ✅ CORRECT WAY
                quantity: 1,
            },
        ],

        success_url: `${process.env.NEXT_PUBLIC_URL}/subscription/success`,
        cancel_url: `${process.env.NEXT_PUBLIC_URL}/subscription`,

        metadata: {
            userId: String(user.id),
        },
    });

    return { url: session.url };
}