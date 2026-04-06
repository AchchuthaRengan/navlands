import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import pg from "pg";

const repoRoot = process.cwd();
const envFilePath = path.join(repoRoot, ".env.local");
const generatedTypesPath = path.join(
  repoRoot,
  "src",
  "types",
  "db",
  "supabase.ts",
);
const { Client } = pg;

function parseEnvFile() {
  if (!fs.existsSync(envFilePath)) {
    throw new Error(
      "Missing .env.local. Hosted-dev Supabase commands require local env values.",
    );
  }

  const entries = fs
    .readFileSync(envFilePath, "utf8")
    .split(/\r?\n/)
    .filter(Boolean)
    .filter((line) => !line.trim().startsWith("#"))
    .map((line) => {
      const separatorIndex = line.indexOf("=");
      if (separatorIndex === -1) {
        return [line.trim(), ""];
      }

      return [
        line.slice(0, separatorIndex).trim(),
        line.slice(separatorIndex + 1).trim(),
      ];
    });

  return Object.fromEntries(entries);
}

function getRequiredEnv(name, env) {
  const value = env[name];

  if (!value) {
    throw new Error(`Missing ${name} in .env.local`);
  }

  return value;
}

function buildDbUrl(env) {
  const supabaseUrl = getRequiredEnv("NEXT_PUBLIC_SUPABASE_URL", env);
  const dbPassword = getRequiredEnv("SUPABASE_DB_PASSWORD", env);

  const match = supabaseUrl.match(/^https:\/\/([a-z0-9-]+)\.supabase\.co$/i);

  if (!match) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL must match https://<project-ref>.supabase.co",
    );
  }

  const projectRef = match[1];
  const encodedPassword = encodeURIComponent(dbPassword);

  return `postgresql://postgres:${encodedPassword}@db.${projectRef}.supabase.co:5432/postgres`;
}

function runSupabase(args, options = {}) {
  const result = spawnSync("pnpm", ["dlx", "supabase", ...args], {
    cwd: repoRoot,
    encoding: "utf8",
    shell: process.platform === "win32",
    stdio: options.captureStdout ? ["inherit", "pipe", "inherit"] : "inherit",
  });

  if (result.status !== 0) {
    throw new Error("Supabase command failed. Check the CLI output above.");
  }

  return result.stdout ?? "";
}

function writeGeneratedTypes(output) {
  fs.writeFileSync(generatedTypesPath, output.trimEnd() + "\n", "utf8");
}

async function generateTypesFromDatabase(dbUrl) {
  const client = new Client({
    connectionString: dbUrl,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  await client.connect();

  const enumResult = await client.query(`
    select
      t.typname as enum_name,
      e.enumlabel as enum_label
    from pg_type t
    join pg_enum e on t.oid = e.enumtypid
    join pg_namespace n on n.oid = t.typnamespace
    where n.nspname = 'public'
    order by t.typname, e.enumsortorder
  `);

  const columnResult = await client.query(`
    select
      table_name,
      column_name,
      is_nullable,
      column_default,
      data_type,
      udt_name
    from information_schema.columns
    where table_schema = 'public'
    order by table_name, ordinal_position
  `);

  await client.end();

  const enumMap = new Map();
  for (const row of enumResult.rows) {
    if (!enumMap.has(row.enum_name)) {
      enumMap.set(row.enum_name, []);
    }
    enumMap.get(row.enum_name).push(row.enum_label);
  }

  const tableMap = new Map();
  for (const row of columnResult.rows) {
    if (!tableMap.has(row.table_name)) {
      tableMap.set(row.table_name, []);
    }
    tableMap.get(row.table_name).push(row);
  }

  const pgTypeToTs = (row) => {
    if (enumMap.has(row.udt_name)) {
      return `Database["public"]["Enums"]["${row.udt_name}"]`;
    }

    const simpleType = row.udt_name || row.data_type;
    switch (simpleType) {
      case "uuid":
      case "text":
      case "varchar":
      case "bpchar":
      case "date":
      case "timestamp":
      case "timestamptz":
      case "timestamp with time zone":
      case "timestamp without time zone":
        return "string";
      case "bool":
      case "boolean":
        return "boolean";
      case "int2":
      case "int4":
      case "int8":
      case "float4":
      case "float8":
      case "numeric":
        return "number";
      case "json":
      case "jsonb":
        return "Json";
      default:
        return "string";
    }
  };

  const buildObjectShape = (columns, mode) =>
    columns
      .map((column) => {
        const baseType = pgTypeToTs(column);
        const nullableType =
          column.is_nullable === "YES" ? `${baseType} | null` : baseType;
        const hasDefault = column.column_default !== null;

        if (mode === "row") {
          return `          ${column.column_name}: ${nullableType}`;
        }

        const optional =
          mode === "update" || column.is_nullable === "YES" || hasDefault;

        const propertyType =
          mode === "update" && column.is_nullable !== "YES"
            ? baseType
            : nullableType;

        return `          ${column.column_name}${optional ? "?" : ""}: ${propertyType}`;
      })
      .join("\n");

  const enumsBlock =
    enumMap.size === 0
      ? "      [name: string]: never"
      : Array.from(enumMap.entries())
          .map(
            ([name, labels]) =>
              `      ${name}: ${labels.map((label) => JSON.stringify(label)).join(" | ")}`,
          )
          .join("\n");

  const tablesBlock =
    tableMap.size === 0
      ? "      [name: string]: never"
      : Array.from(tableMap.entries())
          .map(
            ([tableName, columns]) => `      ${tableName}: {
        Row: {
${buildObjectShape(columns, "row")}
        }
        Insert: {
${buildObjectShape(columns, "insert")}
        }
        Update: {
${buildObjectShape(columns, "update")}
        }
        Relationships: []
      }`,
          )
          .join("\n");

  return `export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
${tablesBlock}
    }
    Views: Record<string, never>
    Functions: {
      record_ai_call: {
        Args: {
          p_operation: string
          p_provider: string
          p_provider_mode: string
          p_status: string
          p_input_tokens?: number
          p_output_tokens?: number
          p_total_tokens?: number
          p_latency_ms?: number | null
          p_cache_hit?: boolean
          p_user_id?: string | null
          p_request_payload?: Json
          p_response_payload?: Json
          p_error_message?: string | null
        }
        Returns: string
      }
    }
    Enums: {
${enumsBlock}
    }
    CompositeTypes: Record<string, never>
  }
}
`;
}

async function main() {
  const command = process.argv[2];
  const env = parseEnvFile();
  const dbUrl = buildDbUrl(env);

  if (command === "db-push") {
    runSupabase(["db", "push", "--db-url", dbUrl, "--yes"]);
    return;
  }

  if (command === "gen-types") {
    const output = await generateTypesFromDatabase(dbUrl);
    writeGeneratedTypes(output);
    return;
  }

  throw new Error("Unknown command. Use db-push or gen-types.");
}

main();
