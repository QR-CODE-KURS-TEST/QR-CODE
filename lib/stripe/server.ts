import Stripe from "stripe";

/** Server-seitiger Stripe-Client (Secret Key – niemals clientseitig). */
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  typescript: true,
});
