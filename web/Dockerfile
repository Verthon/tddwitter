FROM node:24.22.1-alpine AS base
RUN corepack enable
WORKDIR /repo

FROM base AS build
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm fetch
COPY web ./web
RUN pnpm install --offline --frozen-lockfile --filter web
RUN pnpm --filter web build

FROM nginx:1.29-alpine AS runtime
COPY web/nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /repo/web/dist /usr/share/nginx/html
EXPOSE 80
