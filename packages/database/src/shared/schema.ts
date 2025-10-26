import { integer, pgTable } from "drizzle-orm/pg-core";

export const example = pgTable("example", {
  int: integer(),
});

export const schema = {
  example,
};
