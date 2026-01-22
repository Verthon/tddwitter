import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sql from "../src/infra/db.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const seedsDir = path.join(__dirname, "seeds");

const getSeedFiles = (): string[] => {
  return fs
    .readdirSync(seedsDir)
    .filter((file) => file.endsWith(".sql"))
    .sort();
};

const runSeed = async (filePath: string): Promise<void> => {
  const content = fs.readFileSync(filePath, "utf-8");
  await sql.unsafe(content);
};

export const seed = async (): Promise<void> => {
  console.log("Running seeds...");

  const files = getSeedFiles();

  for (const file of files) {
    const filePath = path.join(seedsDir, file);
    console.log(`  Seeding ${file}...`);
    await runSeed(filePath);
  }

  console.log(`Done. Applied ${files.length} seed(s).`);
  await sql.end();
};

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
