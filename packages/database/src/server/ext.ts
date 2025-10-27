import { SQL } from "drizzle-orm";
import { PgColumn, type PgSelect } from "drizzle-orm/pg-core";
import * as schema from "../shared/schema";
import type {
  BuildQueryResult,
  DBQueryConfig,
  ExtractTablesWithRelations,
} from "drizzle-orm";

export function withPagination<T extends PgSelect>({
  qb,
  orderBy,
  page,
  pageSize,
}: {
  qb: T;
  orderBy: PgColumn | SQL | SQL.Aliased;
  page: number;
  pageSize: number;
}) {
  return qb
    .orderBy(orderBy)
    .limit(pageSize)
    .offset((page - 1) * pageSize);
}

type TSchema = ExtractTablesWithRelations<typeof schema>;
type QueryConfig<TableName extends keyof TSchema> = DBQueryConfig<
  "one" | "many",
  boolean,
  TSchema,
  TSchema[TableName]
>;

export type InferQueryModel<
  TableName extends keyof TSchema,
  QBConfig extends QueryConfig<TableName>
> = BuildQueryResult<TSchema, TSchema[TableName], QBConfig>;
