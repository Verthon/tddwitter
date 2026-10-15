import type { ErrorHandler } from "hono";
import { HTTPException } from "hono/http-exception";

import { localizedMessage } from "@/i18n/localizedResponse.js";

export const handleUnexpectedError: ErrorHandler = (error, c) => {
  if (error instanceof HTTPException) {
    return error.getResponse();
  }

  console.error(error);
  return c.json(
    { error: localizedMessage({ en: "Something went wrong" }) },
    500,
  );
};
