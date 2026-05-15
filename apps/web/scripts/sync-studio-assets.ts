import { cpSync, existsSync, mkdirSync, rmSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const packagePublicDir = resolve(appRoot, "node_modules/better-auth-studio/dist/public");
const targetDir = resolve(appRoot, "public/admin/auth");

if (!existsSync(packagePublicDir)) {
  throw new Error(`Better Auth Studio public assets not found: ${packagePublicDir}`);
}

rmSync(targetDir, { force: true, recursive: true });
mkdirSync(dirname(targetDir), { recursive: true });
cpSync(packagePublicDir, targetDir, { recursive: true });
rmSync(resolve(targetDir, "index.html"), { force: true });

console.log(`Synced Better Auth Studio assets to ${targetDir}`);
