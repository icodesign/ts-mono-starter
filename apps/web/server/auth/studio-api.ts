import type { StudioConfig } from "better-auth-studio";

import {
  createStudioSession,
  decryptSession,
  encryptSession,
  isSessionValid,
  STUDIO_COOKIE_NAME,
} from "../../node_modules/better-auth-studio/dist/utils/session.js";

type Primitive = string | number | boolean | null | Date;

type AdapterRecord = Record<string, Primitive | undefined>;

type AdapterWhere = {
  field: string;
  value: Primitive;
  operator?: string;
};

type AdapterQuery = {
  model: string;
  where?: AdapterWhere[];
  limit?: number;
  offset?: number;
  sortBy?: {
    field: string;
    direction: "asc" | "desc";
  };
};

type AuthAdapter = {
  findMany?: (query: AdapterQuery) => Promise<AdapterRecord[]>;
  findFirst?: (query: AdapterQuery) => Promise<AdapterRecord | null>;
  count?: (query: AdapterQuery) => Promise<number>;
  update?: (query: AdapterQuery & { update: AdapterRecord }) => Promise<AdapterRecord>;
  delete?: (query: AdapterQuery) => Promise<unknown>;
};

type StudioUser = {
  id: string;
  email: string;
  name?: string;
  role?: string;
};

const CORE_MODELS = ["user", "session", "account", "verification"] as const;

