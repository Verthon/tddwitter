import type { Account, AccountRepository, NewAccount } from "./accountRepository.js";

export const createInMemoryAccountRepository = (): AccountRepository => {
  const accounts: Account[] = [];
  let nextId = 1;

  return {
    async findByEmail(email: string) {
      return accounts.find((a) => a.email === email) ?? null;
    },

    async save(account: NewAccount) {
      const saved: Account = {
        id: nextId++,
        email: account.email,
        passwordHash: account.passwordHash,
        createdAt: new Date(),
      };
      accounts.push(saved);
      return saved;
    },
  };
};
