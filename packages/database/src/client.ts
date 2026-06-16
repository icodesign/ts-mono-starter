import { drizzle as drizzlePostgres } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import * as schema from "./schema";

function createPostgresClient(databaseUrl: string) {
  return new Pool({
    connectionString: databaseUrl,
    max: 5,
  });
}

export function createDatabase(databaseUrl: string) {
  const client = createPostgresClient(databaseUrl);

  return drizzlePostgres({
    client,
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
