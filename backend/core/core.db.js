import pg from 'pg';

const { Pool } = pg;

import {config} from "dotenv"

config()

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

export default pool;