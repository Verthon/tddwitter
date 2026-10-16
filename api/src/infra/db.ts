import postgres from "postgres";
import { getEnv } from "./env.js";

const env = getEnv();

const MAX_CONNECTIONS = 10;
const IDLE_TIMEOUT_SECONDS = 30;
const CONNECT_TIMEOUT_SECONDS = 10;

const sql = postgres({
  host: env.DB_HOST,
  port: env.DB_PORT,
  database: env.DB_NAME,
  username: env.DB_USER,
  password: env.DB_PASSWORD,
  max: MAX_CONNECTIONS,
  idle_timeout: IDLE_TIMEOUT_SECONDS,
  connect_timeout: CONNECT_TIMEOUT_SECONDS,
});

export default sql;
