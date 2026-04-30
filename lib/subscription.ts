// access control logic related to subscription status and plan details

import { db } from "@/lib/db";

export async function getUserWithSubscription(userId: number) {
  return db.user.findUnique({
    where: { id: userId },
    include: {
      subscription: true,
    },
  });
}

export function hasActiveSubscription(user: any): boolean {
  if (!user) return false;

  if (!user.isPro) return false;

  if (!user.subscription) return false;

  if (user.subscription.subscriptionStatus !== "active") return false;

  if (
    user.subscription.stripeCurrentPeriodEnd &&
    new Date(user.subscription.stripeCurrentPeriodEnd) < new Date()
  ) {
    return false;
  }

  return true;
}