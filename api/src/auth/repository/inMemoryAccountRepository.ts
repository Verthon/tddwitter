import { failure, success } from "@/common/result/Result.js";

import type { Account, AccountRepository } from "./accountRepository.js";

export const createInMemoryAccountRepository = (seed: readonly Account[] = []) => {
  const accounts: Account[] = [...seed];
  let nextId = accounts.reduce((max, account) => Math.max(max, account.id), 0) + 1;

  return {
    async save(account) {
      if (accounts.some((a) => a.email === account.email)) {
        return failure({ type: "DUPLICATE_EMAIL" as const });
      }

      const saved: Account = {
        id: nextId++,
        email: account.email,
        passwordHash: account.passwordHash,
        createdAt: new Date(),
      };
      accounts.push(saved);
      return success(saved);
    },

    async findByEmail(email) {
      return accounts.find((account) => account.email === email);
    },

    async findById(id) {
      return accounts.find((account) => account.id === id);
    },
  } satisfies AccountRepository;
};
