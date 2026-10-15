import type { Failure, Result, Success } from "../result/Result.js";

type AnyResult = Result<unknown, unknown>;
type SuccessValue<R> = R extends Success<infer V> ? V : never;
type FailureError<R> = R extends Failure<infer E> ? E : never;

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
