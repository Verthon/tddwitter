const notImplemented = (): never => {
  throw new Error("Not implemented: docs/specs/login.md");
};

export const passwordHasher = {
  hash: async (_password: string): Promise<string> => notImplemented(),
  verify: async (_password: string, _passwordHash: string): Promise<boolean> =>
    notImplemented(),
};
