import { StripeCustomerPortal } from "@/actions/subscription/stripe-customer-portal";

import {
    Crown,
    Zap,
    Calendar,
    CreditCard,
    CheckCircle2,
    ArrowUpRight,
} from "lucide-react";

interface Subscription {
    planName: string | null;
    subscriptionStatus: string;
    stripeCurrentPeriodEnd: Date | null;
}

interface User {
    isPro: boolean;
    stripeCustomerId: string | null;
}

interface Props {
    user: User;
    subscription: Subscription | null;
}

function formatDate(date: Date | null): string {
    if (!date) {
        return "—";
    }

    return new Intl.DateTimeFormat("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
    }).format(date);
}

export default function CurrentSubscription({
    user,
    subscription,
}: Props) {
    const isActive =
        user.isPro &&
        subscription?.subscriptionStatus === "active";

    return (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            {/* Top accent */}
            <div
                className={`h-1 w-full ${isActive
                    ? "bg-gradient-to-r from-indigo-500 to-violet-500"
                    : "bg-slate-200"
                    }`}
            />

            <div className="p-6 sm:p-8">
                {/* Header */}
                <div className="mb-6 flex items-start justify-between gap-4">
                    <div>
                        <div className="mb-1 flex items-center gap-2">
                            <Crown
                                className={`h-4 w-4 ${isActive
                                    ? "text-indigo-600"
                                    : "text-slate-400"
                                    }`}
                                strokeWidth={2}
                            />

                            <h2 className="text-base font-bold text-slate-800">
                                Current Plan
                            </h2>
                        </div>

                        <p className="text-xs text-slate-400">
                            {isActive
                                ? "Your subscription is active and renewing automatically."
                                : "Upgrade to unlock premium hiring features."}
                        </p>
                    </div>

                    {isActive && (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
                            <CheckCircle2
                                className="h-3 w-3"
                                strokeWidth={2}
                            />
                            Active
                        </span>
                    )}
                </div>

                {!isActive ? (
                    <div className="flex items-start gap-4 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-5">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-200">
                            <Zap
                                className="h-5 w-5 text-slate-400"
                                strokeWidth={1.75}
                            />
                        </div>

                        <div>
                            <p className="mb-0.5 text-sm font-semibold text-slate-700">
                                Free Plan
                            </p>

                            <p className="text-xs leading-relaxed text-slate-400">
                                You&apos;re on the free plan. Upgrade to unlock
                                AI matching, unlimited applications, priority
                                visibility, and more.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {/* Active plan */}
                        <div className="flex items-center gap-3 rounded-xl border border-indigo-100 bg-indigo-50 px-5 py-4">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600">
                                <Crown
                                    className="h-4 w-4 text-white"
                                    strokeWidth={2}
                                />
                            </div>

                            <div>
                                <p className="text-xs font-medium uppercase tracking-widest text-indigo-500">
                                    Active Plan
                                </p>

                                <p className="text-base font-bold text-indigo-900">
                                    {subscription?.planName ?? "Pro Plan"}
                                </p>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                                <div className="mb-1 flex items-center gap-1.5">
                                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />

                                    <p className="text-[11px] font-semibold uppercase text-slate-500">
                                        Status
                                    </p>
                                </div>

                                <p className="text-sm font-bold capitalize text-slate-800">
                                    {subscription?.subscriptionStatus}
                                </p>
                            </div>

                            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                                <div className="mb-1 flex items-center gap-1.5">
                                    <Calendar className="h-3.5 w-3.5 text-indigo-500" />

                                    <p className="text-[11px] font-semibold uppercase text-slate-500">
                                        Renews on
                                    </p>
                                </div>

                                <p className="text-sm font-bold text-slate-800">
                                    {formatDate(
                                        subscription?.stripeCurrentPeriodEnd ??
                                        null
                                    )}
                                </p>
                            </div>
                        </div>

                        {/* Billing portal */}
                        {user.stripeCustomerId && (
                            <form action={StripeCustomerPortal}>
                                <input
                                    type="hidden"
                                    name="stripeCustomerId"
                                    value={user.stripeCustomerId}
                                />

                                <button
                                    type="submit"
                                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                                >
                                    <CreditCard className="h-4 w-4 text-slate-500" />

                                    Manage Billing

                                    <ArrowUpRight className="h-3.5 w-3.5 text-slate-400" />
                                </button>
                            </form>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
}