export async function handleStudioApiRequest(
  request: Request,
  rawPath: string,
  config: StudioConfig,
) {
  const path = normalizeApiPath(rawPath);

  if (request.method === "POST" && path === "/auth/sign-in") {
    return handleSignIn(request, config);
  }

  if (request.method === "GET" && path === "/auth/session") {
    return handleSession(request, config);
  }

  if (request.method === "GET" && path === "/auth/logout") {
    return handleLogout();
  }

  if (request.method === "POST" && path === "/auth/verify") {
    return handleVerify(request, config);
  }

  if (request.method === "GET" && path === "/health") {
    return json(getHealthStatus());
  }

  const authResponse = await requireStudioSession(request, config);
  if (authResponse) return authResponse;

  if (request.method === "GET" && path === "/db") {
    return json({
      success: true,
      name: "postgres",
      version: "unknown",
      dialect: "postgres",
      adapter: "drizzle",
      displayName: "Postgres",
      autoDetected: true,
    });
  }

  if (request.method === "GET" && path === "/config") {
    return json(await getConfig(config));
  }

  if (request.method === "GET" && path === "/version-check") {
    return json({
      current: "unknown",
      latest: "unknown",
      isOutdated: false,
      updateCommand: "bun add better-auth@latest",
    });
  }

  if (request.method === "GET" && path === "/events/status") {
    return json({
      initialized: false,
      enabled: false,
      configured: false,
      provider: null,
      message: "Event ingestion is not enabled in the Cloudflare Studio adapter.",
    });
  }

  if (request.method === "GET" && path === "/events") {
    return json({
      events: [],
      hasMore: false,
      nextCursor: null,
      total: 0,
      ready: false,
    });
  }

  if (request.method === "POST" && path === "/geo/resolve") {
    return json({
      success: false,
      location: null,
      error: "IP geolocation is not enabled in the Cloudflare Studio adapter.",
    });
  }

  if (request.method === "GET" && path === "/counts") {
    return json(await getCounts(config));
  }

  if (request.method === "GET" && path === "/stats") {
    return json(await getStats(config));
  }

  if (request.method === "GET" && path === "/analytics") {
    return json(await getAnalytics(request, config));
  }

  if (request.method === "GET" && path === "/plugins") {
    const plugins = getPlugins(config).filter((plugin) => !isInternalStudioPlugin(plugin.id));
    return json({
      plugins,
      configPath: null,
      totalPlugins: plugins.length,
    });
  }

  if (request.method === "GET" && path === "/plugins/organization/status") {
    return json(getOrganizationStatus(config));
  }

  if (request.method === "GET" && path === "/plugins/teams/status") {
    return json(getTeamsStatus(config));
  }

  if (request.method === "GET" && path === "/admin/status") {
    return json(getAdminStatus(config));
  }

  if (request.method === "POST" && path === "/admin/ban-user") {
    return updateAdminBanState(request, config, true);
  }

  if (request.method === "POST" && path === "/admin/unban-user") {
    return updateAdminBanState(request, config, false);
  }

  if (request.method === "GET" && path === "/database/schema") {
    return json(getDatabaseSchema());
  }

  if (request.method === "GET" && path === "/database/test") {
    const adapter = await getAuthAdapter(config);
    const users = await findMany(adapter, "user", { limit: 1 });
    return json({
      success: true,
      result: {
        adapterAvailable: !!adapter,
        models: CORE_MODELS,
        sampleUser: users[0] || null,
      },
    });
  }

  if (request.method === "POST" && path === "/tools/health-check") {
    return json(await getHealthCheck(config));
  }

  if (request.method === "POST" && path === "/tools/validate-config") {
    return json(await validateConfig(config));
  }

  if (request.method === "GET" && path === "/tools/oauth/providers") {
    return json({ providers: getSocialProviders(config) });
  }

  if (request.method === "GET" && path === "/users/all") {
    const adapter = await getAuthAdapter(config);
    const users = await findMany(adapter, "user", { limit: 100000 });
    return json({ success: true, users });
  }

  if (request.method === "GET" && path === "/users") {
    return json(await listUsers(request, config));
  }

  const userMatch = path.match(/^\/users\/([^/]+)$/);
  if (userMatch?.[1]) {
    if (request.method === "GET") {
      return json(await getUser(config, decodeURIComponent(userMatch[1])));
    }

    if (request.method === "PUT") {
      return updateUser(request, config, decodeURIComponent(userMatch[1]));
    }

    if (request.method === "DELETE") {
      return deleteRecord(config, "user", decodeURIComponent(userMatch[1]));
    }
  }

  const userSessionsMatch = path.match(/^\/users\/([^/]+)\/sessions$/);
  if (request.method === "GET" && userSessionsMatch?.[1]) {
    const adapter = await getAuthAdapter(config);
    const sessions = await findMany(adapter, "session", {
      where: [{ field: "userId", value: decodeURIComponent(userSessionsMatch[1]) }],
      limit: 100000,
    });
    return json({ sessions });
  }

  const userAccountsMatch = path.match(/^\/users\/([^/]+)\/accounts$/);
  if (request.method === "GET" && userAccountsMatch?.[1]) {
    const adapter = await getAuthAdapter(config);
    const accounts = await findMany(adapter, "account", {
      where: [{ field: "userId", value: decodeURIComponent(userAccountsMatch[1]) }],
      limit: 100000,
    });
    return json({ accounts });
  }

  const userOrganizationsMatch = path.match(/^\/users\/([^/]+)\/organizations$/);
  if (request.method === "GET" && userOrganizationsMatch?.[1]) {
    return json(
      await getUserOrganizationMemberships(config, decodeURIComponent(userOrganizationsMatch[1])),
    );
  }

  const userTeamsMatch = path.match(/^\/users\/([^/]+)\/teams$/);
  if (request.method === "GET" && userTeamsMatch?.[1]) {
    return json(await getUserTeamMemberships(config, decodeURIComponent(userTeamsMatch[1])));
  }

  const userInvitationsMatch = path.match(/^\/users\/([^/]+)\/invitations$/);
  if (request.method === "GET" && userInvitationsMatch?.[1]) {
    return json(await getUserInvitations(config, decodeURIComponent(userInvitationsMatch[1])));
  }

  if (request.method === "GET" && path === "/sessions") {
    const adapter = await getAuthAdapter(config);
    const sessions = await findMany(adapter, "session", { limit: 100000 });
    return json({ sessions });
  }

  const sessionMatch = path.match(/^\/sessions\/([^/]+)$/);
  if (request.method === "DELETE" && sessionMatch?.[1]) {
    return deleteRecord(config, "session", decodeURIComponent(sessionMatch[1]));
  }

  if (request.method === "GET" && path === "/organizations") {
    return json({ organizations: [] });
  }

  if (request.method === "GET" && path === "/teams") {
    return json({ teams: [] });
  }

  if (path.startsWith("/organizations/") || path.startsWith("/teams/")) {
    return json({ error: "Organization plugin is not enabled" }, { status: 404 });
  }

  return json(
    {
      error: "Studio route is not implemented in the Cloudflare adapter",
      path,
    },
    { status: 501 },
  );
}

