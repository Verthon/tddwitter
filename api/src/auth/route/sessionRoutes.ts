import type { Hono } from "hono";

import type { SessionService } from "../session/sessionService.js";

type SessionRoutesDeps = {
  sessionService: SessionService;
  jwtSecret: string;
};

export const createSessionRoutes = (_deps: SessionRoutesDeps): Hono => {
  throw new Error("Not implemented: docs/specs/login.md");
};
