import { Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import { schema } from "../shared/schema.js";

export interface Env {
  DATABASE_URL: string;
  NODE_ENV: string;
}

export function createDb(env: Env) {
  const pool = new Pool({ connectionString: env.DATABASE_URL });

  return drizzle(pool, {
    schema: schema,
    logger:
      env.NODE_ENV !== "production" && process.env.DRIZZLE_DEBUG !== "false",
  });
}

export type Database = ReturnType<typeof createDb>;
