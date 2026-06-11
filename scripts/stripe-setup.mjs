// Legt die Stripe-Produkte & Preise idempotent an und gibt die Price-IDs aus,
// die du in .env.local einträgst.
//   node scripts/stripe-setup.mjs
import Stripe from "stripe";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const CONFIG = [
  {
    tier: "pro",
    name: "Scanvio Pro",
    description: "50 getrackte QR-Codes, PDF/SVG-Export, volle Analytics.",
    prices: { monthly: 1200, yearly: 9900 },
  },
  {
    tier: "business",
    name: "Scanvio Business",
    description: "Unbegrenzte Codes, eigene Domain, API, Geo-Analytics.",
    prices: { monthly: 3900, yearly: 34900 },
  },
];

async function findProduct(tier) {
  const all = await stripe.products.list({ limit: 100, active: true });
  return all.data.find((p) => p.metadata?.app === "scanvio" && p.metadata?.tier === tier);
}

async function findPrice(productId, interval, amount) {
  const prices = await stripe.prices.list({ product: productId, limit: 100 });
  return prices.data.find(
    (p) =>
      p.recurring?.interval === interval &&
      p.unit_amount === amount &&
      p.currency === "eur",
  );
}

const envLines = [];

for (const c of CONFIG) {
  let product = await findProduct(c.tier);
  if (!product) {
    product = await stripe.products.create({
      name: c.name,
      description: c.description,
      metadata: { app: "scanvio", tier: c.tier },
    });
    console.log(`✓ Produkt angelegt: ${c.name}`);
  } else {
    console.log(`• Produkt existiert: ${c.name}`);
  }

  for (const [interval, amount] of [
    ["month", c.prices.monthly],
    ["year", c.prices.yearly],
  ]) {
    let price = await findPrice(product.id, interval, amount);
    if (!price) {
      price = await stripe.prices.create({
        product: product.id,
        currency: "eur",
        unit_amount: amount,
        recurring: { interval },
        metadata: { app: "scanvio", tier: c.tier },
      });
      console.log(`  ✓ Preis ${interval}: ${(amount / 100).toFixed(2)} €`);
    } else {
      console.log(`  • Preis ${interval} existiert: ${(amount / 100).toFixed(2)} €`);
    }
    const key = `STRIPE_PRICE_${c.tier.toUpperCase()}_${
      interval === "month" ? "MONTHLY" : "YEARLY"
    }`;
    envLines.push(`${key}=${price.id}`);
  }
}

console.log("\n── Diese Zeilen in .env.local eintragen ──\n");
console.log(envLines.join("\n"));
