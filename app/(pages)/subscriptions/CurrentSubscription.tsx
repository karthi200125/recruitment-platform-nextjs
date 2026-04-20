import { StripeCustomerPortal } from "@/actions/stripeCustomerPortal";
import { Crown, Zap, Calendar, CreditCard, CheckCircle2, ArrowUpRight } from "lucide-react";

interface Subscription {
    planName: string;
    subscriptionStatus: string;
    stripeCurrentPeriodEnd: Date | string;
    stripeCustomerId: string;
}

interface User {
    isPro: boolean;
}

interface Props {
    user: User;
    subscription: Subscription | null;
}

function formatDate(date: Date | string): string {
    return new Intl.DateTimeFormat("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
    }).format(new Date(date));
}

export default function CurrentSubscription({ user, subscription }: Props) {
    const isActive = user.isPro && subscription;
    const isStatusActive = subscription?.subscriptionStatus?.toLowerCase() === "active";

    return (
        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">

            {/* Top accent line */}
            <div className={`h-1 w-full ${isActive ? "bg-gradient-to-r from-indigo-500 to-violet-500" : "bg-slate-200"}`} />

            <div className="p-6 sm:p-8">

                {/* Header */}
                <div className="flex items-start justify-between gap-4 mb-6">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Crown className={`w-4 h-4 ${isActive ? "text-indigo-600" : "text-slate-400"}`} strokeWidth={2} />
                            <h2 className="text-base font-bold text-slate-800">Current Plan</h2>
                        </div>
                        <p className="text-xs text-slate-400">
                            {isActive ? "Your subscription is active and renewing automatically." : "Upgrade to unlock premium hiring features."}
                        </p>
                    </div>
                    {isActive && (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-semibold text-emerald-600 flex-shrink-0">
                            <CheckCircle2 className="w-3 h-3" strokeWidth={2} />
                            {isStatusActive ? "Active" : subscription?.subscriptionStatus}
                        </span>
                    )}
                </div>

                {!isActive ? (
                    /* Free plan state */
                    <div className="flex items-start gap-4 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-5">
                        <div className="w-10 h-10 rounded-xl bg-slate-200 flex items-center justify-center flex-shrink-0">
                            <Zap className="w-5 h-5 text-slate-400" strokeWidth={1.75} />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-slate-700 mb-0.5">Free Plan</p>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                You're on the free plan. Upgrade to unlock AI matching, unlimited applications, priority visibility, and more.
                            </p>
                        </div>
                    </div>
                ) : (
                    /* Active subscription state */
                    <div className="space-y-4">

                        {/* Plan name */}
                        <div className="flex items-center gap-3 rounded-xl bg-indigo-50 border border-indigo-100 px-5 py-4">
                            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center flex-shrink-0">
                                <Crown className="w-4 h-4 text-white" strokeWidth={2} />
                            </div>
                            <div>
                                <p className="text-xs text-indigo-500 font-medium uppercase tracking-widest">Active Plan</p>
                                <p className="text-base font-bold text-indigo-900">{subscription!.planName}</p>
                            </div>
                        </div>

                        {/* Stats row */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                                <div className="flex items-center gap-1.5 mb-1">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" strokeWidth={2} />
                                    <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest">Status</p>
                                </div>
                                <p className="text-sm font-bold text-slate-800 capitalize">
                                    {subscription!.subscriptionStatus.toLowerCase()}
                                </p>
                            </div>
                            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                                <div className="flex items-center gap-1.5 mb-1">
                                    <Calendar className="w-3.5 h-3.5 text-indigo-500" strokeWidth={2} />
                                    <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest">Renews on</p>
                                </div>
                                <p className="text-sm font-bold text-slate-800">
                                    {formatDate(subscription!.stripeCurrentPeriodEnd)}
                                </p>
                            </div>
                        </div>

                        {/* Manage billing */}
                        <form action={StripeCustomerPortal}>
                            <input type="hidden" name="stripeCustomerId" value={subscription!.stripeCustomerId} />
                            <button
                                type="submit"
                                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200"
                            >
                                <CreditCard className="w-4 h-4 text-slate-500" strokeWidth={1.75} />
                                Manage Billing
                                <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}