async function handleSignIn(request: Request, config: StudioConfig) {
  if (!config.auth) {
    return json({ success: false, message: "Auth not configured" }, { status: 500 });
  }

  const body = (await request.json().catch(() => null)) as {
    email?: unknown;
    password?: unknown;
  } | null;
  const email = typeof body?.email === "string" ? body.email : "";
  const password = typeof body?.password === "string" ? body.password : "";

  if (!email || !password) {
    return json({ success: false, message: "Email and password required" }, { status: 400 });
  }

  try {
    const signInResult = await config.auth.api.signInEmail({
      body: { email, password },
      headers: request.headers,
    });
    const signedInUser = signInResult?.user;

    if (!signedInUser?.id) {
      return json({ success: false, message: "Invalid credentials" }, { status: 401 });
    }

    const user = await resolveAuthUser(config, signedInUser);
    const accessError = validateStudioAccess(user, config);
    if (accessError) return accessError;

    return json(
      {
        success: true,
        user: publicUser(user),
      },
      {
        headers: {
          "Set-Cookie": createSessionCookie(user, config),
        },
      },
    );
  } catch (error) {
    return json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Invalid credentials",
      },
      { status: 401 },
    );
  }
}

function handleSession(request: Request, config: StudioConfig) {
  const sessionCookie = parseCookies(request.headers.get("cookie"))[STUDIO_COOKIE_NAME];
  if (!sessionCookie) {
    return json({ authenticated: false });
  }

  const session = decryptSession(sessionCookie, getSessionSecret(config));
  if (!session || !isSessionValid(session)) {
    return json({ authenticated: false, reason: "expired" });
  }

  const user: StudioUser = {
    id: session.userId,
    email: session.email,
    name: session.name,
    role: session.role,
  };

  return json(
    {
      authenticated: true,
      user: publicUser(user),
    },
    {
      headers: {
        "Set-Cookie": createSessionCookie(user, config),
      },
    },
  );
}

function handleLogout() {
  return json(
    { success: true, message: "Logged out" },
    {
      headers: {
        "Set-Cookie": `${STUDIO_COOKIE_NAME}=; HttpOnly; SameSite=Lax; Max-Age=0; Path=/`,
      },
    },
  );
}

async function handleVerify(request: Request, config: StudioConfig) {
  if (!config.auth) {
    return json({ success: false, message: "Auth not configured" }, { status: 500 });
  }

  const session = await config.auth.api.getSession({ headers: request.headers });
  if (!session?.user) {
    return json({ success: false, message: "Not authenticated" }, { status: 401 });
  }

  const user = await resolveAuthUser(config, session.user);
  const accessError = validateStudioAccess(user, config);
  if (accessError) return accessError;

  return json(
    {
      success: true,
      user: publicUser(user),
    },
    {
      headers: {
        "Set-Cookie": createSessionCookie(user, config),
      },
    },
  );
}

async function requireStudioSession(request: Request, config: StudioConfig) {
  const sessionCookie = parseCookies(request.headers.get("cookie"))[STUDIO_COOKIE_NAME];
  if (!sessionCookie) {
    return json({ error: "Unauthorized" }, { status: 401 });
  }

  const session = decryptSession(sessionCookie, getSessionSecret(config));
  if (!session || !isSessionValid(session)) {
    return json({ error: "Unauthorized", reason: "expired" }, { status: 401 });
  }

  return null;
}

async function getConfig(config: StudioConfig) {
  const options = getAuthOptions(config);

  return {
    appName: valueOr(options.appName, "Better Auth"),
    baseURL: valueOr(options.baseURL, ""),
    basePath: valueOr(options.basePath, "/api/auth"),
    secret: options.secret ? "Configured" : "Not set",
    database: {
      type: "Drizzle",
      adapter: "drizzle",
      version: "unknown",
      casing: "camel",
      debugLogs: false,
      dialect: "postgres",
    },
    emailVerification: options.emailVerification || null,
    emailAndPassword: options.emailAndPassword || null,
    socialProviders: getSocialProviders(config),
    user: {
      modelName: "user",
      changeEmail: { enabled: false },
      deleteUser: { enabled: false, deleteTokenExpiresIn: 86400 },
    },
    session: options.session || null,
    account: options.account || null,
    verification: {
      modelName: "verification",
      disableCleanup: false,
    },
    trustedOrigins: options.trustedOrigins || [],
    rateLimit: options.rateLimit || null,
    advanced: options.advanced || null,
    disabledPaths: options.disabledPaths || [],
    telemetry: options.telemetry || null,
    studio: {
      version: "self-hosted",
      nodeVersion: "worker",
      platform: "cloudflare",
      uptime: 0,
    },
  };
}

