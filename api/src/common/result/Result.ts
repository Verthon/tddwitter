type Success<Value> = {
  readonly _tag: "Success";
  readonly value: Value;
};

type Failure<Error> = {
  readonly _tag: "Failure";
  readonly error: Error;
};

export type Result<Value, Error> = Success<Value> | Failure<Error>;

export const success = <Value>(value: Value): Success<Value> => ({
  _tag: "Success",
  value,
});

export const failure = <Error>(error: Error): Failure<Error> => ({
  _tag: "Failure",
  error,
});
