// import { neon, Pool, neonConfig } from "@neondatabase/serverless";
// import { drizzle, NeonDatabase } from "drizzle-orm/neon-serverless";
// import { schema } from "../shared/schema.js";
// export * from "drizzle-orm";
// import ws from "ws";

// export type Database = NeonDatabase<typeof schema>;

// export class DatabaseFactory {
//   private static instance: Database;

//   private constructor() {}

//   static getInstance() {
//     if (this.instance) {
//       return this.instance;
//     }
//     if (!process.env.DATABASE_URL) {
//       throw new Error("Missing DATABASE_URL");
//     }

//     neonConfig.webSocketConstructor = ws;
//     const sql = new Pool({
//       connectionString: process.env.DATABASE_URL,
//     });

//     this.instance = drizzle(sql, {
//       schema,
//       logger:
//         process.env.NODE_ENV !== "production" &&
//         process.env.DRIZZLE_DEBUG !== "false",
//     });
//     return this.instance;
//   }
// }
