import type { Failure, Result, Success } from "../result/Result.js";

type AnyResult = Result<unknown, unknown>;
type SuccessValue<R> = R extends Success<infer V> ? V : never;
type FailureError<R> = R extends Failure<infer E> ? E : never;
type FailureType<R> = Extract<FailureError<R>, { type: string }>["type"];

export const expectSuccess = <R extends AnyResult>(result: R): SuccessValue<R> => {
  if (result._tag === "Failure") {
    throw new Error(
      `Expected a Success, but got a Failure: ${JSON.stringify(result.error)}`
    );
  }
  return result.value as SuccessValue<R>;
};

export const expectFailure = <R extends AnyResult>(result: R): FailureError<R> => {
  if (result._tag === "Success") {
    throw new Error(
      `Expected a Failure, but got a Success: ${JSON.stringify(result.value)}`
    );
  }
  return result.error as FailureError<R>;
};

export const expectFailureOfType = <R extends AnyResult, T extends FailureType<R>>(
  result: R,
  type: T,
): Extract<FailureError<R>, { type: T }> => {
  const error = expectFailure(result) as { type: string };
  if (error.type !== type) {
    throw new Error(
      `Expected a Failure of type ${type}, but got: ${JSON.stringify(error)}`
    );
  }
  return error as Extract<FailureError<R>, { type: T }>;
};
