import { Prisma } from "@prisma/client";

import { db } from "@/lib/db";

type UserWithSubscription = Prisma.UserGetPayload<{
  include: {
    subscription: true;
  };
}>;

export async function getUserWithSubscription(
  userId: number
): Promise<UserWithSubscription | null> {
  return db.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      subscription: true,
    },
  });
}

export function hasActiveSubscription(
  user: UserWithSubscription | null
): boolean {
  if (!user) return false;

  if (!user.isPro) return false;

  if (!user.subscription) return false;

  if (user.subscription.subscriptionStatus !== "active") return false;

  if (
    user.subscription.stripeCurrentPeriodEnd &&
    user.subscription.stripeCurrentPeriodEnd < new Date()
  ) {
    return false;
  }

  return true;
}