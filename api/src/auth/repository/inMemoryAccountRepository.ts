import { failure, success } from "@/common/result/Result.js";

import type { Account, AccountRepository, NewAccount } from "./accountRepository.js";

export const createInMemoryAccountRepository = () => {
  const accounts: Account[] = [];
  let nextId = 1;

  return {
    async save(account: NewAccount) {
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
  } satisfies AccountRepository;
};
