import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";

const LOCKS_PATH = "docs/specs/locks.json";
const BANNED = /\b(?:it|test|describe)\.(?:skip|only|todo)\b|\bx(?:it|describe)\(/;

const hash = (path) =>
  createHash("sha256").update(readFileSync(path)).digest("hex");

const locks = JSON.parse(readFileSync(LOCKS_PATH, "utf-8"));

if (process.argv[2] === "--update") {
  const spec = process.argv[3];
  if (!locks[spec]) {
    console.error(`No lock entry for ${spec} in ${LOCKS_PATH}`);
    process.exit(1);
  }
  for (const path of Object.keys(locks[spec])) locks[spec][path] = hash(path);
  writeFileSync(LOCKS_PATH, `${JSON.stringify(locks, null, 2)}\n`);
  console.log(`Re-locked ${spec}`);
  process.exit(0);
}

const errors = [];
for (const [spec, files] of Object.entries(locks)) {
  for (const [path, expected] of Object.entries(files)) {
    if (hash(path) !== expected) {
      errors.push(`${path} changed but is locked by ${spec}`);
    }
    readFileSync(path, "utf-8")
      .split("\n")
      .forEach((line, i) => {
        if (BANNED.test(line)) errors.push(`${path}:${i + 1} skips or focuses a locked test`);
      });
  }
}

if (errors.length > 0) {
  console.error(errors.join("\n"));
  console.error("Locked acceptance tests change only with the user's approval: node scripts/check-locks.mjs --update <spec>");
  process.exit(1);
}
console.log("Locks OK");
