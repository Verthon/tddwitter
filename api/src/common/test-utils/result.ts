import type { Result } from "../result/Result.js";

/**
 * Unwraps a Success or throws.
 * @example expectSuccess(ok(123))
 */
export const expectSuccess = <T, E>(result: Result<T, E>): T => {
  if (result._tag === "Failure") {
    throw new Error(
      `Expected a Success, but got a Failure: ${JSON.stringify(result.error)}`
    );
  }
  return result.value;
};

/**
 * Unwraps a Failure or throws.
 * @example expectFailure(err("nope"))
 */
export const expectFailure = <T, E>(result: Result<T, E>): E => {
  if (result._tag === "Success") {
    throw new Error(
      `Expected a Failure, but got a Success: ${JSON.stringify(result.value)}`
    );
  }
  return result.error;
};
