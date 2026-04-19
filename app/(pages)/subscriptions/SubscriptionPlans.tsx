'use client';

import { useTransition } from "react";
import { PLANS } from "@/lib/data/subscription-plans";
import { createCheckoutSession } from "@/actions/stripe";

interface Props {
    role: "CANDIDATE" | "RECRUITER" | "ORGANIZATION";
    userId: number;
    currentPriceId?: string | null;
    isPro: boolean;
}

export default function SubscriptionPlans({
    role,
    userId,
    currentPriceId,
    isPro,
}: Props) {
    const [isPending, startTransition] = useTransition();

    const plans = PLANS[role];

    const handleSubscribe = (priceId: string) => {
        startTransition(async () => {
            const res = await createCheckoutSession({ userId, priceId });
            if (res?.url) window.location.href = res.url;
        });
    };

    return (
        <div>
            <h2 className="text-xl font-bold mb-6">Plans</h2>

            <div className="grid md:grid-cols-2 gap-6">
                {plans.map((plan) => {
                    const isCurrent = currentPriceId === plan.priceId;

                    return (
                        <div
                            key={plan.priceId}
                            className={`border rounded-2xl p-6 ${isCurrent ? "border-green-500" : ""
                                }`}
                        >
                            <h3 className="text-lg font-semibold">{plan.name}</h3>

                            <p className="text-2xl font-bold mt-2">
                                ₹{plan.price}/{plan.interval}
                            </p>

                            <ul className="mt-4 space-y-2 text-sm">
                                {plan.features.map((f, i) => (
                                    <li key={i}>✓ {f}</li>
                                ))}
                            </ul>

                            {/* Button Logic */}
                            {isCurrent ? (
                                <button
                                    disabled
                                    className="mt-6 w-full py-2 bg-gray-300 rounded-lg"
                                >
                                    Current Plan
                                </button>
                            ) : (
                                <button
                                    onClick={() => handleSubscribe(plan.priceId)}
                                    disabled={isPending}
                                    className="mt-6 w-full py-2 bg-black text-white rounded-lg"
                                >
                                    {isPro ? "Upgrade Plan" : "Subscribe"}
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}