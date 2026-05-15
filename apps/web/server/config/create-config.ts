export type ConfigEnv = Pick<
  Env,
  | "BETTER_AUTH_SECRET"
  | "BETTER_AUTH_URL"
  | "BETTER_AUTH_TRUSTED_ORIGINS"
  | "BETTER_AUTH_API_KEY"
  | "CORS_ORIGIN"
>;

export type AppConfig = ReturnType<typeof createConfig>;

export function createConfig(env: ConfigEnv) {
  return {
    betterAuth: {
      secret: env.BETTER_AUTH_SECRET ?? "cozydevs-local-development-secret-32",
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