async function getCounts(config: StudioConfig) {
  const adapter = await getAuthAdapter(config);
  const [users, sessions] = await Promise.all([
    countRecords(adapter, "user"),
    countRecords(adapter, "session"),
  ]);

  return {
    users,
    sessions,
    organizations: 0,
    teams: 0,
    events: 0,
  };
}

async function getStats(config: StudioConfig) {
  const adapter = await getAuthAdapter(config);
  const [users, sessions] = await Promise.all([
    findMany(adapter, "user", { limit: 100000 }),
    findMany(adapter, "session", { limit: 100000 }),
  ]);
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;

  return {
    totalUsers: users.length,
    totalSessions: sessions.length,
    activeSessions: sessions.filter((session) => toTime(session.expiresAt) > now).length,
    newUsersToday: users.filter((user) => now - toTime(user.createdAt) <= dayMs).length,
    verifiedUsers: users.filter((user) => user.emailVerified === true).length,
    bannedUsers: users.filter((user) => user.banned === true).length,
    totalOrganizations: 0,
    totalTeams: 0,
  };
}

async function getAnalytics(request: Request, config: StudioConfig) {
  const type = new URL(request.url).searchParams.get("type") || "users";
  const period = new URL(request.url).searchParams.get("period") || "ALL";
  const counts = await getCounts(config);
  const total = analyticsTotal(type, counts);

  return {
    type,
    period,
    total,
    data: [
      {
        date: new Date().toISOString(),
        count: total,
        value: total,
      },
    ],
  };
}

async function listUsers(request: Request, config: StudioConfig) {
  const url = new URL(request.url);
  const limit = clampNumber(Number(url.searchParams.get("limit") || "100"), 1, 1000);
  const page = clampNumber(Number(url.searchParams.get("page") || "1"), 1, 100000);
  const search = (url.searchParams.get("search") || "").trim().toLowerCase();
  const adapter = await getAuthAdapter(config);
  const users = await findMany(adapter, "user", { limit: 100000 });
  const filteredUsers = search
    ? users.filter((user) =>
        [user.email, user.name, user.id].some((value) =>
          String(value || "")
            .toLowerCase()
            .includes(search),
        ),
      )
    : users;
  const offset = (page - 1) * limit;

  return {
    users: filteredUsers.slice(offset, offset + limit),
    total: filteredUsers.length,
    page,
    limit,
  };
}

async function getUser(config: StudioConfig, userId: string) {
  const adapter = await getAuthAdapter(config);
  const users = await findMany(adapter, "user", {
    where: [{ field: "id", value: userId }],
    limit: 1,
  });
  const user = users[0] || null;

  if (!user) {
    return { error: "User not found" };
  }

  return { user };
}

async function updateUser(request: Request, config: StudioConfig, userId: string) {
  const adapter = await getAuthAdapter(config);
  if (!adapter?.update) {
    return json({ error: "Auth adapter update method not available" }, { status: 500 });
  }

  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  const update: AdapterRecord = {};
  for (const key of ["name", "email", "role", "image", "banned", "banReason", "banExpires"]) {
    const value = body[key];
    if (typeof value === "string" || typeof value === "boolean" || value === null) {
      update[key] = value;
    }
  }

  const user = await adapter.update({
    model: "user",
    where: [{ field: "id", value: userId }],
    update,
  });

  return json({ success: true, user });
}

async function getUserOrganizationMemberships(config: StudioConfig, userId: string) {
  const adapter = await getAuthAdapter(config);
  const [memberships, organizations] = await Promise.all([
    findMany(adapter, "member", { limit: 10000 }),
    findMany(adapter, "organization", { limit: 10000 }),
  ]);
  const formattedMemberships = memberships
    .filter((membership) => membership.userId === userId)
    .map((membership) => {
      const organization = organizations.find((org) => org.id === membership.organizationId);

      return {
        id: membership.id,
        organization: organization
          ? {
              id: organization.id,
              name: organization.name || "Unknown Organization",
              slug: organization.slug || "unknown",
              image: organization.image,
              createdAt: organization.createdAt,
            }
          : {
              id: membership.organizationId,
              name: "Unknown Organization",
              slug: "unknown",
              createdAt: membership.createdAt,
            },
        role: membership.role || "member",
        joinedAt: membership.createdAt,
      };
    });

  return { memberships: formattedMemberships };
}

