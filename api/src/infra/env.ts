import fs from "node:fs";
import { z } from "zod/v4";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  DB_HOST: z.string().min(1),
  DB_NAME: z.string().min(1),
  DB_USER_FILE: z.string().min(1),
  DB_PASSWORD_FILE: z.string().min(1),
  PORT: z.string().min(1)
});

type Env = z.infer<typeof envSchema>;

type EnvWithSecrets = Env & {
  DB_USER: string;
  DB_PASSWORD: string;
};

const readSecret = (filePath: string): string => {
  return fs.readFileSync(filePath, "utf-8").trim();
};

const createEnv = (): EnvWithSecrets => {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    const formatted = z.prettifyError(result.error);
    console.error("Invalid environment variables:\n", formatted);
    process.exit(1);
  }

  const env = result.data;

  return {
    ...env,
    DB_USER: readSecret(env.DB_USER_FILE),
    DB_PASSWORD: readSecret(env.DB_PASSWORD_FILE),
  };
};

let envInstance: EnvWithSecrets | null = null;

export const getEnv = (): EnvWithSecrets => {
  envInstance ??= createEnv();
  return envInstance;
};
