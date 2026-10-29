FROM node:26.12.1-alpine AS base
COPY --from=ghcr.io/pnpm/pnpm:12.16.1-alpine /opt/pnpm /opt/pnpm
RUN for bin in pnpm pn pnpx pnx; do ln -s "/opt/pnpm/$bin" "/usr/local/bin/$bin"; done
WORKDIR /repo

FROM base AS build
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm fetch
COPY api ./api
RUN pnpm install --offline --frozen-lockfile --filter api
RUN pnpm deploy --filter api /out

FROM node:26.12.1-alpine AS runtime
WORKDIR /app
ENV PATH=/app/node_modules/.bin:$PATH
COPY --from=build /out ./
EXPOSE 4000
ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["tsx", "src/index.ts"]