async function getUserTeamMemberships(config: StudioConfig, userId: string) {
  const adapter = await getAuthAdapter(config);
  const [memberships, teams, organizations] = await Promise.all([
    findMany(adapter, "teamMember", { limit: 10000 }),
    findMany(adapter, "team", { limit: 10000 }),
    findMany(adapter, "organization", { limit: 10000 }),
  ]);
  const formattedMemberships = memberships
    .filter((membership) => membership.userId === userId)
    .map((membership) => {
      const team = teams.find((candidate) => candidate.id === membership.teamId);
      const organization = team
        ? organizations.find((candidate) => candidate.id === team.organizationId)
        : null;

      return {
        id: membership.id,
        team: team
          ? {
              id: team.id,
              name: team.name || "Unknown Team",
              organizationId: team.organizationId,
              organizationName: organization
                ? organization.name || "Unknown Organization"
                : "Unknown Organization",
              organizationSlug: organization ? organization.slug || "unknown" : "unknown",
            }
          : {
              id: membership.teamId,
              name: "Unknown Team",
              organizationId: "unknown",
              organizationName: "Unknown Organization",
              organizationSlug: "unknown",
            },
        role: membership.role || "member",
        joinedAt: membership.createdAt,
      };
    });

  return { memberships: formattedMemberships };
}

async function getUserInvitations(config: StudioConfig, userId: string) {
  const adapter = await getAuthAdapter(config);
  const users = await findMany(adapter, "user", {
    where: [{ field: "id", value: userId }],
    limit: 1,
  });
  const user = users[0];
  if (!user?.email) {
    return { success: true, invitations: [] };
  }

  const invitations = await findMany(adapter, "invitation", {
    where: [{ field: "email", value: user.email }],
    limit: 10000,
  });

  return {
    success: true,
    invitations: invitations.map((invitation) => ({
      id: invitation.id,
      email: invitation.email,
      role: invitation.role || "member",
      status: invitation.status || "pending",
      organizationId: invitation.organizationId,
      organizationName: "Unknown",
      teamId: invitation.teamId,
      teamName: undefined,
      inviterId: invitation.inviterId,
      expiresAt: invitation.expiresAt,
      createdAt: invitation.createdAt,
    })),
  };
}

async function updateAdminBanState(request: Request, config: StudioConfig, banned: boolean) {
  if (!getPlugins(config).some((plugin) => plugin.id === "admin")) {
    return json(
      {
        success: false,
        error:
          "Admin plugin is not enabled. Please enable the admin plugin in your Better Auth configuration.",
      },
      { status: 400 },
    );
  }

  const adapter = await getAuthAdapter(config);
  if (!adapter?.update) {
    return json({ success: false, error: "Auth adapter not available" }, { status: 500 });
  }

  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  const userId = typeof body.userId === "string" ? body.userId : "";
  if (!userId) {
    return json({ success: false, error: "userId is required" }, { status: 400 });
  }

  const update: AdapterRecord = banned
    ? {
        banned: true,
        banReason: typeof body.banReason === "string" ? body.banReason : null,
        banExpires:
          typeof body.banExpires === "string" || body.banExpires === null ? body.banExpires : null,
      }
    : {
        banned: false,
        banReason: null,
        banExpires: null,
      };

  const user = await adapter.update({
    model: "user",
    where: [{ field: "id", value: userId }],
    update,
  });

  return json({ success: true, user });
}

async function deleteRecord(config: StudioConfig, model: string, id: string) {
  const adapter = await getAuthAdapter(config);
  if (!adapter?.delete) {
    return json({ error: "Auth adapter delete method not available" }, { status: 500 });
  }

  await adapter.delete({
    model,
    where: [{ field: "id", value: id }],
  });

  return json({ success: true });
}

