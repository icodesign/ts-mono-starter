import { SQL } from "drizzle-orm";
import { PgColumn, PgSelect } from "drizzle-orm/pg-core";

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
