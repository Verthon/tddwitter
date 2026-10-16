import type { RefreshToken, RefreshTokenRepository } from "./refreshTokenRepository.js";

export const createInMemoryRefreshTokenRepository = (seed: readonly RefreshToken[] = []) => {
  let tokens: RefreshToken[] = [...seed];

  return {
    async save(token) {
      if (tokens.some((existing) => existing.tokenHash === token.tokenHash)) {
        throw new Error("duplicate key value violates unique constraint on token_hash");
      }
      tokens.push({ ...token, rotatedAt: null });
    },

    async findByHash(tokenHash) {
      return tokens.find((token) => token.tokenHash === tokenHash);
    },

    async markRotated(tokenHash, rotatedAt) {
      const index = tokens.findIndex(
        (token) => token.tokenHash === tokenHash && token.rotatedAt === null,
      );
      const token = tokens[index];
      if (!token) {
        return false;
      }
      tokens[index] = { ...token, rotatedAt };
      return true;
    },

    async deleteFamily(familyId) {
      tokens = tokens.filter((token) => token.familyId !== familyId);
    },
  } satisfies RefreshTokenRepository;
};