async function getHealthCheck(config: StudioConfig) {
  const adapter = await getAuthAdapter(config);
  const checks = [
    {
      label: "Auth Instance",
      endpoint: "/api/auth",
      ok: !!config.auth,
      name: "auth",
      status: config.auth ? "pass" : "fail",
      message: config.auth ? "Auth instance is configured" : "Auth instance is missing",
    },
    {
      label: "Auth Adapter",
      endpoint: "adapter",
      ok: !!adapter,
      name: "adapter",
      status: adapter ? "pass" : "fail",
      message: adapter ? "Auth adapter is available" : "Auth adapter is not available",
    },
  ];
  const failedChecks = checks.filter((check) => !check.ok);

  return {
    success: failedChecks.length === 0,
    message:
      failedChecks.length === 0
        ? "All Better Auth endpoints are healthy"
        : "Some Better Auth endpoints failed health checks",
    failedEndpoints: failedChecks.map((check) => ({
      endpoint: check.endpoint,
      status: null,
      error: check.message,
    })),
    checks,
  };
}

async function validateConfig(config: StudioConfig) {
  const adapter = await getAuthAdapter(config);
  const results = [
    {
      category: "auth",
      check: "auth instance",
      status: config.auth ? "pass" : "fail",
      severity: config.auth ? "info" : "error",
      message: config.auth ? "Auth instance is configured" : "Auth instance is missing",
    },
    {
      category: "database",
      check: "adapter",
      status: adapter ? "pass" : "fail",
      severity: adapter ? "info" : "error",
      message: adapter ? "Auth adapter is available" : "Auth adapter is not available",
    },
    {
      category: "access",
      check: "roles",
      status: config.access?.roles?.length ? "pass" : "warning",
      severity: config.access?.roles?.length ? "info" : "warning",
      message: config.access?.roles?.length
        ? `Allowed roles: ${config.access.roles.join(", ")}`
        : "No explicit Studio access roles configured",
    },
  ];
  const errors = results.filter((result) => result.severity === "error").length;
  const warnings = results.filter((result) => result.severity === "warning").length;
  const passes = results.filter((result) => result.status === "pass").length;
  const infos = results.filter((result) => result.severity === "info").length;

  return {
    success: errors === 0,
    summary: {
      total: results.length,
      passes,
      errors,
      warnings,
      infos,
    },
    results,
  };
}

async function resolveAuthUser(config: StudioConfig, user: StudioUser): Promise<StudioUser> {
  const adapter = await getAuthAdapter(config);
  const users = await findMany(adapter, "user", {
    where: [{ field: "id", value: user.id }],
    limit: 1,
  });
  const storedUser = users[0];
  if (!storedUser) return user;

  return {
    id: user.id,
    email: typeof storedUser.email === "string" ? storedUser.email : user.email,
    name: typeof storedUser.name === "string" ? storedUser.name : user.name,
    role: typeof storedUser.role === "string" ? storedUser.role : user.role,
  };
}

async function getAuthAdapter(config: StudioConfig): Promise<AuthAdapter | null> {
  const directAdapter = toAuthAdapter(config.auth?.adapter);
  if (directAdapter) return directAdapter;

  const context = await Promise.resolve(config.auth?.$context).catch(() => null);
  const contextAdapter = toAuthAdapter(context?.adapter);
  if (contextAdapter) return contextAdapter;

  return toAuthAdapter(config.auth?.options?.database);
}

function toAuthAdapter(value: unknown): AuthAdapter | null {
  if (!value || typeof value !== "object") return null;
  return value as AuthAdapter;
}

async function findMany(
  adapter: AuthAdapter | null,
  model: string,
  query: Omit<AdapterQuery, "model"> = {},
) {
  if (!adapter?.findMany) return [];

  const records = await adapter
    .findMany({
      model,
      ...query,
    })
    .catch(() => []);

  return records.filter((record) => matchesWhere(record, query.where));
}

async function countRecords(adapter: AuthAdapter | null, model: string) {
  if (!adapter) return 0;

  if (adapter.count) {
    const count = await adapter.count({ model }).catch(() => null);
    if (typeof count === "number") return count;
  }

  return findMany(adapter, model, { limit: 100000 }).then((records) => records.length);
}

function matchesWhere(record: AdapterRecord, where: AdapterWhere[] | undefined) {
  if (!where?.length) return true;

  return where.every((condition) => {
    const value = record[condition.field];
    if (condition.operator === "contains") {
      return String(value || "")
        .toLowerCase()
        .includes(String(condition.value || "").toLowerCase());
    }

    return value === condition.value;
  });
}

