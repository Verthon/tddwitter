import { type Env, Hono } from "hono";

import { handleUnexpectedError } from "../http/handleUnexpectedError.js";

export const createTestApp = <E extends Env>(routes: Hono<E>) =>
  new Hono().onError(handleUnexpectedError).route("/", routes);

export const rejectWith =
  (error: unknown = new Error("unexpected")) =>
  async (..._args: never[]): Promise<never> => {
    throw error;
  };
