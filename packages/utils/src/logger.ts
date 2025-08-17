import { pino } from "pino";

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Logger {
  debug: (...args: any[]) => void;
  info: (...args: any[]) => void;
  warn: (...args: any[]) => void;
  error: (...args: any[]) => void;
}

function createLogger(): Logger {
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
