// Setzt den Plan eines Nutzers direkt in der DB – praktisch zum lokalen Testen
// der Plan-Limits, solange Stripe/Webhook noch nicht produktiv läuft.
//   node scripts/set-plan.mjs <email> <free|pro|business>
import pg from "pg";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const [email, plan] = process.argv.slice(2);
if (!email || !["free", "pro", "business"].includes(plan)) {
  console.error("Nutzung: node scripts/set-plan.mjs <email> <free|pro|business>");
  process.exit(1);
}

const db = new pg.Client({
  connectionString: process.env.SUPABASE_DB_URL,
  ssl: { rejectUnauthorized: false },
});
await db.connect();
try {
  const res = await db.query(
    `update public.profiles p set plan = $2
       from auth.users u
      where u.id = p.id and u.email = $1
      returning p.id`,
    [email, plan],
  );
  if (res.rowCount === 0) console.log(`✗ Kein Nutzer mit E-Mail ${email} gefunden.`);
  else console.log(`✓ ${email} ist jetzt auf Plan „${plan}".`);
} finally {
  await db.end();
}
