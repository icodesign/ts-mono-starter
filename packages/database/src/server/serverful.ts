import { schema } from "../shared/schema";
import { drizzle, PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { log } from "@workspace/utils/logger";

export type Database = PostgresJsDatabase<typeof schema>;

export class DatabaseFactory {
  private static instance: Database;

  private constructor() {}

  static getInstance() {
    if (this.instance) {
      return this.instance;
    }
    if (!process.env.DATABASE_URL) {
      log.warn("DATABASE_URL is not set in environment variables");
    }
    const connectionString = process.env.DATABASE_URL || "";
    const sql = postgres(connectionString);

    this.instance = drizzle(sql, {
      schema,
      logger:
        process.env.NODE_ENV !== "production" &&
        process.env.DRIZZLE_DEBUG !== "false",
    });
    return this.instance;
  }
}
