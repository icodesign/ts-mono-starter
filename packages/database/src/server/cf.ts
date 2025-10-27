import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { schema } from "../shared/schema";

export interface Env {
  DATABASE_URL: string;
  DRIZZLE_LOGGER?: string;
}

export function createDb(env: Env) {
  const client = postgres(env.DATABASE_URL, {
    // https://orm.drizzle.team/docs/connect-supabase
    // If you decide to use connection pooling via Supabase (described here), and have “Transaction” pool mode enabled, then ensure to turn off prepare, as prepared statements are not supported.
    prepare: false,
    // https://developers.cloudflare.com/hyperdrive/examples/connect-to-postgres/postgres-drivers-and-libraries/drizzle-orm/
    max: 5, // Limit the connections for the Worker request to 5 due to Workers' limits on concurrent external connections
    fetch_types: false, // If you are not using array types in your Postgres schema, disable `fetch_types` to avoid an additional round-trip (unnecessary latency)
  });
  return drizzle(client, {
    schema: schema,
    logger: env.DRIZZLE_LOGGER === "1" || env.DRIZZLE_LOGGER === "true",
  });
}

export type Database = ReturnType<typeof createDb>;
