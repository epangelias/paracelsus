#!/usr/bin/env -S deno run -A

import type Stripe from "stripe";
import { siteData } from '@/lib/siteData.ts';
import { isStripeEnabled, stripe } from '@/lib/stripe.ts';

async function createPremiumTierProduct(stripe: Stripe) {
    return await stripe.products.create({
        name: "Premium",
        description: "Unlock premium features.",
        default_price_data: {
            unit_amount: 500,
            currency: "usd",
            recurring: {
                interval: "month",
            },
        },
    });
}

async function createDefaultPortalConfiguration(
    stripe: Stripe,
    product:
        Stripe.BillingPortal.ConfigurationCreateParams.Features.SubscriptionUpdate.Product,
) {
    return await stripe.billingPortal.configurations.create({
        features: {
            payment_method_update: {
                enabled: true,
            },
            customer_update: {
                allowed_updates: ["email", "name"],
                enabled: true,
            },
            subscription_cancel: {
                enabled: true,
                mode: "immediately",
            },
            subscription_update: {
                enabled: true,
                default_allowed_updates: ["price"],
                products: [product],
            },
            invoice_history: { enabled: true },
        },
        business_profile: {
            headline: siteData.description,
        },
    });
}

async function main() {
    if (!isStripeEnabled()) throw new Error("Stripe is disabled.");

    const product = await createPremiumTierProduct(stripe);

    if (typeof product.default_price !== "string") return;

    await createDefaultPortalConfiguration(stripe, {
        prices: [product.default_price],
        product: product.id,
    });

    console.log("Set the ENV key: STRIPE_PREMIUM_PLAN_PRICE_ID=" + product.default_price);
}

if (import.meta.main) {
    await main();
}
