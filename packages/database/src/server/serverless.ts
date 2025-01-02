import { neon } from "@neondatabase/serverless";
import { NeonHttpDatabase, drizzle } from "drizzle-orm/neon-http";
import { schema } from "../shared/schema.js";
export * from "drizzle-orm";

export type Database = NeonHttpDatabase<typeof schema>;

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

    const sql = neon(process.env.DATABASE_URL, {
      // fetchOptions: { cache: "no-store" },
    });

    this.instance = drizzle(sql, {
      schema,
      logger:
        process.env.NODE_ENV !== "production" &&
        process.env.DRIZZLE_DEBUG !== "false",
    });
    return this.instance;
  }
}
