// Verifiziert das Schema: listet Tabellen + RLS-Status.
import pg from "pg";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const client = new pg.Client({
  connectionString: process.env.SUPABASE_DB_URL,
  ssl: { rejectUnauthorized: false },
});

await client.connect();
const { rows } = await client.query(`
  select c.relname as table, c.relrowsecurity as rls,
         (select count(*) from pg_policies p where p.tablename = c.relname) as policies
  from pg_class c
  join pg_namespace n on n.oid = c.relnamespace
  where n.nspname = 'public' and c.relkind = 'r'
  order by c.relname;
`);
console.table(rows);
await client.end();
