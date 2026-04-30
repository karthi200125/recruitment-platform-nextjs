import { StripeCustomerPortal } from "@/actions/stripeCustomerPortal";
import {
    Crown,
    Zap,
    Calendar,
    CreditCard,
    CheckCircle2,
    ArrowUpRight,
} from "lucide-react";

// ✅ Match Prisma schema properly
interface Subscription {
    planName: string | null;
    subscriptionStatus: string;
    stripeCurrentPeriodEnd: Date | null;
}

interface User {
    isPro: boolean;
    stripeCustomerId: string | null; // 🔥 moved here
}

interface Props {
    user: User;
    subscription: Subscription | null;
}

function formatDate(date: Date | null): string {
    if (!date) return "—";

    return new Intl.DateTimeFormat("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
    }).format(new Date(date));
}

export default function CurrentSubscription({
    user,
    subscription,
}: Props) {
    const isActive =
        user.isPro &&
        subscription &&
        subscription.subscriptionStatus === "active";

    const isStatusActive =
        subscription?.subscriptionStatus?.toLowerCase() === "active";

    return (
        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">

            {/* Top accent */}
            <div
                className={`h-1 w-full ${isActive
                        ? "bg-gradient-to-r from-indigo-500 to-violet-500"
                        : "bg-slate-200"
                    }`}
            />

            <div className="p-6 sm:p-8">

                {/* Header */}
                <div className="flex items-start justify-between gap-4 mb-6">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Crown
                                className={`w-4 h-4 ${isActive ? "text-indigo-600" : "text-slate-400"
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
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-semibold text-emerald-600">
                            <CheckCircle2 className="w-3 h-3" strokeWidth={2} />
                            {isStatusActive ? "Active" : subscription?.subscriptionStatus}
                        </span>
                    )}
                </div>

                {!isActive ? (
                    // ❌ FREE PLAN
                    <div className="flex items-start gap-4 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-5">
                        <div className="w-10 h-10 rounded-xl bg-slate-200 flex items-center justify-center">
                            <Zap className="w-5 h-5 text-slate-400" strokeWidth={1.75} />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-slate-700 mb-0.5">
                                Free Plan
                            </p>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                You're on the free plan. Upgrade to unlock AI matching,
                                unlimited applications, priority visibility, and more.
                            </p>
                        </div>
                    </div>
                ) : (
                    // ✅ ACTIVE PLAN
                    <div className="space-y-4">

                        {/* Plan */}
                        <div className="flex items-center gap-3 rounded-xl bg-indigo-50 border border-indigo-100 px-5 py-4">
                            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center">
                                <Crown className="w-4 h-4 text-white" strokeWidth={2} />
                            </div>
                            <div>
                                <p className="text-xs text-indigo-500 font-medium uppercase tracking-widest">
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
                                <div className="flex items-center gap-1.5 mb-1">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                    <p className="text-[11px] font-semibold text-slate-500 uppercase">
                                        Status
                                    </p>
                                </div>
                                <p className="text-sm font-bold text-slate-800 capitalize">
                                    {subscription?.subscriptionStatus}
                                </p>
                            </div>

                            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                                <div className="flex items-center gap-1.5 mb-1">
                                    <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                                    <p className="text-[11px] font-semibold text-slate-500 uppercase">
                                        Renews on
                                    </p>
                                </div>
                                <p className="text-sm font-bold text-slate-800">
                                    {formatDate(subscription?.stripeCurrentPeriodEnd ?? null)}
                                </p>
                            </div>
                        </div>

                        {/* Billing Portal */}
                        {user.stripeCustomerId && (
                            <form action={StripeCustomerPortal}>
                                <input
                                    type="hidden"
                                    name="stripeCustomerId"
                                    value={user.stripeCustomerId}
                                />
                                <button
                                    type="submit"
                                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                                >
                                    <CreditCard className="w-4 h-4 text-slate-500" />
                                    Manage Billing
                                    <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
                                </button>
                            </form>
                        )}

                    </div>
                )}
            </div>
        </div>
    );
}