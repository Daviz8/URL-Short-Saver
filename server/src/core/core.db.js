import dotenv from 'dotenv';
import pg from "pg";
dotenv.config();

const Db = new pg.Client({
    connectionString: process.env.POSTGRES_URL,
    ssl: {
    rejectUnauthorized: false 
  }
});


export default Db;