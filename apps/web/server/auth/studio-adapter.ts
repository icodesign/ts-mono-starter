import type { StudioConfig } from "better-auth-studio";

import indexHtml from "../../node_modules/better-auth-studio/dist/public/index.html?raw";
import { injectLastSeenAtHooks } from "../../node_modules/better-auth-studio/dist/utils/hook-injector.js";
import { handleStudioApiRequest } from "./studio-api";

type TanStackServerHandlerContext = {
  request: Request;
};

type StudioConfigInput = StudioConfig | (() => StudioConfig | Promise<StudioConfig>);

const injectedAuthInstances = new WeakSet<object>();

export function betterAuthStudioCloudflare(configInput: StudioConfigInput) {
  return async ({ request }: TanStackServerHandlerContext) => {
    const config = await resolveStudioConfig(configInput);
    injectHooksOnce(config);
    const path = getStudioPath(request, config);

    if (isStaticAssetPath(path)) {
      return new Response("Studio asset should be served from public assets.", {
        status: 404,
        headers: {
          "Cache-Control": "no-cache",
          "Content-Type": "text/plain; charset=utf-8",
        },
      });
    }

    if (isHtmlRequest(request, path)) {
      return new Response(injectStudioConfig(indexHtml, prepareFrontendConfig(config)), {
        status: 200,
        headers: {
          "Cache-Control": "no-cache",
          "Content-Type": "text/html; charset=utf-8",
        },
      });
    }

    return handleStudioApiRequest(request, path, config);
  };
}

async function resolveStudioConfig(configInput: StudioConfigInput) {
  if (typeof configInput === "function") {
    return await configInput();
  }

  return configInput;
}

function injectHooksOnce(config: StudioConfig) {
  if (!config.auth || typeof config.auth !== "object") return;
  if (injectedAuthInstances.has(config.auth)) return;

  injectLastSeenAtHooks(config.auth, config);
  injectedAuthInstances.add(config.auth);
}

function getStudioPath(request: Request, config: StudioConfig) {
  const url = new URL(request.url);
  const basePath = normalizeBasePath(config.basePath || "/api/studio");

  if (url.pathname === basePath || url.pathname === `${basePath}/`) {
    return "/";
  }

  if (url.pathname.startsWith(`${basePath}/`)) {
    return url.pathname.slice(basePath.length) || "/";
  }

  return url.pathname || "/";
}

function normalizeBasePath(basePath: string) {
  if (basePath === "/") return "";
  return basePath.endsWith("/") ? basePath.slice(0, -1) : basePath;
}

function isStaticAssetPath(path: string) {
  return (
    path.startsWith("/assets/") ||
    path === "/favicon.svg" ||
    path === "/logo.png" ||
    path === "/shaders.png" ||
    path === "/vite.svg"
  );
}

function isHtmlRequest(request: Request, path: string) {
  if (request.method !== "GET" && request.method !== "HEAD") return false;
  if (path.startsWith("/api/") || path.startsWith("/auth/")) return false;
  if (path === "/") return true;

  const accept = request.headers.get("accept") || "";
  return accept.includes("text/html");
}

function prepareFrontendConfig(config: StudioConfig) {
  const defaultMetadata = {
    title: "Better Auth Studio",
    logo: "",
    favicon: "",
    company: {
      name: "",
      website: "",
    },
    theme: "dark",
    customStyles: "",
  };

  return {
    basePath: config.basePath || "",
    metadata: {
      ...defaultMetadata,
      ...config.metadata,
      company: {
        ...defaultMetadata.company,
        ...config.metadata?.company,
      },
    },
    tools:
      config.tools && Array.isArray(config.tools.exclude) && config.tools.exclude.length > 0
        ? { exclude: config.tools.exclude }
        : undefined,
  };
}

function injectStudioConfig(
  html: string,
  frontendConfig: ReturnType<typeof prepareFrontendConfig>,
) {
  const safeJson = JSON.stringify(frontendConfig)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");
  const escapedTitle = escapeHtml(frontendConfig.metadata.title);

  const configScript = `
    <script>
      const __BAS_THEME_KEY__ = "better-auth-studio-theme";
      window.__STUDIO_CONFIG__ = ${safeJson};
      Object.freeze(window.__STUDIO_CONFIG__);
      try {
        const configuredTheme = window.__STUDIO_CONFIG__?.metadata?.theme === "light" ? "light" : "dark";
        const storedTheme = window.localStorage.getItem(__BAS_THEME_KEY__);
        const activeTheme = storedTheme === "light" || storedTheme === "dark" ? storedTheme : configuredTheme;
        document.documentElement.dataset.theme = activeTheme;
        document.documentElement.style.colorScheme = activeTheme;
        document.documentElement.classList.remove("light", "dark");
        document.documentElement.classList.add(activeTheme);
      } catch {
        document.documentElement.dataset.theme = window.__STUDIO_CONFIG__?.metadata?.theme === "light" ? "light" : "dark";
        document.documentElement.style.colorScheme = document.documentElement.dataset.theme;
        document.documentElement.classList.remove("light", "dark");
        document.documentElement.classList.add(document.documentElement.dataset.theme);
      }
      if (window.__STUDIO_CONFIG__?.metadata?.title) {
        document.title = window.__STUDIO_CONFIG__.metadata.title;
      }
    </script>
  `;

  return html
    .replace(/<title>.*?<\/title>/i, `<title>${escapedTitle}</title>`)
    .replace(/href="\/assets\//g, `href="${frontendConfig.basePath}/assets/`)
    .replace(/src="\/assets\//g, `src="${frontendConfig.basePath}/assets/`)
    .replace(/href="\/vite\.svg"/g, `href="${frontendConfig.basePath}/vite.svg"`)
    .replace(/href="\/favicon\.svg"/g, `href="${frontendConfig.basePath}/favicon.svg"`)
    .replace(/href="\/logo\.png"/g, `href="${frontendConfig.basePath}/logo.png"`)
    .replace(/src="\/logo\.png"/g, `src="${frontendConfig.basePath}/logo.png"`)
    .replace("</head>", `${configScript}</head>`);
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
