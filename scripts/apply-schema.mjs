import { readFileSync } from "node:fs";
import { Client } from "pg";

const url = process.env.DATABASE_URL;
if (!url || url.includes("[YOUR-PASSWORD]")) {
  console.error("Define DATABASE_URL con la contraseña real de Supabase.");
  process.exit(1);
}

const sql = readFileSync(new URL("../supabase/schema.sql", import.meta.url), "utf8");
const client = new Client({ connectionString: url, ssl: { rejectUnauthorized: false } });
await client.connect();
await client.query(sql);
await client.end();
console.log("Esquema aplicado.");
