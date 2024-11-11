import Stripe from "stripe";

const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY") || "X";

export function isStripeEnabled() {
    return Deno.env.has("STRIPE_SECRET_KEY");
}

export function getStripePremiumPlanPriceId() {
    return Deno.env.get(
        "STRIPE_PREMIUM_PLAN_PRICE_ID",
    );
}

export const stripe = new Stripe(STRIPE_SECRET_KEY!, {
    apiVersion: "2024-10-28.acacia",
    httpClient: Stripe.createFetchHttpClient(),
});