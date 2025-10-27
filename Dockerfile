# syntax=docker/dockerfile:1
ARG PROJECT="hono-app"
ARG TYPE="bun"
ARG BUN_VERSION="1.3"

FROM oven/bun:${BUN_VERSION}-debian AS base
ARG PROJECT
WORKDIR /app
RUN addgroup --system --gid 1001 app && \
    adduser --system --uid 1001 app

FROM base AS starter
RUN bun install turbo --global

FROM starter AS installer
COPY . .
RUN turbo prune ${PROJECT} --docker
RUN cp /app/bunfig.toml /app/out/json/bunfig.toml
RUN cp /app/bunfig.toml /app/out/full/bunfig.toml
# Install dev dependencies
RUN cd /app/out/json/ && bun install --frozen-lockfile --verbose
# Install prod dependencies
RUN cp /app/out/bun.lock /app/out/full/
RUN cd /app/out/full/ && bun install --frozen-lockfile --production --verbose

FROM starter AS prerelease
COPY --from=installer /app/out/json/ .
COPY --from=installer /app/out/full/ .
ENV NEXT_TELEMETRY_DISABLED=1
RUN turbo run build --filter=${PROJECT}

FROM base AS runner_bun
USER app
ENV NODE_ENV=production
COPY --from=prerelease --chown=app:app /app/apps/${PROJECT}/dist .
CMD ["/app/app"]

# To use with Next.js projects, you need to set output: 'standalone' in next.config
FROM base AS runner_nextjs
USER app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=prerelease --chown=app:app /app/apps/${PROJECT}/.next/standalone* .
COPY --from=prerelease --chown=app:app /app/apps/${PROJECT}/.next/static* ./apps/${PROJECT}/.next/static
COPY --from=prerelease --chown=app:app /app/apps/${PROJECT}/public* ./apps/${PROJECT}/public
ENV PROJECT_NAME=${PROJECT}
CMD bun run /app/apps/$PROJECT_NAME/server.js

FROM runner_${TYPE} AS final
