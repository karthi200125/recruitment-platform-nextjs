'use server';

import { db } from '@/lib/db';
import { headers } from 'next/headers';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-01-27.acacia',
});

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get('stripe-signature');

  if (!signature) {
    return new Response('Missing Stripe signature', { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error('❌ Webhook signature verification failed:', err);
    return new Response('Invalid signature', { status: 400 });
  }

  try {
    switch (event.type) {
      /**
       * ✅ 1. Checkout Completed (Initial Subscription)
       */
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;

        if (!session.subscription || !session.customer) break;

        const subscription = await stripe.subscriptions.retrieve(
          session.subscription as string
        );

        const customerId = session.customer as string;

        // 🔥 IMPORTANT: Find user using customerId (NOT metadata)
        const user = await db.user.findFirst({
          where: {
            subscription: {
              some: {
                stripeCustomerId: customerId,
              },
            },
          },
        });

        if (!user) {
          console.error('User not found for customer:', customerId);
          break;
        }

        await db.subscription.upsert({
          where: { userId: user.id },
          update: {
            stripeSubscriptionId: subscription.id,
            stripePriceId: subscription.items.data[0].price.id,
            stripeCurrentPeriodEnd: new Date(
              subscription.current_period_end * 1000
            ),
            subscriptionStatus: subscription.status,
            amount:
              (subscription.items.data[0].price.unit_amount ?? 0) / 100,
            billingInterval:
              subscription.items.data[0].price.recurring?.interval,
          },
          create: {
            userId: user.id,
            stripeCustomerId: customerId,
            stripeSubscriptionId: subscription.id,
            stripePriceId: subscription.items.data[0].price.id,
            stripeCurrentPeriodEnd: new Date(
              subscription.current_period_end * 1000
            ),
            subscriptionStatus: subscription.status,
            amount:
              (subscription.items.data[0].price.unit_amount ?? 0) / 100,
            billingInterval:
              subscription.items.data[0].price.recurring?.interval,
          },
        });

        await db.user.update({
          where: { id: user.id },
          data: { isPro: true },
        });

        break;
      }

      /**
       * ✅ 2. Subscription Updated (upgrade/downgrade/cancel)
       */
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;

        const customerId = subscription.customer as string;

        const user = await db.user.findFirst({
          where: {
            subscription: {
              some: { stripeCustomerId: customerId },
            },
          },
        });

        if (!user) break;

        const status = subscription.status;

        const isActive = ['active', 'trialing'].includes(status);

        await db.subscription.update({
          where: { userId: user.id },
          data: {
            subscriptionStatus: status,
            stripeCurrentPeriodEnd: new Date(
              subscription.current_period_end * 1000
            ),
            stripePriceId: subscription.items.data[0].price.id,
          },
        });

        await db.user.update({
          where: { id: user.id },
          data: { isPro: isActive },
        });

        break;
      }

      /**
       * ✅ 3. Subscription Deleted (expired/canceled)
       */
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;

        const customerId = subscription.customer as string;

        const user = await db.user.findFirst({
          where: {
            subscription: {
              some: { stripeCustomerId: customerId },
            },
          },
        });

        if (!user) break;

        await db.subscription.update({
          where: { userId: user.id },
          data: {
            subscriptionStatus: 'canceled',
            canceledAt: new Date(),
          },
        });

        await db.user.update({
          where: { id: user.id },
          data: { isPro: false },
        });

        break;
      }

      /**
       * ✅ 4. Payment Failed
       */
      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;

        const customerId = invoice.customer as string;

        const user = await db.user.findFirst({
          where: {
            subscription: {
              some: { stripeCustomerId: customerId },
            },
          },
        });

        if (!user) break;

        await db.user.update({
          where: { id: user.id },
          data: { isPro: false },
        });

        break;
      }

      /**
       * ✅ 5. Payment Success (renewal)
       */
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;

        const customerId = invoice.customer as string;

        const user = await db.user.findFirst({
          where: {
            subscription: {
              some: { stripeCustomerId: customerId },
            },
          },
        });

        if (!user) break;

        await db.user.update({
          where: { id: user.id },
          data: { isPro: true },
        });

        break;
      }

      default:
        console.log(`Unhandled event: ${event.type}`);
    }
  } catch (error) {
    console.error('❌ Webhook error:', error);
    return new Response('Webhook handler failed', { status: 500 });
  }

  return new Response('OK', { status: 200 });
}