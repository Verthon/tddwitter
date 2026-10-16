import { argon2, randomBytes, timingSafeEqual } from "node:crypto";

type Argon2Params = {
  memory: number;
  passes: number;
  parallelism: number;
};

const ARGON2_VERSION = 19;
const SALT_BYTES = 16;
const TAG_BYTES = 32;
const DEFAULT_PARAMS: Argon2Params = { memory: 19456, passes: 2, parallelism: 1 };

const PHC_PATTERN =
  /^\$argon2id\$v=19\$m=(\d+),t=(\d+),p=(\d+)\$([A-Za-z0-9+/]+)\$([A-Za-z0-9+/]+)$/;

const toBase64 = (bytes: Buffer) => bytes.toString("base64").replace(/=+$/, "");

const derive = (password: string, salt: Buffer, params: Argon2Params, tagLength: number) =>
  new Promise<Buffer>((resolve, reject) => {
    argon2(
      "argon2id",
      { message: password, nonce: salt, tagLength, ...params },
      (error, derivedKey) => (error ? reject(error) : resolve(derivedKey)),
    );
  });

const toPhc = (params: Argon2Params, salt: Buffer, tag: Buffer) =>
  `$argon2id$v=${ARGON2_VERSION}$m=${params.memory},t=${params.passes},p=${params.parallelism}$${toBase64(salt)}$${toBase64(tag)}`;

type ParsedPhc = { params: Argon2Params; salt: Buffer; tag: Buffer };

const parsePhc = (phc: string): ParsedPhc | undefined => {
  const match = PHC_PATTERN.exec(phc);
  if (!match) {
    return undefined;
  }
  const [, memory, passes, parallelism, salt, tag] = match;
  return {
    params: { memory: Number(memory), passes: Number(passes), parallelism: Number(parallelism) },
    salt: Buffer.from(salt ?? "", "base64"),
    tag: Buffer.from(tag ?? "", "base64"),
  };
};

const hash = async (password: string): Promise<string> => {
  const salt = randomBytes(SALT_BYTES);
  const tag = await derive(password, salt, DEFAULT_PARAMS, TAG_BYTES);
  return toPhc(DEFAULT_PARAMS, salt, tag);
};

const verify = async (password: string, passwordHash: string): Promise<boolean> => {
  const parsed = parsePhc(passwordHash);
  if (!parsed || parsed.salt.length < SALT_BYTES || parsed.tag.length < TAG_BYTES) {
    return false;
  }
  const candidate = await derive(password, parsed.salt, parsed.params, parsed.tag.length);
  return timingSafeEqual(candidate, parsed.tag);
};

export const passwordHasher = { hash, verify };
