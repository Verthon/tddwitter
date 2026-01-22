import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sql from "../src/infra/db.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const migrationsDir = path.join(__dirname, "migrations");

const getMigrationFiles = (): string[] => {
  return fs
    .readdirSync(migrationsDir)
    .filter((file) => file.endsWith(".sql"))
    .sort();
};

const runMigration = async (filePath: string): Promise<void> => {
  const content = fs.readFileSync(filePath, "utf-8");
  await sql.unsafe(content);
};

export const migrate = async (): Promise<void> => {
  console.log("Running migrations...");

  const files = getMigrationFiles();

  for (const file of files) {
    const filePath = path.join(migrationsDir, file);
    console.log(`  Applying ${file}...`);
    await runMigration(filePath);
  }

  console.log(`Done. Applied ${files.length} migration(s).`);
  await sql.end();
};

migrate().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
