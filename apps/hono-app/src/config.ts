import { z } from "zod";
import "dotenv/config";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.string().default("4000"),
  DOCS_PASSWORD: z.string(),
});

export const config = envSchema.parse(process.env);

export type Config = z.infer<typeof envSchema>;
