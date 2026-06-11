// Legt einen bestätigten Auth-User direkt in der DB an (ohne E-Mail-Versand).
// Praktisch, solange OAuth/E-Mail-Bestätigung im Supabase-Dashboard noch nicht
// eingerichtet ist.
//   node scripts/create-user.mjs <email> <passwort> [name]
import pg from "pg";
import dotenv from "dotenv";
import { randomUUID } from "node:crypto";
dotenv.config({ path: ".env.local" });

const [email, password, name = ""] = process.argv.slice(2);
if (!email || !password) {
  console.error("Nutzung: node scripts/create-user.mjs <email> <passwort> [name]");
  process.exit(1);
}

const db = new pg.Client({
  connectionString: process.env.SUPABASE_DB_URL,
  ssl: { rejectUnauthorized: false },
});
await db.connect();

try {
  const existing = await db.query(`select id from auth.users where email = $1`, [
    email,
  ]);
  if (existing.rows.length) {
    console.log(`ℹ User ${email} existiert bereits (${existing.rows[0].id}).`);
    process.exit(0);
  }

  const id = randomUUID();
  await db.query(
    `insert into auth.users (
       instance_id, id, aud, role, email, encrypted_password,
       email_confirmed_at, created_at, updated_at,
       raw_app_meta_data, raw_user_meta_data,
       confirmation_token, recovery_token, email_change_token_new, email_change
     ) values (
       '00000000-0000-0000-0000-000000000000', $1, 'authenticated', 'authenticated',
       $2, extensions.crypt($3, extensions.gen_salt('bf')),
       now(), now(), now(),
       '{"provider":"email","providers":["email"]}', $4,
       '', '', '', ''
     )`,
    [id, email, password, JSON.stringify(name ? { full_name: name } : {})],
  );
  console.log(`✓ Bestätigter User angelegt: ${email}`);
  console.log(`  Login unter http://localhost:3000/login`);
} catch (e) {
  console.error("✗ Fehler:", e.message);
  process.exitCode = 1;
} finally {
  await db.end();
}
