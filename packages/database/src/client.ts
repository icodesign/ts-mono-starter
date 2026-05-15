import { drizzle as drizzlePostgres } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schema";

function createPostgresClient(databaseUrl: string) {
  return postgres(databaseUrl, {
    max: 5,
    fetch_types: false,
    prepare: true,
  });
}

export function createDatabase(databaseUrl: string) {
  const client = createPostgresClient(databaseUrl);

  return drizzlePostgres(client, {
    schema,
  });
}

export function createMockDatabase() {
  return drizzlePostgres.mock<typeof schema>({
    schema,
  });
}

export type Database = ReturnType<typeof createDatabase>;
export type MockDatabase = ReturnType<typeof createMockDatabase>;

export { schema };
