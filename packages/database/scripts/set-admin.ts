import { eq } from "drizzle-orm";

import { createDatabase } from "../src/client";
import { user } from "../src/schema";

const email = process.argv[2]?.trim();

if (email === "--help" || email === "-h") {
  printUsage();
  process.exit(0);
}

if (!email) {
  printUsage();
  process.exit(1);
}

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error("Missing DATABASE_URL.");
  process.exit(1);
}

const db = createDatabase(databaseUrl);
const [updatedUser] = await db
  .update(user)
  .set({
    role: "admin",
    updatedAt: new Date(),
  })
  .where(eq(user.email, email))
  .returning({
    id: user.id,
    email: user.email,
    role: user.role,
  });

if (!updatedUser) {
  console.error(`No user found for email: ${email}`);
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      ok: true,
      user: updatedUser,
    },
    null,
    2,
  ),
);

function printUsage() {
  console.log("Usage: DATABASE_URL=... bun run user:admin <email>");
}
