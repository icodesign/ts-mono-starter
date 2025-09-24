# syntax=docker/dockerfile:1
ARG PROJECT="api"
ARG TYPE="node"
ARG NODE_VERSION="22"

FROM node:${NODE_VERSION}-slim AS base
ARG PROJECT
WORKDIR /app

FROM base AS builder
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
RUN pnpm add turbo --global

FROM builder AS starter
COPY . .
RUN rm -rf /app/out && turbo prune ${PROJECT} --docker

FROM builder AS installer
# Install dependencies
COPY --from=starter /app/out/json/ .
RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store pnpm fetch --frozen-lockfile
RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store pnpm install --dangerously-allow-all-builds --frozen-lockfile 
# Build project
COPY --from=starter /app/out/full/ .
RUN pnpm turbo run build --filter=${PROJECT}

FROM base AS runner_node
USER node
ENV NODE_ENV=production
COPY --from=installer --chown=node:node /app/apps/${PROJECT}/dist .
CMD [ "node", "index.cjs"]

FROM base AS runner_nextjs
USER node
ENV NODE_ENV=production
COPY --from=installer --chown=node:node /app/apps/${PROJECT}/.next/standalone* .
COPY --from=installer --chown=node:node /app/apps/${PROJECT}/.next/static* ./apps/${PROJECT}/.next/static
COPY --from=installer --chown=node:node /app/apps/${PROJECT}/public* ./apps/${PROJECT}/public
ENV PROJECT_NAME=${PROJECT}
CMD node /app/apps/$PROJECT_NAME/server.js

FROM runner_${TYPE} AS final
