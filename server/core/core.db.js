import pg from "pg";
import { config } from "dotenv";

config();

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "short",
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
});

export default db;
