import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sql from "../src/infra/db.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const seedsDir = path.join(__dirname, "seeds");

const getSeedFiles = (): string[] => {
  try {
    console.log(`Reading seeds from: ${seedsDir}`);
    const files = fs
      .readdirSync(seedsDir)
      .filter((file) => file.endsWith(".sql"))
      .sort();
    console.log(`Found ${files.length} seed file(s): ${files.join(", ")}`);
    return files;
  } catch (err) {
    console.error(`Failed to read seeds directory: ${seedsDir}`, err);
    throw err;
  }
};

const runSeed = async (filePath: string): Promise<void> => {
  try {
    console.log(`Reading seed file: ${filePath}`);
    const content = fs.readFileSync(filePath, "utf-8");
    console.log(`Executing SQL (${content.length} chars)`);
    await sql.unsafe(content);
    console.log(`Successfully executed: ${path.basename(filePath)}`);
  } catch (err) {
    console.error(`Failed to run seed: ${filePath}`, err);
    throw err;
  }
};

export const seed = async (): Promise<void> => {
  console.log("=== Starting seed process ===");
  
  try {
    const files = getSeedFiles();
    
    for (const file of files) {
      const filePath = path.join(seedsDir, file);
      console.log(`\nProcessing: ${file}`);
      await runSeed(filePath);
    }
    
    console.log(`\n=== Seed complete. Applied ${files.length} seed(s) ===`);
  } catch (err) {
    console.error("\n=== Seed failed ===", err);
    throw err;
  } finally {
    console.log("Closing database connection");
    await sql.end();
  }
};

seed().catch((err) => {
  console.error("Fatal error during seed:", err);
  process.exit(1);
});