function validateStudioAccess(user: StudioUser, config: StudioConfig) {
  const allowedRoles = config.access?.roles || ["admin"];
  if (!allowedRoles.includes(user.role || "")) {
    return json(
      {
        success: false,
        message: `Access denied. Required role: ${allowedRoles.join(" or ")}`,
        userRole: user.role || "none",
      },
      { status: 403 },
    );
  }

  const allowedEmails = config.access?.allowEmails?.map((email) => email.toLowerCase());
  if (allowedEmails?.length && !allowedEmails.includes(user.email.toLowerCase())) {
    return json(
      {
        success: false,
        message: "Access denied. Your email is not authorized to access this dashboard.",
      },
      { status: 403 },
    );
  }

  return null;
}

function createSessionCookie(user: StudioUser, config: StudioConfig) {
  const studioSession = createStudioSession(user, getSessionDuration(config));
  const encryptedSession = encryptSession(studioSession, getSessionSecret(config));
  const parts = [
    `${STUDIO_COOKIE_NAME}=${encryptedSession}`,
    "HttpOnly",
    "SameSite=Lax",
    `Max-Age=${Math.floor(getSessionDuration(config) / 1000)}`,
    "Path=/",
  ];

  if (isProduction()) {
    parts.push("Secure");
  }

  return parts.join("; ");
}

function getSessionSecret(config: StudioConfig) {
  return (
    config.access?.secret ||
    config.auth?.options?.secret ||
    process.env.BETTER_AUTH_SECRET ||
    "studio-default-secret"
  );
}

function getSessionDuration(config: StudioConfig) {
  return (config.access?.sessionDuration || 7 * 24 * 60 * 60) * 1000;
}

function parseCookies(cookieHeader: string | null) {
  const cookies: Record<string, string> = {};
  if (!cookieHeader) return cookies;

  for (const part of cookieHeader.split(";")) {
    const [name, ...valueParts] = part.trim().split("=");
    if (name) {
      cookies[name] = valueParts.join("=");
    }
  }

  return cookies;
}

function normalizeApiPath(path: string) {
  if (path === "/") return "/";
  if (path.startsWith("/api/auth/")) return path.slice(4);
  if (path.startsWith("/api/")) return path.slice(4);
  if (path === "/sign-in" || path === "/session" || path === "/logout" || path === "/verify") {
    return `/auth${path}`;
  }
  if (path.startsWith("/oauth/")) return `/auth${path}`;
  return path;
}

function getAuthOptions(config: StudioConfig): Record<string, unknown> {
  const options = config.auth?.options;
  if (!options || typeof options !== "object") return {};
  return options as Record<string, unknown>;
}

function getPlugins(config: StudioConfig) {
  const plugins = getAuthOptions(config).plugins;
  if (!Array.isArray(plugins)) return [];

  return plugins
    .map((plugin) => {
      if (!plugin || typeof plugin !== "object") return null;
      const record = plugin as Record<string, unknown>;
      const id = typeof record.id === "string" ? record.id : "unknown";

      return {
        id,
        name: typeof record.name === "string" ? record.name : id,
        description:
          typeof record.description === "string"
            ? record.description
            : `${id} plugin for Better Auth`,
        enabled: true,
      };
    })
    .filter((plugin): plugin is NonNullable<typeof plugin> => !!plugin);
}

function getSocialProviders(config: StudioConfig) {
  const socialProviders = getAuthOptions(config).socialProviders;
  if (!socialProviders || typeof socialProviders !== "object") return [];

  return Object.entries(socialProviders as Record<string, Record<string, unknown>>).map(
    ([id, provider]) => ({
      type: id,
      id,
      name: id,
      enabled: !!(provider.clientId && provider.clientSecret),
      clientId: provider.clientId,
      clientSecret: provider.clientSecret ? "Configured" : undefined,
      redirectURI: provider.redirectURI,
    }),
  );
}

function getOrganizationStatus(config: StudioConfig) {
  const enabled = getPlugins(config).some((plugin) => plugin.id === "organization");
  return {
    enabled,
    configured: enabled,
    initialized: enabled,
    hasProvider: enabled,
    configPath: null,
  };
}

function getTeamsStatus(_config: StudioConfig) {
  return {
    enabled: false,
    configured: false,
    initialized: false,
    hasProvider: false,
    configPath: null,
  };
}

function getAdminStatus(config: StudioConfig) {
  const adminPlugin = getPlugins(config).find((plugin) => plugin.id === "admin") || null;

  return {
    enabled: !!adminPlugin,
    configPath: null,
    adminPlugin,
  };
}

