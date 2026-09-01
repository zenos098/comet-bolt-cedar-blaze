/**
 * Dual-mode database helper: Neon Postgres when DATABASE_URL is set, else
 * embedded PGLite for the live preview. Server-only.
 */
import { PGlite } from "@electric-sql/pglite";
import pg from "pg";
import {
  isMigrationFile,
  pendingMigrations,
} from "../../scripts/migration-plan.mjs";

const databaseUrl = process.env.DATABASE_URL?.trim() || "";

export const dbSource = databaseUrl ? "postgres" : "pglite";

const g = globalThis as typeof globalThis & {
  __grokPglite?: PGlite;
  __grokPgliteReady?: Promise<PGlite>;
  __grokPgPool?: pg.Pool;
};

const migrationModules = import.meta.glob("../../migrations/*.sql", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

async function applyPgliteMigrations(client: PGlite) {
  await client.query(
    "CREATE TABLE IF NOT EXISTS _migrations (name TEXT PRIMARY KEY, applied_at TIMESTAMPTZ NOT NULL DEFAULT now())",
  );
  const appliedRes = await client.query<{ name: string }>("SELECT name FROM _migrations");
  const applied = appliedRes.rows.map((r) => r.name);
  const paths = Object.keys(migrationModules).filter(isMigrationFile);
  for (const { name, path } of pendingMigrations(paths, applied)) {
    const text = migrationModules[path];
    if (!text) continue;
    await client.exec(text);
    await client.query("INSERT INTO _migrations (name) VALUES ($1)", [name]);
  }
}

export async function getPglite(): Promise<PGlite> {
  if (g.__grokPglite) return g.__grokPglite;
  if (!g.__grokPgliteReady) {
    g.__grokPgliteReady = (async () => {
      const client = new PGlite();
      await applyPgliteMigrations(client);
      g.__grokPglite = client;
      return client;
    })();
  }
  return g.__grokPgliteReady;
}

export async function ensureDbReady(): Promise<void> {
  if (databaseUrl) return;
  if (Object.keys(migrationModules).length === 0) return;
  await getPglite();
}

void ensureDbReady();

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

function asDateString(value: Date) {
  return `${value.getUTCFullYear()}-${pad(value.getUTCMonth() + 1)}-${pad(value.getUTCDate())}`;
}

function normalizeValue(value: unknown): unknown {
  if (typeof value === "bigint") return Number(value);
  if (value instanceof Date) return asDateString(value);
  return value;
}

function normalizeRow<T>(row: Record<string, unknown>): T {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(row)) out[k] = normalizeValue(v);
  return out as T;
}

type SqlClient = {
  <T = Record<string, unknown>>(
    strings: TemplateStringsArray,
    ...values: unknown[]
  ): Promise<T[]>;
  query: <T = Record<string, unknown>>(text: string, params?: unknown[]) => Promise<T[]>;
};

function interpolate(strings: TemplateStringsArray, values: unknown[]) {
  let text = strings[0] ?? "";
  const params: unknown[] = [];
  values.forEach((value, i) => {
    params.push(value);
    text += `$${params.length}${strings[i + 1] ?? ""}`;
  });
  return { text, params };
}

export async function getSql(): Promise<SqlClient> {
  if (databaseUrl) {
    g.__grokPgPool ??= new pg.Pool({ connectionString: databaseUrl });
    const pool = g.__grokPgPool;
    const sql = (async <T = Record<string, unknown>>(
      strings: TemplateStringsArray,
      ...values: unknown[]
    ) => {
      const { text, params } = interpolate(strings, values);
      const result = await pool.query(text, params);
      return result.rows.map((row) => normalizeRow<T>(row as Record<string, unknown>));
    }) as SqlClient;
    sql.query = async <T = Record<string, unknown>>(text: string, params: unknown[] = []) => {
      const result = await pool.query(text, params);
      return result.rows.map((row) => normalizeRow<T>(row as Record<string, unknown>));
    };
    return sql;
  }

  const client = await getPglite();
  const sql = (async <T = Record<string, unknown>>(
    strings: TemplateStringsArray,
    ...values: unknown[]
  ) => {
    const { text, params } = interpolate(strings, values);
    const result = await client.query(text, params);
    return result.rows.map((row) => normalizeRow<T>(row as Record<string, unknown>));
  }) as SqlClient;
  sql.query = async <T = Record<string, unknown>>(text: string, params: unknown[] = []) => {
    const result = await client.query(text, params);
    return result.rows.map((row) => normalizeRow<T>(row as Record<string, unknown>));
  };
  return sql;
}
