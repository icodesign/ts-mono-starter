import { Database as ServerfulDB } from "./serverful.js";
import { Database as ServerlessDB } from "./serverless.js";
import { Database as PoolDB } from "./pool.js";

import * as schema from "../shared/schema.js";

import type {
  BuildQueryResult,
  DBQueryConfig,
  ExtractTablesWithRelations,
} from "drizzle-orm";

export * from "../shared/schema.js";
export * from "drizzle-orm";

export type AnyDatabase = ServerfulDB | ServerlessDB | PoolDB;

type TSchema = ExtractTablesWithRelations<typeof schema>;
type QueryConfig<TableName extends keyof TSchema> = DBQueryConfig<
  "one" | "many",
  boolean,
  TSchema,
  TSchema[TableName]
>;

export type InferQueryModel<
  TableName extends keyof TSchema,
  QBConfig extends QueryConfig<TableName>,
> = BuildQueryResult<TSchema, TSchema[TableName], QBConfig>;
