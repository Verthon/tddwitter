import postgres from "postgres";
import { getEnv } from "./env.js";

const env = getEnv();

const sql = postgres({
  host: env.DB_HOST,
  database: env.DB_NAME,
  username: env.DB_USER,
  password: env.DB_PASSWORD,
});

export default sql;