function isInternalStudioPlugin(id: string) {
  return id === "better-auth-studio-events" || id === "better-auth-studio-last-seen";
}

function getDatabaseSchema() {
  const tables = [
    {
      name: "user",
      displayName: "User",
      origin: "core",
      fields: [
        field("id", "text", true),
        field("name", "text", true),
        field("email", "text", true, true),
        field("emailVerified", "boolean", true),
        field("image", "text", false),
        field("createdAt", "timestamp", true),
        field("updatedAt", "timestamp", true),
        field("role", "text", false),
        field("banned", "boolean", false),
        field("banReason", "text", false),
        field("banExpires", "timestamp", false),
      ],
      relationships: [
        { table: "session", field: "userId", type: "one-to-many" },
        { table: "account", field: "userId", type: "one-to-many" },
      ],
    },
    {
      name: "session",
      displayName: "Session",
      origin: "core",
      fields: [
        field("id", "text", true),
        field("expiresAt", "timestamp", true),
        field("token", "text", true, true),
        field("createdAt", "timestamp", true),
        field("updatedAt", "timestamp", true),
        field("ipAddress", "text", false),
        field("userAgent", "text", false),
        field("userId", "text", true),
        field("impersonatedBy", "text", false),
      ],
      relationships: [{ table: "user", field: "userId", type: "many-to-one" }],
    },
    {
      name: "account",
      displayName: "Account",
      origin: "core",
      fields: [
        field("id", "text", true),
        field("accountId", "text", true),
        field("providerId", "text", true),
        field("userId", "text", true),
        field("accessToken", "text", false),
        field("refreshToken", "text", false),
        field("idToken", "text", false),
        field("accessTokenExpiresAt", "timestamp", false),
        field("refreshTokenExpiresAt", "timestamp", false),
        field("scope", "text", false),
        field("password", "text", false),
        field("createdAt", "timestamp", true),
        field("updatedAt", "timestamp", true),
      ],
      relationships: [{ table: "user", field: "userId", type: "many-to-one" }],
    },
    {
      name: "verification",
      displayName: "Verification",
      origin: "core",
      fields: [
        field("id", "text", true),
        field("identifier", "text", true),
        field("value", "text", true),
        field("expiresAt", "timestamp", true),
        field("createdAt", "timestamp", true),
        field("updatedAt", "timestamp", true),
      ],
      relationships: [],
    },
  ];

  return {
    success: true,
    schema: {
      tables,
    },
    summary: {
      tableCount: tables.length,
      coreTableCount: tables.length,
      pluginTableCount: 0,
      fieldCount: tables.reduce((count, table) => count + table.fields.length, 0),
      relationshipCount: tables.reduce((count, table) => count + table.relationships.length, 0),
    },
    availablePlugins: [],
    selectedPlugins: [],
  };
}

function getHealthStatus() {
  return {
    status: "ok",
    timestamp: new Date().toISOString(),
    system: {
      studioVersion: "self-hosted",
      nodeVersion: "worker",
      platform: "cloudflare",
      arch: "unknown",
      uptime: "0h 0m 0s",
      memory: {
        used: 0,
        total: 0,
        external: 0,
      },
      pid: 0,
      cwd: "/",
    },
  };
}

function field(name: string, type: string, required: boolean, unique = false) {
  return {
    name,
    type,
    required,
    unique,
  };
}

function analyticsTotal(type: string, counts: Awaited<ReturnType<typeof getCounts>>) {
  switch (type) {
    case "sessions":
      return counts.sessions;
    case "organizations":
      return counts.organizations;
    case "teams":
      return counts.teams;
    default:
      return counts.users;
  }
}

function publicUser(user: StudioUser) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  };
}

function valueOr(value: unknown, fallback: string) {
  return typeof value === "string" && value ? value : fallback;
}

function toTime(value: Primitive | undefined) {
  if (value instanceof Date) return value.getTime();
  if (typeof value === "string" || typeof value === "number") {
    const time = new Date(value).getTime();
    return Number.isFinite(time) ? time : 0;
  }

  return 0;
}

function clampNumber(value: number, min: number, max: number) {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, Math.floor(value)));
}

function isProduction() {
  return process.env.NODE_ENV === "production";
}

function json(body: unknown, init: ResponseInit = {}) {
  const headers = new Headers(init.headers);
  headers.set("Content-Type", "application/json");

  return new Response(JSON.stringify(body), {
    ...init,
    headers,
  });
}
