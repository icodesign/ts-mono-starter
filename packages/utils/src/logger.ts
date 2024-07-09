import pino from "pino";
import { log as nextLog } from "@logtail/next";

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
      if (process.env.LOGTAIL_SOURCE_TOKEN) {
        // next.js
        return nextLog;
      } else if (process.env.BETTER_STACK_NODE_SOURCE_TOKEN) {
        // node
        const transport = pino.transport({
          target: "@logtail/pino",
          options: { sourceToken: process.env.BETTER_STACK_NODE_SOURCE_TOKEN },
        });
        return pino(
          {
            level: "info",
          },
          transport
        );
      } else {
        return pino({
          level: "info",
        });
      }
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
