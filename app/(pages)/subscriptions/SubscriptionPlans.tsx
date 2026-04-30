'use client';

import { useTransition } from "react";
import { createCheckoutSession } from "@/actions/stripe";
import { CheckCircle2, Loader2, ArrowRight, Sparkles } from "lucide-react";

// ✅ import type only
import type { Plan } from "@/lib/data/subscription-plans";

interface Props {
    role: "CANDIDATE" | "RECRUITER" | "ORGANIZATION";
    userId: number;
    currentPriceId?: string | null;
    isPro: boolean;

    // ✅ FIX: proper type
    plans: Record<"CANDIDATE" | "RECRUITER" | "ORGANIZATION", Plan[]>;
}

export default function SubscriptionPlans({
    role,
    userId,
    currentPriceId,
    isPro,
    plans
}: Props) {
    const [isPending, startTransition] = useTransition();

    // ✅ FIX: use props instead of PLANS
    const rolePlans = plans[role];

    const handleSubscribe = (priceId: string) => {
        startTransition(async () => {
            const res = await createCheckoutSession({ userId, priceId });
            if (res?.url) window.location.href = res.url;
        });
    };

    return (
        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">

            {/* Header */}
            <div className="px-6 sm:px-8 py-5 border-b border-slate-100">
                <div className="flex items-center gap-2 mb-0.5">
                    <Sparkles className="w-4 h-4 text-indigo-600" strokeWidth={2} />
                    <h2 className="text-base font-bold text-slate-800">Available Plans</h2>
                </div>
                <p className="text-xs text-slate-400">
                    {isPro ? "You're on a paid plan. Upgrade or switch anytime." : "Choose a plan to unlock premium features for your role."}
                </p>
            </div>

            <div className="p-6 sm:p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {rolePlans.map((plan) => {
                        const isCurrent = currentPriceId === plan.priceId;
                        const isYearly = plan.interval === "year";
                        const isLoadingThis = isPending;

                        return (
                            <div
                                key={plan.priceId}
                                className={`relative flex flex-col rounded-2xl border-2 p-6 transition-all duration-200 ${isCurrent
                                        ? "border-indigo-400 bg-indigo-50/50"
                                        : plan.popular
                                            ? "border-violet-300 bg-violet-50/30"
                                            : "border-slate-200 bg-white hover:border-slate-300"
                                    }`}
                            >
                                {/* Popular / Current badge */}
                                {(isCurrent || plan.popular) && (
                                    <div className="absolute -top-3 left-5">
                                        <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-bold tracking-wide ${isCurrent
                                                ? "bg-indigo-600 text-white"
                                                : "bg-violet-600 text-white"
                                            }`}>
                                            {isCurrent ? "✓ Current Plan" : "Most Popular"}
                                        </span>
                                    </div>
                                )}

                                {/* Plan name + savings */}
                                <div className="flex items-center gap-2 mb-4 mt-1">
                                    <p className={`text-sm font-bold uppercase tracking-wide ${isCurrent ? "text-indigo-700" : "text-slate-700"}`}>
                                        {plan.name}
                                    </p>
                                    {isYearly && (
                                        <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[11px] font-semibold text-emerald-600">
                                            Save 20%
                                        </span>
                                    )}
                                </div>

                                {/* Price */}
                                <div className="flex items-end gap-1 mb-5">
                                    <span className="text-xl font-semibold text-slate-500 mb-1">₹</span>
                                    <span className={`text-4xl font-bold tracking-tight leading-none ${isCurrent ? "text-indigo-900" : "text-slate-900"}`}>
                                        {plan.price.toLocaleString("en-IN")}
                                    </span>
                                    <span className="text-sm text-slate-400 mb-1 ml-0.5">/{plan.interval}</span>
                                </div>

                                {/* Divider */}
                                <div className={`h-px mb-5 ${isCurrent ? "bg-indigo-200" : "bg-slate-100"}`} />

                                {/* Features */}
                                <ul className="space-y-2.5 flex-1 mb-6">
                                    {plan.features.map((feature, i) => (
                                        <li key={i} className="flex items-start gap-2.5 text-sm">
                                            <span className="mt-0.5 flex-shrink-0 w-4 h-4 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                                                <CheckCircle2 className="w-2.5 h-2.5 text-emerald-500" strokeWidth={3} />
                                            </span>
                                            <span className={isCurrent ? "text-indigo-800" : "text-slate-600"}>
                                                {feature}
                                            </span>
                                        </li>
                                    ))}
                                </ul>

                                {/* CTA */}
                                {isCurrent ? (
                                    <button
                                        disabled
                                        className="w-full flex items-center justify-center gap-2 rounded-xl border-2 border-indigo-200 bg-indigo-50 py-2.5 text-sm font-semibold text-indigo-400 cursor-default"
                                    >
                                        <CheckCircle2 className="w-4 h-4" strokeWidth={2} />
                                        Current Plan
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => handleSubscribe(plan.priceId)}
                                        disabled={isPending}
                                        className={`w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed ${plan.popular
                                                ? "bg-indigo-600 text-white hover:bg-indigo-500 shadow-sm shadow-indigo-200"
                                                : "bg-slate-900 text-white hover:bg-slate-700"
                                            }`}
                                    >
                                        {isLoadingThis ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                Redirecting...
                                            </>
                                        ) : (
                                            <>
                                                {isPro ? "Switch Plan" : "Subscribe"}
                                                <ArrowRight className="w-4 h-4" />
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Footer note */}
                <p className="text-xs text-slate-400 text-center mt-6">
                    Payments are processed securely by Stripe. Cancel anytime from your billing portal.
                </p>
            </div>
        </div>
    );
}