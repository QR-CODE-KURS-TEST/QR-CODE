import Stripe from "stripe";

/**
 * Lazy-initialisierter Stripe-Client. Wird NICHT beim Modul-Import erzeugt,
 * sondern erst beim ersten Zugriff – so bricht ein fehlender STRIPE_SECRET_KEY
 * (z. B. im Build, bevor Env-Variablen gesetzt sind) nicht den Build ab.
 */
let _stripe: Stripe | null = null;

function getStripe(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error(
        "STRIPE_SECRET_KEY fehlt – in den Vercel-Env-Variablen setzen.",
      );
    }
    _stripe = new Stripe(key, { typescript: true });
  }
  return _stripe;
}

export const stripe = new Proxy({} as Stripe, {
  get(_target, prop) {
    const client = getStripe();
    const value = client[prop as keyof Stripe];
    return typeof value === "function" ? value.bind(client) : value;
  },
});
