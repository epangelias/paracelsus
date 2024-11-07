import Stripe from "stripe";
import { AssertionError } from "@std/assert";

const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY");

export function isStripeEnabled() {
    return Deno.env.has("STRIPE_SECRET_KEY");
}

export function getStripePremiumPlanPriceId() {
    return Deno.env.get(
        "STRIPE_PREMIUM_PLAN_PRICE_ID",
    );
}

export const stripe = new Stripe(STRIPE_SECRET_KEY || "x", {
    apiVersion: "2024-10-28.acacia",
    httpClient: Stripe.createFetchHttpClient(),
});

export function assertIsPrice(value: unknown): asserts value is Stripe.Price {
    if (value === undefined || value === null || typeof value === "string") {
        throw new AssertionError("Default price must be of type `Stripe.Price`");
    }
}
