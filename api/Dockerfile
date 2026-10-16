FROM node:24-alpine AS base
RUN corepack enable
WORKDIR /repo

FROM base AS build
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm fetch
COPY api ./api
RUN pnpm install --offline --frozen-lockfile --filter api
RUN pnpm deploy --offline --filter api /out

FROM node:24-alpine AS runtime
WORKDIR /app
ENV PATH=/app/node_modules/.bin:$PATH
COPY --from=build /out ./
EXPOSE 4000
ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["tsx", "src/index.ts"]
