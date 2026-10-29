FROM node:26.12.1-alpine AS base
COPY --from=ghcr.io/pnpm/pnpm:12.16.1-alpine /opt/pnpm /opt/pnpm
RUN for bin in pnpm pn pnpx pnx; do ln -s "/opt/pnpm/$bin" "/usr/local/bin/$bin"; done
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
