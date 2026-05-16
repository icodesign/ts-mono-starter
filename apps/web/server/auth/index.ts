import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { dash } from "@better-auth/infra";
import { createDatabase, createMockDatabase, schema } from "@workspace/database";
import { betterAuth } from "better-auth";
import { admin } from "better-auth/plugins";
import { type CloudflareGeolocation, withCloudflare } from "better-auth-cloudflare";
import { type ConfigEnv, createConfig } from "../config/create-config";

type CreateAuthOptions = {
  env?: Env & ConfigEnv;
  cf?: CloudflareGeolocation;
  baseURL?: string;
};

export function createAuth(options: CreateAuthOptions = {}) {
  const config = options.env ? createConfig(options.env) : createCliConfig();
  const databaseUrl = options.env?.HYPERDRIVE.connectionString ?? process.env.DATABASE_URL;
  const database = databaseUrl ? createDatabase(databaseUrl) : undefined;
  const runtimePostgres =
    options.env && database
      ? {
          postgres: {
            db: database,
            options: {
              schema,
            },
          },
        }
      : {};

  return betterAuth({
    appName: "Workspace",
    basePath: "/api/auth",
    baseURL: options.baseURL ?? config.betterAuth.url,
    secret: config.betterAuth.secret,
    trustedOrigins: config.betterAuth.trustedOrigins,
    ...withCloudflare(
      {
        autoDetectIpAddress: true,
        geolocationTracking: false,
        cf: options.cf ?? {},
        ...runtimePostgres,
      },
      {
        emailAndPassword: {
          enabled: true,
        },
        plugins: [
          admin(),
          ...(config.betterAuth.infraApiKey
            ? [
                dash({
                  apiKey: config.betterAuth.infraApiKey,
                }),
              ]
            : []),
        ],
      },
    ),
    ...(database
      ? {
          database: drizzleAdapter(database, {
            provider: "pg",
            schema,
          }),
        }
      : options.env
        ? {}
        : {
            database: drizzleAdapter(createMockDatabase(), {
              provider: "pg",
              schema,
            }),
          }),
  });
}

function createCliConfig() {
  const env = process.env as Partial<ConfigEnv>;

  return {
    betterAuth: {
      secret: env.BETTER_AUTH_SECRET ?? "workspace-local-development-secret-32",
      url: env.BETTER_AUTH_URL ?? "http://localhost:8787",
      trustedOrigins: splitCsv(env.BETTER_AUTH_TRUSTED_ORIGINS),
      infraApiKey: env.BETTER_AUTH_API_KEY,
    },
    cors: {
      origins: splitCsv(env.CORS_ORIGIN),
    },
  };
}

function splitCsv(value?: string): string[] {
  if (!value) return [];

  return value
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
}
