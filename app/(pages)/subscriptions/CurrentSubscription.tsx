
import { StripeCustomerPortal } from "@/actions/stripeCustomerPortal";

interface Props {
    user: any;
    subscription: any;
}

export default function CurrentSubscription({ user, subscription }: Props) {
    const isActive = user.isPro && subscription;

    return (
        <div className="border rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-4">Current Plan</h2>

            {!isActive ? (
                <div>
                    <p className="text-neutral-500">You are on Free Plan</p>
                    <p className="text-sm mt-2">Upgrade to unlock premium features</p>
                </div>
            ) : (
                <div className="space-y-2">
                    <p className="font-semibold">{subscription.planName}</p>

                    <p className="text-sm text-green-600">
                        Status: {subscription.subscriptionStatus}
                    </p>

                    <p className="text-sm text-neutral-500">
                        Renews on:{" "}
                        {new Date(subscription.stripeCurrentPeriodEnd).toDateString()}
                    </p>

                    {/* Manage Billing */}
                    <form action={StripeCustomerPortal}>
                        <input
                            type="hidden"
                            name="stripeCustomerId"
                            value={subscription.stripeCustomerId}
                        />

                        <button className="mt-4 px-4 py-2 bg-black text-white rounded-lg">
                            Manage Billing
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}