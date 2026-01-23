import { pino } from "pino";

function createLogger(): ReturnType<typeof pino> {
  const isBrowser = typeof window !== "undefined";
  if (process.env.NODE_ENV === "production") {
    if (isBrowser) {
      return pino({
        level: "warn",
      });
    } else {
      return pino({
        level: "info",
      });
    }
  } else {
    if (isBrowser) {
      return pino({
        level: "debug",
      });
    } else {
      return pino({
        level: "debug",
      });
    }
  }
}

export const log = createLogger();
