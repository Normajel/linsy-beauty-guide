import { readFile } from "node:fs/promises";
import { neon } from "@neondatabase/serverless";

const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL is required for the Linsy migration.");
const sql = neon(url);
try {
  for (const version of ["001_publication", "002_billing", "003_launch_grants"]) {
    const migration = await readFile(new URL(`../neon/${version}.sql`, import.meta.url), "utf8");
    await sql.query(`DO $linsy_migration$
    BEGIN
      PERFORM pg_advisory_xact_lock(77255992);
      CREATE TABLE IF NOT EXISTS public.linsy_schema_migrations (version text primary key);
      IF NOT EXISTS (SELECT 1 FROM public.linsy_schema_migrations WHERE version = '${version}') THEN
        ${migration}
        INSERT INTO public.linsy_schema_migrations (version) VALUES ('${version}');
      END IF;
    END
  $linsy_migration$;`);
  }
  const [result] = await sql`select (select count(*)::int from linsy.categories) categories,
    (select count(*)::int from linsy.communes) communes`;
  if (result.categories !== 11 || result.communes !== 38)
    throw new Error("Unexpected Linsy catalog.");
  console.log("Neon schema verified: 11 categories, 38 communes.");
} catch (error) {
  console.error("Neon migration failed:", error?.code ?? "unknown");
  process.exitCode = 1;
}
