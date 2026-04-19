'use client';

import { createCheckoutSession } from "@/actions/stripe";
import { PLANS } from "@/lib/data/subscription-plans";
import { useTransition } from "react";

interface Props {
    role: "CANDIDATE" | "RECRUITER" | "ORGANIZATION";
    userId: number;
}

export default function SubscriptionPlans({ role, userId }: Props) {
    const plans = PLANS[role];
    const [isPending, startTransition] = useTransition();

    const handleSubscribe = (priceId: string) => {
        startTransition(async () => {
            const res = await createCheckoutSession({ userId, priceId });
            if (res?.url) window.location.href = res.url;
        });
    };

    return (
        <div className="grid md:grid-cols-2 gap-6">
            {plans.map((plan) => (
                <div
                    key={plan.priceId}
                    className="rounded-2xl border p-6 shadow-sm hover:shadow-md transition"
                >
                    <h2 className="text-xl font-bold">{plan.name}</h2>

                    <p className="text-3xl font-semibold mt-2">
                        ₹{plan.price}
                        <span className="text-sm text-gray-500">/{plan.interval}</span>
                    </p>

                    <ul className="mt-4 space-y-2">
                        {plan.features.map((f, i) => (
                            <li key={i} className="text-sm text-gray-600">
                                ✓ {f}
                            </li>
                        ))}
                    </ul>

                    <button
                        onClick={() => handleSubscribe(plan.priceId)}
                        disabled={isPending}
                        className="mt-6 w-full bg-black text-white py-2 rounded-lg hover:bg-neutral-800"
                    >
                        {isPending ? "Processing..." : "Subscribe"}
                    </button>
                </div>
            ))}
        </div>
    );
}