import { createAuthClient } from "better-auth/react";

function getBaseURL() {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  return process.env.BETTER_AUTH_URL ?? "http://localhost:8787";
}

export const authClient = createAuthClient({
  baseURL: getBaseURL(),
});
