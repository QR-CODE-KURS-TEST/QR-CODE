// Führt eine oder mehrere .sql-Dateien gegen die Supabase-Postgres-DB aus.
// Nutzung:  node scripts/db-exec.mjs supabase/migrations/0001_init.sql [weitere.sql ...]
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const connectionString = process.env.SUPABASE_DB_URL;
if (!connectionString) {
  console.error("✗ SUPABASE_DB_URL fehlt in .env.local");
  process.exit(1);
}

const files = process.argv.slice(2);
if (files.length === 0) {
  console.error("✗ Bitte mindestens eine .sql-Datei angeben.");
  process.exit(1);
}

const client = new pg.Client({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

try {
  await client.connect();
  for (const file of files) {
    const sql = readFileSync(resolve(file), "utf8");
    console.log(`→ Führe aus: ${file}`);
    await client.query(sql);
    console.log(`✓ Fertig: ${file}`);
  }
  console.log("✓ Alle Migrationen erfolgreich angewendet.");
} catch (err) {
  console.error("✗ Fehler:", err.message);
  process.exitCode = 1;
} finally {
  await client.end();
}
