import { schema } from "../shared/schema.js";
export * from "drizzle-orm";
import { drizzle, PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";

export type Database = PostgresJsDatabase<typeof schema>;

export class DatabaseFactory {
  private static instance: Database;

  private constructor() {}

  static getInstance() {
    if (this.instance) {
      return this.instance;
    }
    if (!process.env.DATABASE_URL) {
      throw new Error("Missing DATABASE_URL");
    }

    const sql = postgres(process.env.DATABASE_URL);

    this.instance = drizzle(sql, {
      schema,
      logger:
        process.env.NODE_ENV !== "production" &&
        process.env.DRIZZLE_DEBUG !== "false",
    });
    return this.instance;
  }
}
