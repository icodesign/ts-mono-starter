import { spawn } from "node:child_process";
import { access, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const packageRoot = path.resolve(scriptDir, "..");
const [source, ...cliArgs] = process.argv.slice(2);
const supportedSources = new Set(["shadcn"]);

if (!source || !supportedSources.has(source)) {
  console.error("Usage: bun scripts/shadcn.ts <shadcn> [...shadcn args]");
  process.exit(1);
}

const sourceConfigPath = path.join(
  packageRoot,
  "src/components/community",
  source,
  "components.json",
);
const rootConfigPath = path.join(packageRoot, "components.json");

async function exists(filePath: string) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

const hadRootConfig = await exists(rootConfigPath);
const previousRootConfig = hadRootConfig ? await readFile(rootConfigPath, "utf8") : null;

try {
  const config = JSON.parse(await readFile(sourceConfigPath, "utf8"));
  config.tailwind = {
    ...config.tailwind,
    css: "src/styles/globals.css",
  };

  await writeFile(rootConfigPath, `${JSON.stringify(config, null, 2)}\n`);

  const child = spawn("bunx", ["shadcn@latest", ...cliArgs], {
    cwd: packageRoot,
    stdio: "inherit",
    shell: false,
  });

  const exitCode = await new Promise<number>((resolve, reject) => {
    child.on("error", reject);
    child.on("exit", (code) => resolve(code ?? 1));
  });

  process.exitCode = exitCode;
} finally {
  if (hadRootConfig && previousRootConfig != null) {
    await writeFile(rootConfigPath, previousRootConfig);
  } else {
    await rm(rootConfigPath, { force: true });
  }
}
