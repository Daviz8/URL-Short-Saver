import dotenv from 'dotenv';
import pg from "pg";
dotenv.config();

const Db = new pg.Client({
    connectionString: process.env.POSTGRES_URL,
    ssl: {
    rejectUnauthorized: false // This allows self-signed certificates used by many cloud providers
  }
});


export default Db;